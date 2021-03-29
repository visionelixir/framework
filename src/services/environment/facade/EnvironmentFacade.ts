import { VisionElixirFacade } from '../../app/facades/VisionElixirFacade'
import { Environment } from '../lib/Environment'
import { SERVICE_ENVIRONMENT } from '../types'

export const EnvironmentFacade = VisionElixirFacade<Environment>(
  SERVICE_ENVIRONMENT,
)
