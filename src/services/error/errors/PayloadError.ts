import { PayloadErrorOptions } from '../types'

const type = 'PayloadError'

export class PayloadError<T> extends Error {
  public type = type
  public options: PayloadErrorOptions<T>

  constructor(
    message = 'Something went wrong, try again later',
    options?: PayloadErrorOptions<T>,
  ) {
    super(message)

    this.options = {
      name: type,
      payload: null,
      ...options,
    }

    Error.captureStackTrace(this, this.constructor)

    this.message = message
  }

  public getPayload(): T | null {
    return this.options.payload || null
  }

  public getOptions(): PayloadErrorOptions<T> | null {
    return this.options
  }

  public setPayload(payload: T | null): PayloadError<T | null> {
    this.options.payload = payload

    return this
  }

  public getName(): string {
    return this.options.name as string
  }

  public setName(name: string): PayloadError<T | null> {
    this.options.name = name

    return this
  }

  public setMessage(message: string): PayloadError<T | null> {
    this.message = message

    return this
  }

  public getType(): string {
    return this.type
  }

  public getMessage(): string {
    return this.message
  }

  public getStack(): string {
    return this.stack || ''
  }
}
