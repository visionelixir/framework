import { KeyValue, Service, SERVICE_APP } from './types'
import { Emitter, Event, VisionElixirGlobalEvents } from '../event/types'
import { AppMiddleware } from './middleware/AppMiddleware'
import { Container } from '../container/types'
import { App } from './lib/App'
import { VisionElixirZoneEvents } from '../zone/types'
import { VisionElixirEvent } from '../event/lib/VisionElixirEvent'

export default class AppService implements Service {
  public globalRegisterEvents(emitter: Emitter, container: Container): void {
    const app = container.resolve<App>(SERVICE_APP)

    const config: KeyValue = { ...app.getConfig() }
    const path = `${config.baseDirectory}/${config.static.directory}`
    delete config.static.directory

    emitter.on(
      VisionElixirGlobalEvents.INIT_MIDDLEWARE,
      (event: Event): void => {
        const { middleware } = event.getData()
        middleware.push(
          AppMiddleware.initServices(),
          AppMiddleware.bootServices(),
          AppMiddleware.response(),
          AppMiddleware.compress(),
          AppMiddleware.serveStatic(path, config.static),
          AppMiddleware.bodyParser(),
        )
      },
    )

    emitter.on(
      VisionElixirZoneEvents.ZONE_SETUP,
      (event: VisionElixirEvent) => {
        const data = event.getData()
        data.app = app
      },
    )
  }
}
