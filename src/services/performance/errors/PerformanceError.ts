import { VisionElixirError } from '../../error/errors/VisionElixirError'
import { VisionElixirErrorOptions } from '../../error/types'

const type = 'PerformanceError'

export class PerformanceError<T> extends VisionElixirError<T> {
  constructor(
    message = 'A performance error occurred',
    options?: VisionElixirErrorOptions<T>,
  ) {
    super(message, options)
    this.type = type
  }
}
