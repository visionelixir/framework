import * as asyncHooks from 'async_hooks'
import { KeyValue } from '../../app/types'
import { ZoneManager } from './VisionElixirZoneManager'
import { Zone } from '../types'

export class VisionElixirZone implements Zone {
  protected data: KeyValue

  constructor(data: KeyValue) {
    this.data = data
  }

  public fork(data: KeyValue): VisionElixirZone {
    const z = new VisionElixirZone({ ...this.data, ...data.properties })
    ZoneManager.set(asyncHooks.executionAsyncId(), z)

    return z
  }

  public run(cb: () => Promise<void>): any {
    return cb()
  }

  public get<T>(key: string): T {
    return this.data[key]
  }
}
