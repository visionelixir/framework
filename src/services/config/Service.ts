import { Container } from '../container/types'
import { Service, SERVICE_APP } from '../app/types'
import { App } from '../app/lib/App'
import { SERVICE_CONFIG } from './types'

export default class ConfigService implements Service {
  public async applicationInit(container: Container): Promise<void> {
    const app = container.resolve<App>(SERVICE_APP)

    container.singleton(SERVICE_CONFIG, app.getConfig())
  }
}
