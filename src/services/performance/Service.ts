import { Container } from '../container/types'
import { VisionElixirPerformance } from './lib/VisionElixirPerformance'
import { KeyValue, Service, SERVICE_APP } from '../app/types'
import { Emitter, VisionElixirLocalEvents } from '../event/types'
import { Performance, SERVICE_PERFORMANCE } from './types'
import { VisionElixirPerformanceMark } from './lib/VisionElixirPerformanceMark'
import { VisionElixirEvent } from '../event/lib/VisionElixirEvent'
import { NumberUtility } from '../../utilities/NumberUtility'
import { App } from '../app/lib/App'

export default class PerformanceService implements Service {
  public globalInit(container: Container): void {
    const app = container.resolve<App>(SERVICE_APP)

    container.singleton(SERVICE_PERFORMANCE, app.getPerformance())
  }

  public init(container: Container): void {
    container.singleton(SERVICE_PERFORMANCE, new VisionElixirPerformance())
  }

  public registerEvents(emitter: Emitter, container: Container): void {
    const performance = container.resolve<Performance>(SERVICE_PERFORMANCE)

    emitter.on(VisionElixirLocalEvents.RESPONSE_PRE, (): void => {
      performance.clearAll()
      performance.start('App:Response')
    })

    emitter.on(VisionElixirLocalEvents.RESPONSE_POST, (): void => {
      performance.stop('App:Response')

      const benchmarks = performance.allArray()
      const payload: KeyValue = {}

      benchmarks.map((mark: VisionElixirPerformanceMark) => {
        // stop the performance mark if it's still running
        if (mark.isRunning()) {
          mark.stop()
        }

        payload[mark.getName()] = NumberUtility.round(mark.getDuration())
      })

      emitter.emit(
        VisionElixirLocalEvents.APP_DATA,
        new VisionElixirEvent({ collection: 'performance', payload }),
      )
    })
  }
}
