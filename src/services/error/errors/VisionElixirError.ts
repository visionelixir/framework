import { PayloadError } from './PayloadError'

const type = 'ElixirError'

export class VisionElixirError<T> extends PayloadError<T> {
  constructor(
    message = 'An error occurred',
    payload: T | null = null,
    name: string = type,
  ) {
    super(message, payload, name)
    this.type = type
    this.name = name
  }
}
