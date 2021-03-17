import { VisionElixirError } from '../../error/errors/VisionElixirError'
import { VisionElixirErrorOptions } from '../../error/types'

const type = 'View Error'

export class ViewError<T> extends VisionElixirError<T> {
  constructor(
    message = 'A view error occurred',
    options?: VisionElixirErrorOptions<T>,
  ) {
    super(message, options)
    this.type = type
  }
}
