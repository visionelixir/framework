import {
  AppType,
  KeyValue,
  Service,
  SERVICE_APP,
  VisionElixirConfig,
  VisionElixirJobConfig,
} from './types'
import { Emitter, Event, VisionElixirApplicationEvents } from '../event/types'
import { AppMiddleware } from './middleware/AppMiddleware'
import { Container } from '../container/types'
import { App } from './lib/App'
import { VisionElixirZoneEvents } from '../zone/types'
import { VisionElixirEvent } from '../event/lib/VisionElixirEvent'
import { Middleware } from '../core/types'

export default class AppService implements Service {
  public applicationRegisterEvents(
    emitter: Emitter,
    container: Container,
  ): void {
    const app = container.resolve<App>(SERVICE_APP)

    const config: VisionElixirConfig | VisionElixirJobConfig = {
      ...app.getConfig(),
    }

    const appMiddleware: Middleware[] = [
      AppMiddleware.initServices(),
      AppMiddleware.bootServices(),
      AppMiddleware.setupContext(),
    ]

    if (config.type === AppType.APP) {
      const path = `${config.baseDirectory}/${config.static.directory}`

      appMiddleware.push(
        AppMiddleware.response(),
        AppMiddleware.compress(),
        AppMiddleware.serveStatic(path, config.static),
        AppMiddleware.bodyParser(),
      )
    }

    emitter.on(
      VisionElixirApplicationEvents.INIT_MIDDLEWARE,
      (event: Event): void => {
        const { middleware } = event.getData()
        middleware.push(...appMiddleware)
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
