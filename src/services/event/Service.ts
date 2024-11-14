import { Service, SERVICE_APP } from '../app/types'
import { Container } from '../container/types'
import { VisionElixirEmitter } from './lib/VisionElixirEmitter'
import { App } from '../app/lib/App'
import { Emitter, SERVICE_EMITTER, VisionElixirRequestEvents } from './types'
import { VisionElixir } from '../app/lib/VisionElixir'

// @todo add a list of all core events and what they are/can be used for to the event docs
// @todo revisit core events and event naming

export default class EventsService implements Service {
  public async applicationInit(container: Container): Promise<void> {
    const emitter = new VisionElixirEmitter()

    container.singleton(SERVICE_EMITTER, emitter)
  }

  public async applicationBoot(container: Container): Promise<void> {
    const { app, emitter } = container.resolve<{ app: App; emitter: Emitter }>(
      SERVICE_APP,
      SERVICE_EMITTER,
    )

    await app.runServicesMethod('applicationRegisterEvents', [
      emitter,
      container,
    ])
  }

  public async init(container: Container): Promise<void> {
    let emitter: VisionElixirEmitter | null = new VisionElixirEmitter()

    emitter.on(VisionElixirRequestEvents.RESPONSE_DESTROY, () => {
      emitter?.getNames().forEach((name) => {
        emitter?.removeAllListeners(name)
      })

      emitter = null
    })

    container.singleton(SERVICE_EMITTER, emitter)
  }

  public async boot(container: Container): Promise<void> {
    const { app, emitter } = VisionElixir.service<{
      app: App
      emitter: Emitter
    }>(SERVICE_APP, SERVICE_EMITTER)
    const serviceObjects: Service[] = app.getServiceObjects()

    serviceObjects.forEach((service: Service) => {
      if (service.registerEvents) {
        service.registerEvents(emitter, container)
      }
    })
  }
}
