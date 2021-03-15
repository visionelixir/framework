import { Middleware } from '../types'
import { KeyValue } from '../../app/types'
import { VisionElixirZoneEvents } from '../../zone/types'
import { VisionElixirEvent } from '../../event/lib/VisionElixirEvent'
import { ZoneManager } from '../../zone/lib/VisionElixirZoneManager'
import { StringUtility } from '../../../utilities/StringUtility'
import { Emitter, SERVICE_EMITTER } from '../../event/types'
import { Container } from '../../container/types'
import * as compose from 'koa-compose'
import { App } from '../../app/lib/App'

export class JobCore {
  protected container: Container
  protected app: App
  protected middleware: Middleware[]

  constructor(options: { container: Container; app: App }) {
    this.container = options.container
    this.app = options.app
    this.middleware = []
  }

  public use(fn: Middleware): JobCore {
    this.middleware.push(fn)
    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async run(data: KeyValue = {}): Promise<any> {
    const id = StringUtility.id('RunId:')
    const fn = compose(this.middleware)
    const ctx = { data }

    const emitter = this.container.resolve<Emitter>(SERVICE_EMITTER)

    const configuredZoneProperties: KeyValue = {}

    emitter.emit(
      VisionElixirZoneEvents.ZONE_SETUP,
      new VisionElixirEvent(configuredZoneProperties),
    )

    const zone = ZoneManager.getCurrentZone().fork({
      properties: { id, ctx, ...configuredZoneProperties },
    })

    await zone.run(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await fn(ctx as any)
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (ctx as any).result
  }
}
