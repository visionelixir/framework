import { VisionElixirError } from '../../error/errors/VisionElixirError'
import { QueryParams } from '../types'

const type = 'QueryError'

interface QueryPayload {
  query: string
  params: QueryParams | undefined
  stack: string | undefined
}

export class QueryError<T extends QueryPayload> extends VisionElixirError<T> {
  constructor(
    message = 'A query error occurred',
    payload: T | null = null,
    name: string = type,
  ) {
    super(message, payload, name)
    this.type = type
    this.name = name
  }
}
