import { Context, HttpStatus, Middleware, Next } from '../../core/types'
import { PayloadError } from '../errors/PayloadError'
import { VisionElixirError } from '../errors/VisionElixirError'
import {
  Emitter,
  SERVICE_EMITTER,
  VisionElixirRequestEvents,
} from '../../event/types'
import { VisionElixirEvent } from '../../event/lib/VisionElixirEvent'
import { VisionElixir } from '../../app/lib/VisionElixir'
import { Logger, SERVICE_LOGGER } from '../../logging/types'

export class ErrorMiddleware {
  public static errorHandler(): Middleware {
    const errorHandler = async (ctx: Context, next: Next): Promise<void> => {
      try {
        ctx.error = null
        await next()
      } catch (error) {
        const { status } = ctx

        if (!String(status).startsWith('5')) {
          ctx.status = HttpStatus.INTERNAL_SERVER_ERROR
        }

        if (!(error instanceof PayloadError)) {
          const err = new VisionElixirError<{ error: Error }>(error.message, {
            payload: { error },
          })
          err.stack = error.stack
          error = err
        }

        ctx.error = error

        this.log(error, ctx)
      }

      const { status } = ctx
      await this.emitEvent(status, ctx.error, ctx)
    }

    Reflect.defineProperty(errorHandler, 'name', {
      value: 'ErrorMiddleware.errorHandler',
    })

    return errorHandler
  }

  protected static async emitEvent(
    status: number,
    error: PayloadError<Error> | null,
    ctx: Context,
  ): Promise<void> {
    const emitter = VisionElixir.service<Emitter>(SERVICE_EMITTER)

    if (
      status !== undefined &&
      !String(status).startsWith('2') &&
      !String(status).startsWith('3')
    ) {
      await emitter.emit(
        VisionElixirRequestEvents.RESPONSE_ERROR,
        new VisionElixirEvent({
          status,
          error,
          ctx,
        }),
      )
    }
  }

  protected static log(error: PayloadError<Error>, ctx: Context): void {
    const logger = VisionElixir.service<Logger>(SERVICE_LOGGER)

    const { method, url } = ctx

    logger.critical('Error', error.getMessage(), {
      type: error.getType(),
      name: error.getName(),
      message: error.getMessage(),
      payload: error.getPayload(),
      stack: error.getStack(),
      method,
      url,
    })
  }
}
