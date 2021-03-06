import { VisionElixirError } from '../../error/errors/VisionElixirError'
import { QueryParams } from '../types'
import { VisionElixirErrorOptions } from '../../error/types'

const type = 'QueryError'

interface QueryPayload {
  query: string
  params: QueryParams | undefined
  stack: string | undefined
}

export class QueryError<T extends QueryPayload> extends VisionElixirError<T> {
  constructor(
    message = 'A query error occurred',
    options?: VisionElixirErrorOptions<T>,
  ) {
    super(message, options)
    this.type = type
  }
}
