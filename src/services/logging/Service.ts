import { Service, VisionElixirConfig } from '../app/types'
import { VisionElixirLogger } from './lib/VisionElixirLogger'
import { Container } from '../container/types'
import { SERVICE_LOGGER } from './types'
import { SERVICE_CONFIG } from '../config/types'

export default class LoggerService implements Service {
  public applicationInit(container: Container): void {
    const config = container.resolve<VisionElixirConfig>(SERVICE_CONFIG).logging
    const logger = new VisionElixirLogger(config?.type, config)

    container.singleton(SERVICE_LOGGER, logger)
  }
}
