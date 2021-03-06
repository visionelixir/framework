import { VisionElixirFacade } from '../../app/facades/VisionElixirFacade'
import { VisionElixirConfig } from '../../app/types'
import { SERVICE_CONFIG } from '../types'

export const ConfigFacade = VisionElixirFacade<VisionElixirConfig>(
  SERVICE_CONFIG,
)
