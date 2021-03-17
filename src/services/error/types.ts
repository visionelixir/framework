import { HttpStatus } from '../core/types'

export interface PayloadErrorOptions<T> {
  payload?: T | null
  name?: string
}

export interface VisionElixirErrorOptions<T> extends PayloadErrorOptions<T> {
  passThrough?: boolean
  passThroughMessage?: string
  status?: HttpStatus
}
