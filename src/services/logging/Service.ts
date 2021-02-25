import { KeyValue, Service, VisionElixirConfig } from '../app/types'
import { VisionElixirLogger } from './lib/VisionElixirLogger'
import { Container } from '../container/types'
import {
  GoogleCloudLoggingConfig,
  LoggingDriver,
  SERVICE_LOGGER,
} from './types'
import { SERVICE_CONFIG } from '../config/types'

export default class LoggerService implements Service {
  public applicationInit(container: Container): void {
    const loggerConfig = container.resolve<VisionElixirConfig>(SERVICE_CONFIG)
    const loggingDriver: LoggingDriver =
      loggerConfig.logging?.type || LoggingDriver.CONSOLE

    let config: KeyValue = {}

    switch (loggingDriver) {
      case LoggingDriver.GCLOUD:
        config = loggerConfig.logging?.googleCloud as GoogleCloudLoggingConfig
        break
    }
    const logger = new VisionElixirLogger(loggingDriver, config)

    container.singleton(SERVICE_LOGGER, logger)
  }
}
