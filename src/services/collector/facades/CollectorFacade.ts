import { VisionElixirFacade } from '../../app/facades/VisionElixirFacade'
import { Collector, SERVICE_COLLECTOR } from '../types'

export const CollectorFacade = VisionElixirFacade<Collector>(SERVICE_COLLECTOR)
