import { Service, SERVICE_APP } from '../app/types'
import { Container } from '../container/types'
import { VisionElixirEmitter } from './lib/VisionElixirEmitter'
import { App } from '../app/lib/App'
import { Emitter, SERVICE_EMITTER } from './types'
import { VisionElixir } from '../app/lib/VisionElixir'

// @todo add a list of all core events and what they are/can be used for to the event docs
// @todo revisit core events and event naming

export default class EventsService implements Service {
  public globalInit(container: Container): void {
    const emitter = new VisionElixirEmitter()

    container.singleton(SERVICE_EMITTER, emitter)
  }

  public globalBoot(container: Container): void {
    const { app, emitter } = container.resolve<{ app: App; emitter: Emitter }>(
      SERVICE_APP,
      SERVICE_EMITTER,
    )
    const serviceObjects: Service[] = app.getServiceObjects()

    serviceObjects.forEach((service: Service) => {
      if (service.globalRegisterEvents) {
        service.globalRegisterEvents(emitter, container)
      }
    })
  }

  public init(container: Container): void {
    const emitter = new VisionElixirEmitter()

    container.singleton(SERVICE_EMITTER, emitter)
  }

  public boot(container: Container): void {
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
