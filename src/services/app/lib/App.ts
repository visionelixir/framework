import { KeyValue, Service, VisionElixirConfig } from '../types'
import { Container, Containers } from '../../container/types'
import { VisionElixirError } from '../../error/errors/VisionElixirError'
import * as http from 'http'
import { Server } from 'http'
import { VisionElixirLoader } from './VisionElixirLoader'
import { Logger, SERVICE_LOGGER } from '../../logging/types'
import {
  Emitter,
  SERVICE_EMITTER,
  VisionElixirGlobalEvents,
} from '../../event/types'
import { VisionElixirEvent } from '../../event/lib/VisionElixirEvent'
import { VisionElixirContainer } from '../../container/lib/VisionElixirContainer'
import { Performance, PerformanceMark } from '../../performance/types'
import { VisionElixirPerformance } from '../../performance/lib/VisionElixirPerformance'
import { Environment } from '../../environment/exports'
import { Core } from '../../core/lib/Core'
import { ZoneManager } from '../../zone/lib/VisionElixirZoneManager'
import { Zone } from '../../zone/types'
import { Middleware } from '../../core/types'

// @todo remove KeyValue for Set/Map Objects

export class App {
  public serviceObjects: Service[] = []
  protected core: Core
  protected config: VisionElixirConfig
  protected isServed = false
  protected server: Server
  protected logger: Logger
  protected emitter: Emitter
  protected container: Container
  protected performance: Performance

  public constructor(config?: VisionElixirConfig) {
    this.performance = new VisionElixirPerformance()

    this.performance.start('app:total-boot')

    if (config) {
      this.create(config)
    }
  }

  /**
   * Create
   * Orchestrates the creation of the app
   *
   * @param config
   */
  public create(config: VisionElixirConfig): App {
    const performance = this.getPerformance()

    performance.start('app:create.global-container')
    this.createGlobalContainer()
    performance.stop('app:create.global-container')

    const zone = this.createAppZone()

    zone.run(async () => {
      performance.start('app:create')
      this.config = config

      performance.start('app:create.load-environment')
      this.loadEnvironment()
      performance.stop('app:create.load-environment')

      performance.start('app:create.load-services')
      this.loadServices()
      performance.stop('app:create.load-services')

      performance.start('app:create.init-global-services')
      this.initGlobalServices()
      performance.stop('app:create.init-global-services')

      performance.start('app:create.set-logger')
      this.setLogger()
      performance.stop('app:create.set-logger')

      performance.start('app:create.boot-global-services')
      this.bootGlobalServices()
      performance.stop('app:create.boot-global-services')

      performance.start('app:create.create-core')
      this.createCore()
      performance.stop('app:create.create-core')

      performance.start('app:create.configure-middleware')
      this.configureMiddleware()
      performance.stop('app:create.configure-middleware')

      this.performance.stop('app:create')
    })

    return this
  }

  public getServiceObjects(): Service[] {
    return this.serviceObjects
  }

  public getCore(): Core {
    return this.core
  }

  public getStatus(): boolean {
    return this.isServed
  }

  public getConfig(): VisionElixirConfig {
    return this.config
  }

  public async up(): Promise<App> {
    return new Promise((resolve) => {
      this.getPerformance().start('app:serve')

      if (!this.config) {
        throw new VisionElixirError('Please run create before serving')
      }

      const { port } = this.getConfig()

      this.server = http
        .createServer(this.getCore().callback())
        .on('error', (error) => {
          this.servingError(error)
        })
        .listen(port, () => {
          this.served()
          resolve(this)
        })
    })
  }

  // @todo give services a chance to tear down too
  public async down(): Promise<App> {
    return new Promise((resolve, reject) => {
      this.server.close((error: Error) => {
        if (error) {
          reject(error)
        }

        this.setStatus(false)

        resolve(this)
      })
    })
  }

  public getContainer(): Container {
    return this.container
  }

  public getPerformance(): Performance {
    return this.performance
  }

  protected createAppZone(): Zone {
    ZoneManager.boot()

    return ZoneManager.getCurrentZone().fork({
      properties: { container: this.getContainer(), app: this },
    })
  }

  protected loadEnvironment(): App {
    Environment.which()

    return this
  }

  protected createGlobalContainer(): App {
    this.container = new VisionElixirContainer(Containers.GLOBAL)

    return this
  }

  protected loadServices(): App {
    this.serviceObjects = VisionElixirLoader.loadServiceObjects(
      this.getConfig(),
    )

    // register app into the global container
    this.getContainer().singleton('app', this)

    return this
  }

  protected initGlobalServices(): App {
    this.serviceObjects.forEach((service: Service) => {
      if (service.globalInit) {
        service.globalInit(this.container)
      }
    })

    return this
  }

  protected bootGlobalServices(): App {
    this.serviceObjects.forEach((service: Service) => {
      if (service.globalBoot) {
        service.globalBoot(this.container)
      }
    })

    return this
  }

  protected setLogger(): App {
    this.logger = this.container.resolve<Logger>(SERVICE_LOGGER)

    return this
  }

  protected createCore(): App {
    this.core = new Core({ container: this.getContainer(), app: this })

    return this
  }

  protected configureMiddleware(): App {
    const coreMiddlewareStack: Middleware[] = []

    this.emitter = this.container.resolve<Emitter>(SERVICE_EMITTER)

    this.emitter.emit(
      VisionElixirGlobalEvents.INIT_MIDDLEWARE,
      new VisionElixirEvent({ middleware: coreMiddlewareStack }),
    )

    coreMiddlewareStack.map((middleware: Middleware) => {
      this.getCore().use(middleware)
    })

    return this
  }

  protected setStatus(status: boolean): App {
    this.isServed = status

    return this
  }

  protected servingError(error: Error): void {
    const performance = this.getPerformance()

    this.logger.emergency('App', 'Error serving application', {
      error,
      stack: error.stack,
    })

    performance.stop('app:serve')
    performance.stop('app:total-boot')

    if (this.getConfig().output?.performance) {
      this.outputPerformance()
    }
  }

  protected outputPerformance(): App {
    const performance: KeyValue = {}

    this.performance.allArray().map((mark: PerformanceMark) => {
      performance[mark.getName()] = `${
        Math.round(mark.getDuration() * 100) / 100
      }`
    })

    this.logger.info('App', `Performance`, performance)

    return this
  }

  protected served(): App {
    const { name, host, port } = this.getConfig()
    const performance = this.getPerformance()

    this.setStatus(true)

    performance.stop('app:serve')
    performance.stop('app:total-boot')

    const url = `${host}:${port}`

    this.logger.notice('App', `App booted`, {
      name,
      url,
      port,
      environment: Environment.which(),
    })

    this.outputPerformance()

    return this
  }
}
