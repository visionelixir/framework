import { VisionElixirFacade } from '../../app/lib/VisionElixirFacade'
import { DatabaseManager, SERVICE_DATABASE } from '../types'

export const DatabaseFacade = VisionElixirFacade<DatabaseManager>(
  SERVICE_DATABASE,
)
