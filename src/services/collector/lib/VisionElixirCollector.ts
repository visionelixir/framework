import { Collector } from '../types'
import { KeyValue } from '../../app/types'

export class VisionElixirCollector implements Collector {
  protected collections: KeyValue = {}

  public add<T>(collectionName: string, value: T): VisionElixirCollector {
    if (!this.collections[collectionName]) {
      this.collections[collectionName] = []
    }

    this.collections[collectionName].push(value)

    return this
  }

  public get<T>(collectionName: string): T[] {
    return this.collections[collectionName]
  }

  public all(): KeyValue {
    return this.collections
  }

  public clear(collectionName?: string): VisionElixirCollector {
    if (collectionName) {
      delete this.collections[collectionName]
    } else {
      this.collections = {}
    }

    return this
  }
}
