import * as asyncHooks from 'async_hooks'
import { VisionElixirZone } from './VisionElixirZone'

export class ZoneManager {
  public static zones = new Map()

  public static boot(): void {
    asyncHooks
      .createHook({
        init: (id: string | number, _type: string, parentId: number) => {
          ZoneManager.set(id, ZoneManager.get(parentId))
        },
        destroy: (id: string | number) => {
          ZoneManager.destroy(id)
        },
      })
      .enable()

    ZoneManager.zones.set(
      asyncHooks.executionAsyncId(),
      new VisionElixirZone({}),
    )
  }

  public static getCurrentZone(): VisionElixirZone {
    return ZoneManager.zones.get(asyncHooks.executionAsyncId())
  }

  public static set<T>(id: string | number, value: T): ZoneManager {
    ZoneManager.zones.set(id, value)

    return ZoneManager
  }

  public static get<T>(id: string | number): T {
    return ZoneManager.zones.get(id)
  }

  public static destroy(id: string | number): ZoneManager {
    ZoneManager.zones.delete(id)

    return ZoneManager
  }
}
