import { VisionElixirError } from '../../error/errors/VisionElixirError'
import { VisionElixirErrorOptions } from '../../error/types'

const type = 'ContainerManagerError'

export class ContainerManagerError<T> extends VisionElixirError<T> {
  constructor(
    message = 'A container manager error occurred',
    options?: VisionElixirErrorOptions<T>,
  ) {
    super(message, options)
    this.type = type
  }
}
