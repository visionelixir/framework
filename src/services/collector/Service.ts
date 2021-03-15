import { Container } from '../container/types'
import { VisionElixirCollector } from './lib/VisionElixirCollector'
import { Service } from '../app/types'
import { Emitter, VisionElixirRequestEvents } from '../event/types'
import { VisionElixirEvent } from '../event/lib/VisionElixirEvent'
import { VisionElixir } from '../app/lib/VisionElixir'
import { Collector, SERVICE_COLLECTOR } from './types'
import { Logger, SERVICE_LOGGER } from '../logging/types'

export default class CollectorService implements Service {
  /**
   * Init
   * @param container
   *
   * Creates a collector for this request cycle
   * and adds it into the request container
   */
  public async init(container: Container): Promise<void> {
    container.singleton(SERVICE_COLLECTOR, new VisionElixirCollector())
  }

  /**
   * Register Events
   * @param emitter
   *
   * Adds a listener for all APP_DATA events to add the passed data into
   * the collector.
   */
  public registerEvents(emitter: Emitter): void {
    const { collector } = VisionElixir.service<{
      collector: Collector
      logger: Logger
    }>(SERVICE_COLLECTOR, SERVICE_LOGGER)

    emitter.on(
      VisionElixirRequestEvents.APP_DATA,
      (event: VisionElixirEvent) => {
        const { collection, payload } = event.getData()
        collector.add(collection, payload)
      },
    )
  }
}
