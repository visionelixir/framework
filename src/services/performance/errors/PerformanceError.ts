import { VisionElixirError } from '../../error/errors/VisionElixirError'

const type = 'PerformanceError'

export class PerformanceError<T> extends VisionElixirError<T> {
  constructor(
    message = 'A performance error occurred',
    payload: T | null = null,
    name: string = type,
  ) {
    super(message, payload, name)
    this.type = type
    this.name = name
  }
}
