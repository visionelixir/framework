import { VisionElixirError } from '../../error/errors/VisionElixirError'
import { VisionElixirErrorOptions } from '../../error/types'

const type = 'DatabaseError'

export class DatabaseError<T> extends VisionElixirError<T> {
  constructor(
    message = 'A database error occurred',
    options?: VisionElixirErrorOptions<T>,
  ) {
    super(message, options)
    this.type = type
  }
}
