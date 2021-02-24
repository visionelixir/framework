import { ZoneManager } from '../../zone/lib/VisionElixirZoneManager'
import { Container } from '../../container/types'
import { Context } from '../../core/types'

/**
 * VisionElixir
 * Zone scoped class for ease of accessing VisionElixir
 * data and services.
 */
export class VisionElixir {
  public static get<T>(name: string): T {
    return ZoneManager.getCurrentZone().get(name)
  }

  public static id(): string {
    return VisionElixir.get<string>('id')
  }

  public static ctx(): Context {
    return VisionElixir.get<Context>('ctx')
  }

  public static service<T>(...serviceNames: string[]): T {
    return VisionElixir.container().resolve(...serviceNames)
  }

  public static container(): Container {
    return VisionElixir.get<Container>('container')
  }

  public static applicationContainer(): Container {
    return VisionElixir.get<Container>('applicationContainer')
  }
}
