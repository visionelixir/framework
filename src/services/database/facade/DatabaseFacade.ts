import { VisionElixirFacade } from '../../app/lib/VisionElixirFacade'
import { Database, SERVICE_DATABASE } from '../types'

export const DatabaseFacade = VisionElixirFacade<Database>(SERVICE_DATABASE)
