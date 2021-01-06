import { VisionElixirFacade } from '../../app/lib/VisionElixirFacade'
import { Performance, SERVICE_PERFORMANCE } from '../types'

export const PerformanceFacade = VisionElixirFacade<Performance>(
  SERVICE_PERFORMANCE,
)
