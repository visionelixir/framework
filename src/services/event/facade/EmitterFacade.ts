import { VisionElixirFacade } from '../../app/facades/VisionElixirFacade'
import { Emitter, SERVICE_EMITTER } from '../types'

export const EmitterFacade = VisionElixirFacade<Emitter>(SERVICE_EMITTER)
