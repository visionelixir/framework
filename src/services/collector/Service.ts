import { Container } from '../container/types'
import { VisionElixirCollector } from './lib/VisionElixirCollector'
import { Service } from '../app/types'
import { Emitter, VisionElixirLocalEvents } from '../event/types'
import { VisionElixirEvent } from '../event/lib/VisionElixirEvent'
import { VisionElixir } from '../app/lib/VisionElixir'
import { Collector, SERVICE_COLLECTOR } from './types'
import { Logger, SERVICE_LOGGER } from '../logging/types'

export default class CollectorService implements Service {
  public init(container: Container): void {
    container.singleton(SERVICE_COLLECTOR, new VisionElixirCollector())
  }

  public registerEvents(emitter: Emitter): void {
    const { collector } = VisionElixir.service<{
      collector: Collector
      logger: Logger
    }>(SERVICE_COLLECTOR, SERVICE_LOGGER)

    emitter.on(VisionElixirLocalEvents.APP_DATA, (event: VisionElixirEvent) => {
      const { collection, payload } = event.getData()
      collector.add(collection, payload)
    })
  }
}
