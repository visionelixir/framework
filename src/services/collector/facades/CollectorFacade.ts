import { VisionElixirFacade } from '../../app/lib/VisionElixirFacade'
import { Collector, SERVICE_COLLECTOR } from '../types'

export const CollectorFacade = VisionElixirFacade<Collector>(SERVICE_COLLECTOR)
