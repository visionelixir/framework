import { VisionElixirError } from '../../error/errors/VisionElixirError'

const type = 'ContainerManagerError'

export class ContainerManagerError<T> extends VisionElixirError<T> {
  constructor(
    message = 'A container manager error occurred',
    payload: T | null = null,
    name: string = type,
  ) {
    super(message, payload, name)
    this.type = type
    this.name = name
  }
}
