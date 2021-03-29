import { VisionElixirFacade } from '../../app/facades/VisionElixirFacade'
import { Logger, SERVICE_LOGGER } from '../types'

export const LoggerFacade = VisionElixirFacade<Logger>(SERVICE_LOGGER)
