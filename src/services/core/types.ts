import {
  Context as KoaContext,
  Middleware as KoaMiddleware,
  Next as KoaNext,
  Request as KoaRequest,
  Response as KoaResponse,
} from 'koa'
import { KeyValue } from '../app/types'
import { VisionElixir } from '../app/lib/VisionElixir'

export type Context = KoaContext & {
  data: KeyValue
  visionElixir: VisionElixir
}
export type Middleware = KoaMiddleware
export type Next = KoaNext
export type Request = KoaRequest
export type Response = KoaResponse

// @todo http response code enum
export enum HttpStatus {
  NOT_FOUND = 404,
}
