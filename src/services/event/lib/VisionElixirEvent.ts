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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  public setData(data: any): VisionElixirEvent {
    this.data = data

    return this
  }

  public getName(): string {
    return this.name
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getData(): any {
    return this.data
  }
}
