import { Service } from '../app/types'
import { Container } from '../container/types'
import { ZoneManager } from './lib/VisionElixirZoneManager'
import { SERVICE_ZONE } from './types'

export default class ZoneService implements Service {
  public globalInit(container: Container): void {
    container.singleton(SERVICE_ZONE, ZoneManager)
  }
}
