import { KeyValue, Service, SERVICE_APP } from './types'
import { Emitter, Event, VisionElixirApplicationEvents } from '../event/types'
import { AppMiddleware } from './middleware/AppMiddleware'
import { Container } from '../container/types'
import { App } from './lib/App'
import { VisionElixirZoneEvents } from '../zone/types'
import { VisionElixirEvent } from '../event/lib/VisionElixirEvent'

export default class AppService implements Service {
  public applicationRegisterEvents(
    emitter: Emitter,
    container: Container,
  ): void {
    const app = container.resolve<App>(SERVICE_APP)

    const config: KeyValue = { ...app.getConfig() }
    const path = `${config.baseDirectory}/${config.static.directory}`
    delete config.static.directory

    emitter.on(
      VisionElixirApplicationEvents.INIT_MIDDLEWARE,
      (event: Event): void => {
        const { middleware } = event.getData()
        middleware.push(
          AppMiddleware.initServices(),
          AppMiddleware.bootServices(),
          AppMiddleware.response(),
          AppMiddleware.compress(),
          AppMiddleware.serveStatic(path, config.static),
          AppMiddleware.bodyParser(),
          AppMiddleware.setupContext(),
        )
      },
    )

    emitter.on(
      VisionElixirZoneEvents.ZONE_SETUP,
      (event: VisionElixirEvent) => {
        const data = event.getData<KeyValue>()
        data.app = app
      },
    )
  }
}
