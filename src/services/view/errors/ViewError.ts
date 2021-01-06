import { VisionElixirError } from '../../error/errors/VisionElixirError'

const type = 'View Error'

export class ViewError<T> extends VisionElixirError<T> {
  constructor(
    message = 'A view error occurred',
    payload: T | null = null,
    name: string = type,
  ) {
    super(message, payload, name)
    this.type = type
    this.name = name
  }
}
