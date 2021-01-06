import { VisionElixirError } from '../../error/errors/VisionElixirError'

const type = 'DatabaseError'

export class DatabaseError<T> extends VisionElixirError<T> {
  constructor(
    message = 'A database error occurred',
    payload: T | null = null,
    name: string = type,
  ) {
    super(message, payload, name)
    this.type = type
    this.name = name
  }
}
