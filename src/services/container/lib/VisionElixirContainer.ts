import { KeyValue } from '../../app/types'
import { Class, ContainerService, ContainerType, Container } from '../types'
import { ContainerError } from '../errors/ContainerError'

export class VisionElixirContainer implements Container {
  protected name: string
  protected services: { [key: string]: ContainerService } = {}
  protected parent: Container | undefined

  constructor(name: string, parent?: Container) {
    this.name = name
    this.parent = parent
  }

  public getName(): string {
    return this.name
  }

  public transient(
    name: string,
    object: Class,
    force = false,
  ): VisionElixirContainer {
    this.setService(name, ContainerType.TRANSIENT, object, force)

    return this
  }

  public singleton(
    name: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
    object: any,
    force = false,
  ): VisionElixirContainer {
    this.setService(name, ContainerType.SINGLETON, object, force)

    return this
  }

  public setService(
    name: string,
    type: ContainerType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
    object: any,
    force = false,
  ): VisionElixirContainer {
    if (this.services[name] && !force) {
      throw new ContainerError(`Service with name ${name} already registered`, {
        name,
      })
    }

    this.services[name] = {
      name,
      object,
      type,
    }

    return this
  }

  public resolve<T>(...args: string[]): T {
    const requested: KeyValue = {}

    args.forEach((serviceName) => {
      if (!serviceName) {
        return
      }

      const resolved = this.getService(serviceName)

      if (resolved.type === ContainerType.SINGLETON) {
        requested[serviceName] = resolved.object
      } else {
        requested[serviceName] = new resolved.object()
      }
    })

    if (args.length === 1) {
      return requested[args[0]]
    }

    return requested as T
  }

  public getService(name: string): ContainerService {
    if (!this.services[name]) {
      if (this.parent) {
        return this.parent.getService(name) as ContainerService
      } else {
        throw new ContainerError(`Service with name ${name} not found`, {
          name,
        })
      }
    }

    return this.services[name]
  }

  public has(name: string): boolean {
    return !!this.services[name]
  }
}
