import { Service } from '../app/types'
import { Container } from '../container/types'
import { ZoneManager } from './lib/VisionElixirZoneManager'
import { SERVICE_ZONE } from './types'

export default class ZoneService implements Service {
  public async applicationInit(container: Container): Promise<void> {
    container.singleton(SERVICE_ZONE, ZoneManager)
  }
}
