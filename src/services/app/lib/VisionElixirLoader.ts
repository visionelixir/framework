import { Service, VisionElixirConfig } from '../types'
import * as Path from 'path'
import { ZoneManager } from '../../zone/lib/VisionElixirZoneManager'
import { Performance } from '../../performance/types'
import { App } from './App'

export class VisionElixirLoader {
  public static loadServiceObjects(config: VisionElixirConfig): Service[] {
    const baseDirectory = config.baseDirectory
    const { directory, require, file } = config.services
    const servicePath = `${baseDirectory}/${directory}`
    const serviceObjects: Service[] = []
    const servicePaths: { name: string; path: string }[] = []
    const performance: Performance = ZoneManager.getCurrentZone()
      .get<App>('app')
      .getPerformance()

    require.ve.forEach((service: string) => {
      servicePaths.push({
        name: service,
        path: `${__dirname}/../../${service}/${file}`,
      })
    })

    require.project.forEach((service: string) => {
      servicePaths.push({
        name: service,
        path: `${servicePath}/${service}/${file}`,
      })
    })

    servicePaths.forEach((service: { name: string; path: string }) => {
      const path = Path.normalize(service.path)
      performance.start(`service:load.${service.name}`)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Service: any | undefined = VisionElixirLoader.requireService(path)
      performance.stop(`service:load.${service.name}`)

      if (Service) {
        serviceObjects.push(new Service())
      }
    })

    return serviceObjects
  }

  protected static requireService(file: string): Service | undefined {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require(file).default
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      // if no file exists then it's ok so skip it
      if (e.code === 'MODULE_NOT_FOUND') {
        return undefined
      }

      // if an error is received in the actual file then
      // throw the error
      throw e
    }
  }
}
