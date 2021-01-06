import { Service, VisionElixirConfig } from '../app/types'
import { VisionElixirLogger } from './lib/ElixirLogger'
import { Container } from '../container/types'
import { LoggingDriver, SERVICE_LOGGER } from './types'
import { SERVICE_CONFIG } from '../config/types'

export default class LoggerService implements Service {
  public globalInit(container: Container): void {
    const logger = new VisionElixirLogger(
      container.resolve<VisionElixirConfig>(SERVICE_CONFIG).logging?.type ||
        LoggingDriver.CONSOLE,
    )

    container.singleton(SERVICE_LOGGER, logger)
  }
}
