const type = 'PayloadError'

export class PayloadError<T> extends Error {
  public type = type
  public name = 'PayloadError'
  public payload: T | null = null

  constructor(
    message = 'Something went wrong, try again later',
    payload: T | null = null,
    name: string = type,
  ) {
    super(message)

    Error.captureStackTrace(this, this.constructor)

    this.message = message
    this.name = name

    this.payload = payload
  }

  public getPayload(): T | null {
    return this.payload
  }

  public setPayload(payload: T): PayloadError<T | null> {
    this.payload = payload

    return this
  }

  public getName(): string {
    return this.name
  }

  public setName(name: string): PayloadError<T | null> {
    this.name = name

    return this
  }

  public setMessage(message: string): PayloadError<T | null> {
    this.message = message

    return this
  }

  public getType(): string {
    return this.type
  }
}
