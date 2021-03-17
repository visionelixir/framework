import { HttpStatus } from '../core/types'
import { KeyValue } from '../app/types'

export interface PayloadErrorOptions<T> {
  payload?: T | null
  name?: string
}

export interface VisionElixirErrorOptions<T> extends PayloadErrorOptions<T> {
  passThrough?: boolean
  passThroughMessage?: string
  passThroughPayload?: KeyValue
  status?: HttpStatus
}
