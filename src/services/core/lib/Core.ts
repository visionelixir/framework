import * as Koa from 'koa'
import * as onFinished from 'on-finished'
import * as statuses from 'statuses'
import * as Stream from 'stream'
import { ZoneManager } from '../../zone/lib/VisionElixirZoneManager'
import { Container } from '../../container/types'
import { App } from '../../app/lib/App'
import { StringUtility } from '../../../utilities/StringUtility'
import { Emitter, SERVICE_EMITTER } from '../../event/types'
import { KeyValue } from '../../app/types'
import { VisionElixirZoneEvents } from '../../zone/types'
import { VisionElixirEvent } from '../../event/lib/VisionElixirEvent'
import { Context, HttpStatus } from '../types'

export class Core extends Koa {
  protected container: Container
  protected app: App

  constructor(options: { container: Container; app: App }) {
    super()

    this.container = options.container
    this.app = options.app
  }

  public handleRequest(
    ctx: Context,
    fnMiddleware: (ctx: Context) => Promise<void>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    const id = StringUtility.id('Request:')

    const emitter = this.container.resolve<Emitter>(SERVICE_EMITTER)

    const shared: KeyValue = {}

    emitter.emit(
      VisionElixirZoneEvents.ZONE_SETUP,
      new VisionElixirEvent(shared),
    )

    const zone = ZoneManager.getCurrentZone().fork({
      properties: { id, ctx, ...shared },
    })

    let result

    zone.run(async () => {
      const res = ctx.res
      res.statusCode = HttpStatus.NOT_FOUND
      const onerror = (err: Error) => ctx.onerror(err)
      const handleResponse = () => respond(ctx)
      onFinished(res, onerror)
      result = fnMiddleware(ctx).then(handleResponse).catch(onerror)
    })

    return result
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
function respond(ctx: any) {
  // allow bypassing koa
  if (false === ctx.respond) return

  if (!ctx.writable) return

  const res = ctx.res
  let body = ctx.body
  const code = ctx.status

  // ignore body
  if (statuses.empty[code]) {
    // strip headers
    ctx.body = null
    return res.end()
  }

  if ('HEAD' === ctx.method) {
    if (!res.headersSent && !ctx.response.has('Content-Length')) {
      const { length } = ctx.response
      if (Number.isInteger(length)) ctx.length = length
    }
    return res.end()
  }

  // status body
  if (null == body) {
    if (ctx.response._explicitNullBody) {
      ctx.response.remove('Content-Type')
      ctx.response.remove('Transfer-Encoding')
      return res.end()
    }
    if (ctx.req.httpVersionMajor >= 2) {
      body = String(code)
    } else {
      body = ctx.message || String(code)
    }
    if (!res.headersSent) {
      ctx.type = 'text'
      ctx.length = Buffer.byteLength(body)
    }
    return res.end(body)
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body)
  if ('string' === typeof body) return res.end(body)
  if (body instanceof Stream) return body.pipe(res)

  // body: json
  body = JSON.stringify(body)
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body)
  }
  res.end(body)
}
