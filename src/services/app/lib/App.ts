import {
  AppType,
  KeyValue,
  Service,
  SERVICE_APP,
  VisionElixirConfig,
  VisionElixirJobConfig,
} from '../types'
import { Container, Containers } from '../../container/types'
import { VisionElixirError } from '../../error/errors/VisionElixirError'
import * as http from 'http'
import { Server } from 'http'
import { VisionElixirLoader } from './VisionElixirLoader'
import { Logger, SERVICE_LOGGER } from '../../logging/types'
import {
  Emitter,
  SERVICE_EMITTER,
  VisionElixirApplicationEvents,
} from '../../event/types'
import { VisionElixirEvent } from '../../event/lib/VisionElixirEvent'
import { VisionElixirContainer } from '../../container/lib/VisionElixirContainer'
import { Performance, PerformanceMark } from '../../performance/types'
import { VisionElixirPerformance } from '../../performance/lib/VisionElixirPerformance'
import { Environment } from '../../environment/exports'
import { AppCore } from '../../core/lib/AppCore'
import { ZoneManager } from '../../zone/lib/VisionElixirZoneManager'
import { Zone } from '../../zone/types'
import { Middleware } from '../../core/types'
import { JobCore } from '../../core/lib/JobCore'

/**
 * Class App
 *
 * Main application class for creating and serving an application
 */

export class App {
  protected serviceObjects: Service[] = []
  protected core: AppCore | JobCore
  protected config: VisionElixirConfig | VisionElixirJobConfig
  protected isServed = false
  protected server: Server
  protected logger: Logger
  protected emitter: Emitter
  protected container: Container
  protected performance: Performance

  /**
   * Constructor
   *
   * Instantiate an application. If a config is passed then create the application
   */
  public constructor(config?: VisionElixirConfig | VisionElixirJobConfig) {
    this.performance = new VisionElixirPerformance()

    this.performance.start('app:total-boot')

    if (config) {
      this.create(config)
    }
  }

