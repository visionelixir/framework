import { VisionElixirError } from '../../error/errors/VisionElixirError'
import { VisionElixirErrorOptions } from '../../error/types'

const type = 'ContainerError'

export class ContainerError<T> extends VisionElixirError<T> {
  constructor(
    message = 'A container error occurred',
    options?: VisionElixirErrorOptions<T>,
  ) {
    super(message, options)
    this.type = type
  }
}
