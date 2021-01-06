import {
  Context as KoaContext,
  Middleware as KoaMiddleware,
  Next as KoaNext,
  Request as KoaRequest,
  Response as KoaResponse,
} from 'koa'

export type Context = KoaContext
export type Middleware = KoaMiddleware
export type Next = KoaNext
export type Request = KoaRequest
export type Response = KoaResponse

// @todo http response code enum
export enum HttpStatus {
  NOT_FOUND = 404,
}