  /**
   * Create
   *
   * Orchestrates the creation of the app
   */
  public create(config: VisionElixirConfig | VisionElixirJobConfig): App {
    const performance = this.getPerformance()

    performance.start('app:create.application-container')
    this.createApplicationContainer()
    performance.stop('app:create.application-container')

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

      performance.start('app:create.init-application-services')
      this.initApplicationServices()
      performance.stop('app:create.init-application-services')

      performance.start('app:create.set-logger')
      this.setLogger()
      performance.stop('app:create.set-logger')

      performance.start('app:create.boot-application-services')
      this.bootApplicationServices()
      performance.stop('app:create.boot-application-services')

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

  /**
   * Get Service Objects
   *
   * Getter for service object array
   */
  public getServiceObjects(): Service[] {
    return this.serviceObjects
  }

  /**
   * Get Core
   *
   * Getter for the core
   */
  public getCore<T extends AppCore | JobCore>(): T {
    return (this.core as unknown) as T
  }

  /**
   * Get Status
   *
   * Returns if the application is served or not
   */
  public getStatus(): boolean {
    return this.isServed
  }

  /**
   * Get Config
   *
   * Returns the application config
   */
  public getConfig<T extends VisionElixirConfig | VisionElixirJobConfig>(): T {
    return (this.config as unknown) as T
  }

  /**
   * Get Container
   *
   * Returns the application container
   */
  public getContainer(): Container {
    return this.container
  }

  /**
   * Get Performance
   *
   * Returns the application performance
   */
  public getPerformance(): Performance {
    return this.performance
  }

  /**
   * Run
   *
   * Runs a job application
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async run(data?: KeyValue): Promise<any> {
    return this.getCore<JobCore>().run(data)
  }

  /**
   * Up
   *
   * Serves the application
   */
  public async up(): Promise<App> {
    return new Promise((resolve) => {
      this.getPerformance().start('app:serve')

      if (!this.config) {
        throw new VisionElixirError('Please run create before serving')
      }

      const { port } = this.getConfig<VisionElixirConfig>()

      this.server = http
        .createServer(this.getCore<AppCore>().callback())
        .on('error', (error) => {
          this.servingError(error)
        })
        .listen(port, () => {
          this.served()
          resolve(this)
        })
    })
  }

  /**
   * Down
   *
   * Tears down the application. Stopping the server and tearing down services.
   */
  public async down(): Promise<App> {
    for (const i in this.getServiceObjects()) {
      const service = this.getServiceObjects()[i]

      if (service.applicationDown) {
        await service.applicationDown(this.getContainer())
      }
    }

    if (this.getConfig().type === AppType.APP) {
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

    return this
  }

  /**
   * Create App Zone
   *
   * Creates an async zone for the application adding the container and app
   * into the zone.
   */
  protected createAppZone(): Zone {
    ZoneManager.boot()

    return ZoneManager.getCurrentZone().fork({
      properties: { container: this.getContainer(), app: this },
    })
  }

  /**
   * Load Environment
   *
   * Calls 'which' but just loads the environment
   */
  protected loadEnvironment(): App {
    Environment.which()

    return this
  }

  /**
   * Create Application Container
   *
   * Creates the container for registering application level services
   */
  protected createApplicationContainer(): App {
    this.container = new VisionElixirContainer(Containers.APPLICATION)

    return this
  }

  /**
   * Load Services
   *
   * Call the loader to load all the services
   */
  protected loadServices(): App {
    this.serviceObjects = VisionElixirLoader.loadServiceObjects(
      this.getConfig(),
    )

    // register app into the application container
    this.getContainer().singleton(SERVICE_APP, this)

    return this
  }

  /**
   * Init Application Level Services
   *
   * Call the application init method on each registered service
   */
  protected initApplicationServices(): App {
    this.serviceObjects.forEach((service: Service) => {
      if (service.applicationInit) {
        service.applicationInit(this.container)
      }
    })

    return this
  }

  /**
   * Boot Application Services
   *
   * Call the application boot method on each registered service
   */
  protected bootApplicationServices(): App {
    this.serviceObjects.forEach((service: Service) => {
      if (service.applicationBoot) {
        service.applicationBoot(this.container)
      }
    })

    return this
  }

  /**
   * Set Logger
   *
   * Grab the logger from the container and set it on the instance
   */
  protected setLogger(): App {
    this.logger = this.container.resolve<Logger>(SERVICE_LOGGER)

    return this
  }

  /**
   * Create Core
   *
   * Instantiate the core instance
   */
  protected createCore(): App {
    if (this.config.type === AppType.JOB) {
      this.core = new JobCore({ container: this.getContainer(), app: this })
    } else {
      this.core = new AppCore({ container: this.getContainer(), app: this })
    }

    return this
  }

  /**
   * Configure Middleware
   *
   * Creates the middleware stack and allows services to add into it,
   * then registers the middleware into the core to be used
   */
  protected configureMiddleware(): App {
    const coreMiddlewareStack: Middleware[] = []

    this.emitter = this.container.resolve<Emitter>(SERVICE_EMITTER)

    this.emitter.emit(
      VisionElixirApplicationEvents.INIT_MIDDLEWARE,
      new VisionElixirEvent({ middleware: coreMiddlewareStack }),
    )

    coreMiddlewareStack.map((middleware: Middleware) => {
      this.getCore().use(middleware)
    })

    return this
  }

  /**
   * Set Status
   *
   * Updates the served status
   */
  protected setStatus(status: boolean): App {
    this.isServed = status

    return this
  }

  /**
   * Serving Error
   *
   * Called when there's an error serving the application
   */
  protected servingError(error: Error): void {
    const performance = this.getPerformance()

    this.logger.emergency('App', 'Error serving application', {
      error,
      stack: error.stack,
    })

    performance.stop('app:serve')
    performance.stop('app:total-boot')

    if (
      this.getConfig<VisionElixirConfig | VisionElixirJobConfig>().output
        ?.performance
    ) {
      this.outputPerformance()
    }
  }

  /**
   * Output Performance
   *
   * Outputs the boot/serve performance. Useful for seeing if any services
   * are slowing down the booting process.
   */
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

  /**
   * Served
   *
   * Called when the application is successfully served.
   * @protected
   */
  protected served(): App {
    const { name, host, port } = this.getConfig<VisionElixirConfig>()
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
