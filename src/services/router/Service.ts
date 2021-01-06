import { CoreRouter, Route, Router, SERVICE_ROUTER } from './types'
import { VisionElixirRouter } from './lib/VisionElixirRouter'
import { Service, SERVICE_APP } from '../app/types'
import { Middleware } from '../core/types'
import { Emitter, Event, VisionElixirGlobalEvents } from '../event/types'
import { Container } from '../container/types'
import { App } from '../app/lib/App'
import { RouterMiddleware } from './middleware/RouterMiddleware'

export default class RouterService implements Service {
  /**
   * Global Init
   * Initialises the service within the global scope
   *
   * @param container
   */
  public globalInit(container: Container): void {
    container.singleton(SERVICE_ROUTER, new VisionElixirRouter())
  }

  /**
   * Global Boot
   * Boots the service within the global scope
   *
   * @param container
   */
  public globalBoot(container: Container): void {
    const { app, router } = container.resolve<{ app: App; router: Router }>(
      SERVICE_APP,
      SERVICE_ROUTER,
    )

    const serviceObjects: Service[] = app.getServiceObjects()

    serviceObjects.forEach((service: Service) => {
      if (service.registerRoutes) {
        service.registerRoutes(router, container)
      }
    })

    this.attachRoutes(router)
  }

  /**
   * Global Register Events
   * Registers listeners on the global emitter
   *
   * @param emitter
   * @param container
   */
  public globalRegisterEvents(emitter: Emitter, container: Container): void {
    const router = container.resolve<Router>(SERVICE_ROUTER)

    emitter.on(
      VisionElixirGlobalEvents.INIT_MIDDLEWARE,
      (event: Event): void => {
        const { middleware } = event.getData()
        middleware.push(
          RouterMiddleware.attachRoutes(router),
          RouterMiddleware.allowedMethods(router),
        )
      },
    )
  }

  /**
   * Attach Routes
   * Registers routes into the koa router
   */
  public attachRoutes(router: Router): void {
    const core = router.getCore() as CoreRouter

    router.getRoutes().map((route: Route) => {
      // duplicate the array
      const args: (Middleware | string)[] = route.getMiddleware().slice(0)

      // stuff a no-next middleware at the end to patch a bug in koa router
      // that matches multiple routes

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      const done = async () => {}

      args.push(done)

      // add the path
      args.unshift(route.getPath())

      core[route.getMethod()](...args)
    })
  }
}
