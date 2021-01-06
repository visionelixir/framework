import { VisionElixirFacade } from '../../app/lib/VisionElixirFacade'
import { Logger, SERVICE_LOGGER } from '../types'

export const LoggerFacade = VisionElixirFacade<Logger>(SERVICE_LOGGER)
