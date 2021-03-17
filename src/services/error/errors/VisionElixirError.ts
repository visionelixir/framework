import { PayloadError } from './PayloadError'
import { VisionElixirErrorOptions } from '../types'
import { HttpStatus } from '../../core/types'

const type = 'ElixirError'

export class VisionElixirError<T> extends PayloadError<T> {
  public options: VisionElixirErrorOptions<T>

  constructor(
    message = 'An error occurred',
    options?: VisionElixirErrorOptions<T>,
  ) {
    if (options) {
      super(message, options)

      this.options = {
        passThrough: false,
        passThroughMessage: undefined,
        ...options,
      }
    } else {
      super(message)
    }

    this.type = type
  }

  public getOptions(): VisionElixirErrorOptions<T> | null {
    return this.options
  }

  public isPassThrough(): boolean {
    return this.options.passThrough as boolean
  }

  public setPassThrough(value: boolean): VisionElixirError<T> {
    this.options.passThrough = value

    return this
  }

  public getStatus(): number | undefined {
    return this.options.status
  }

  public setStatus(value: HttpStatus): VisionElixirError<T> {
    this.options.status = value

    return this
  }

  public getPassThroughMessage(): string | undefined {
    return this.options.passThroughMessage
  }

  public setPassThroughMessage(value: string): VisionElixirError<T> {
    this.options.passThroughMessage = value

    return this
  }
}
