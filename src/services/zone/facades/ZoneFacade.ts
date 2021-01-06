import { VisionElixirFacade } from '../../app/lib/VisionElixirFacade'
import { SERVICE_ZONE } from '../types'
import { ZoneManager } from '../lib/VisionElixirZoneManager'

export const ZoneFacade = VisionElixirFacade<typeof ZoneManager>(SERVICE_ZONE)
