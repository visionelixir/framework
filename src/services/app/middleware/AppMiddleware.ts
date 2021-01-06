import * as Path from 'path'
import * as serveStaticMiddleware from 'koa-static'
import * as compressMiddleware from 'koa-compress'
import * as bodyParserMiddleware from 'koa-bodyparser'
import { KeyValue, Service } from '../types'
import { Context, Middleware, Next } from '../../core/types'
import { VisionElixir } from '../lib/VisionElixir'
import { Container } from '../../container/types'
import {
  Emitter,
  SERVICE_EMITTER,
  VisionElixirLocalEvents,
} from '../../event/types'
import { VisionElixirEvent } from '../../event/lib/VisionElixirEvent'
import { App } from '../lib/App'

export class AppMiddleware {
  /**
   * Serve Static
   *
   * Handles serving static files from the static file folder
   */
  public static serveStatic(root: string, options: KeyValue): Middleware {
    const serveStatic = serveStaticMiddleware(Path.normalize(root), options)

    Reflect.defineProperty(serveStatic, 'name', {
      value: 'AppMiddleware.serveStatic',
    })

    return serveStatic
  }

  /**
   * Compress
   *
   * Handles compression of the response
   */
  public static compress(): Middleware {
    const compress = compressMiddleware()

    Reflect.defineProperty(compress, 'name', {
      value: 'AppMiddleware.compress',
    })

    return compress
  }

  /**
   * Body Parser
   *
   * Handles parsing the incoming request body
   */
  public static bodyParser(): Middleware {
    const bodyParser = bodyParserMiddleware()

    Reflect.defineProperty(bodyParser, 'name', {
      value: 'AppMiddleware.bodyParser',
    })

    return bodyParser
  }

  /**
   * Setup Context
   *
   * Adds additional data to the koa context
   */

  public static setupContext(): Middleware {
    const setupContext = async (ctx: Context, next: Next): Promise<void> => {
      ctx.data = {}
      ctx.visionElixir = VisionElixir

      await next()
    }

    return setupContext
  }

  /**
   * Init Services
   *
   * Handles running the init function of each registered service
   * This is local to the request/response
   */
  public static initServices(): Middleware {
    const initServices = async (_ctx: Context, next: Next): Promise<void> => {
      const serviceObjects: Service[] = VisionElixir.service<App>(
        'app',
      ).getServiceObjects()

      serviceObjects.forEach((service: Service) => {
        if (service.init) {
          service.init(VisionElixir.container())
        }
      })

      await next()
    }

    Reflect.defineProperty(initServices, 'name', {
      value: 'AppMiddleware.initServices',
    })

    return initServices
  }

  /**
   * Boot Services
   *
   * Handles running the boot function of each registered service
   * This is local to the request/response
   */
  public static bootServices(): Middleware {
    const bootServices = async (_ctx: Context, next: Next): Promise<void> => {
      const serviceObjects: Service[] = VisionElixir.service<App>(
        'app',
      ).getServiceObjects()

      serviceObjects.forEach((service: Service) => {
        if (service.boot) {
          service.boot(VisionElixir.container())
        }
      })

      await next()
    }

    Reflect.defineProperty(bootServices, 'name', {
      value: 'AppMiddleware.bootServices',
    })

    return bootServices
  }

  /**
   * Response
   *
   * Fires events when a request starts and ends
   */
  public static response(): Middleware {
    const response: Middleware = async (ctx, next) => {
      const container: Container = VisionElixir.container()
      const emitter = container.resolve<Emitter>(SERVICE_EMITTER)

      // listen on the response finish event
      ctx.res.on('finish', () => {
        emitter.emit(
          VisionElixirLocalEvents.RESPONSE_POST,
          new VisionElixirEvent({ ctx }),
        )
      })

      emitter.emit(
        VisionElixirLocalEvents.RESPONSE_PRE,
        new VisionElixirEvent({ ctx }),
      )

      await next()
    }

    Reflect.defineProperty(response, 'name', {
      value: 'AppMiddleware.response',
    })

    return response
  }
}
