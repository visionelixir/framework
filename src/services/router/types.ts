import * as KoaRouter from 'koa-router'
import { Middleware } from '../core/types'
import { Container } from '../container/types'

export interface CoreRouter extends KoaRouter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export enum RouterMethods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
  OPTIONS = 'options',
  ALL = 'all',
}

export interface Route {
  getMethod(): string
  getPath(): string
  getMiddleware(): Middleware[]
}

export interface Router {
  find(path: string, method: RouterMethods): Route | undefined
  all(path: string, middleware: Middleware[]): Router
  get(path: string, middleware: Middleware[]): Router
  post(path: string, middleware: Middleware[]): Router
  put(path: string, middleware: Middleware[]): Router
  patch(path: string, middleware: Middleware[]): Router
  delete(path: string, middleware: Middleware[]): Router
  options(path: string, middleware: Middleware[]): Router
  some(methods: RouterMethods[], path: string, middleware: Middleware[]): Router
  add(method: RouterMethods, path: string, middleware: Middleware[]): Router
  getRoutes(): Route[]
  getCore(): KoaRouter
}

declare module '../app/types' {
  interface Service {
    registerRoutes?: (router?: Router, container?: Container) => void
  }
}

export const SERVICE_ROUTER = 'router'
