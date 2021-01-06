import { VisionElixirError } from '../../error/errors/VisionElixirError'

const type = 'ContainerError'

export class ContainerError<T> extends VisionElixirError<T> {
  constructor(
    message = 'A container error occurred',
    payload: T | null = null,
    name: string = type,
  ) {
    super(message, payload, name)
    this.type = type
    this.name = name
  }
}
