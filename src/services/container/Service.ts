import { Emitter } from '../event/types'
import { VisionElixirZoneEvents } from '../zone/types'
import { VisionElixirEvent } from '../event/lib/VisionElixirEvent'
import { KeyValue, Service } from '../app/types'
import { VisionElixirContainer } from './lib/VisionElixirContainer'
import { Container, Containers } from './types'

export default class ContainerService implements Service {
  public applicationRegisterEvents(
    emitter: Emitter,
    applicationContainer: Container,
  ): void {
    emitter.on(
      VisionElixirZoneEvents.ZONE_SETUP,
      (event: VisionElixirEvent) => {
        // create the request container extending the application container
        const container = new VisionElixirContainer(
          Containers.REQUEST,
          applicationContainer,
        )

        // get the zone data object
        const data = event.getData<KeyValue>()

        // add the container and application container
        // into the zone
        data.container = container
        data.applicationContainer = applicationContainer
      },
    )
  }
}
