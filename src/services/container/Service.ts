import { Emitter } from '../event/types'
import { VisionElixirZoneEvents } from '../zone/types'
import { VisionElixirEvent } from '../event/lib/VisionElixirEvent'
import { Service } from '../app/types'
import { VisionElixirContainer } from './lib/VisionElixirContainer'
import { Container, Containers } from './types'

export default class ContainerService implements Service {
  public globalRegisterEvents(
    emitter: Emitter,
    globalContainer: Container,
  ): void {
    emitter.on(
      VisionElixirZoneEvents.ZONE_SETUP,
      (event: VisionElixirEvent) => {
        // create the local container extending the global container
        const container = new VisionElixirContainer(
          Containers.LOCAL,
          globalContainer,
        )

        // get the zone data object
        const data = event.getData()

        // add the container and global container
        // into the zone
        data.container = container
        data.globalContainer = globalContainer
      },
    )
  }
}
