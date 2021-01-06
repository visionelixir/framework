import { VisionElixirFacade } from '../../app/lib/VisionElixirFacade'
import { Environment } from '../lib/Environment'
import { SERVICE_ENVIRONMENT } from '../types'

export const EnvironmentFacade = VisionElixirFacade<Environment>(
  SERVICE_ENVIRONMENT,
)
