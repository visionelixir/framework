import { Service } from '../app/types'
import { Emitter, Event, VisionElixirApplicationEvents } from '../event/types'
import { ErrorMiddleware } from './middleware/ErrorMiddleware'

export default class ErrorService implements Service {
  public applicationRegisterEvents(emitter: Emitter): void {
    emitter.on(
      VisionElixirApplicationEvents.INIT_MIDDLEWARE,
      (event: Event): void => {
        const { middleware } = event.getData()
        middleware.splice(1, 0, ErrorMiddleware.errorHandler())
      },
    )
  }
}
