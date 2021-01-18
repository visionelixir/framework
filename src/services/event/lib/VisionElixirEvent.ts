import { Event } from '../types'

export class VisionElixirEvent implements Event {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected data: any

  protected name = 'event'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  constructor(data?: any, name?: string) {
    if (data) {
      this.setData(data)
    }

    if (name) {
      this.setName(name)
    }
  }

  public setName(name: string): VisionElixirEvent {
    this.name = name

    return this
  }

  public setData<T>(data: T): VisionElixirEvent {
    this.data = data

    return this
  }

  public getName(): string {
    return this.name
  }

  public getData<T>(): T {
    return this.data
  }
}
