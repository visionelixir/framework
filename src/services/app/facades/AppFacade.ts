import { VisionElixirFacade } from '../lib/VisionElixirFacade'
import { SERVICE_APP } from '../types'
import { App } from '../lib/App'

export const AppFacade = VisionElixirFacade<App>(SERVICE_APP)
