import {
  Context as KoaContext,
  Middleware as KoaMiddleware,
  Next as KoaNext,
  Request as KoaRequest,
  Response as KoaResponse,
} from 'koa'
import { VisionElixir } from '../app/lib/VisionElixir'

export type Context = KoaContext & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Map<any, any>
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
