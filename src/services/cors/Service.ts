import {
  AppType,
  Service,
  SERVICE_APP,
  VisionElixirConfig,
  VisionElixirJobConfig,
} from '../app/types'
import { Middleware } from '../core/types'
import { App } from '../app/lib/App'
import { Container } from '../container/types'
import cors = require('@koa/cors')

export default class CorsService implements Service {
  public async middleware(
    middleware: Middleware[],
    container: Container,
  ): Promise<void> {
    const app = container.resolve<App>(SERVICE_APP)

    const config: VisionElixirConfig | VisionElixirJobConfig = {
      ...app.getConfig(),
    }

    Reflect.defineProperty(cors, 'name', {
      value: 'CorsMiddleware.cors',
    })

    if (config.type === AppType.APP && config.cors) {
      middleware.push(cors(config.cors))
    } else {
      middleware.push(cors())
    }
  }
}
