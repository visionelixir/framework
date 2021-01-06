import { Service } from '../app/types'
import { Emitter, Event, VisionElixirGlobalEvents } from '../event/types'
import { ErrorMiddleware } from './middleware/ErrorMiddleware'

export default class ErrorService implements Service {
  public globalRegisterEvents(emitter: Emitter): void {
    emitter.on(
      VisionElixirGlobalEvents.INIT_MIDDLEWARE,
      (event: Event): void => {
        const { middleware } = event.getData()
        middleware.splice(1, 0, ErrorMiddleware.errorHandler())
      },
    )
  }
}
