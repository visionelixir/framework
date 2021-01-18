import { Route, RouterMethod, Router } from '../types'
import * as KoaRouter from 'koa-router'
import { VisionElixirRoute } from './VisionElixirRoute'
import { Middleware } from '../../core/types'

export class VisionElixirRouter implements Router {
  protected routes: Array<Route>
  protected koaRouter: KoaRouter

  constructor() {
    this.routes = []
    this.koaRouter = new KoaRouter()
  }

  public find = (path: string, method: string): Route | undefined => {
    if (!path.startsWith('/')) {
      path = `/${path}`
    }

    return this.getRoutes().find((route: Route) => {
      return route.getMethod() === method && route.getPath() === path
    })
  }

  public all = (path: string, middleware: Middleware[]): VisionElixirRouter => {
    this.add(RouterMethod.ALL, path, middleware)

    return this
  }

  public get = (path: string, middleware: Middleware[]): VisionElixirRouter => {
    this.add(RouterMethod.GET, path, middleware)

    return this
  }

  public post = (
    path: string,
    middleware: Middleware[],
  ): VisionElixirRouter => {
    this.add(RouterMethod.POST, path, middleware)

    return this
  }

  public put = (path: string, middleware: Middleware[]): VisionElixirRouter => {
    this.add(RouterMethod.PUT, path, middleware)

    return this
  }

  public patch = (
    path: string,
    middleware: Middleware[],
  ): VisionElixirRouter => {
    this.add(RouterMethod.PATCH, path, middleware)

    return this
  }

  public delete = (
    path: string,
    middleware: Middleware[],
  ): VisionElixirRouter => {
    this.add(RouterMethod.DELETE, path, middleware)

    return this
  }

  public options = (
    path: string,
    middleware: Middleware[],
  ): VisionElixirRouter => {
    this.add(RouterMethod.OPTIONS, path, middleware)

    return this
  }

  public some = (
    methods: RouterMethod[],
    path: string,
    middleware: Middleware[],
  ): VisionElixirRouter => {
    methods.map((method) => this.add(method, path, middleware))

    return this
  }

  public add = (
    method: RouterMethod,
    path: string,
    middleware: Middleware[],
  ): VisionElixirRouter => {
    if (!path.startsWith('/')) {
      path = `/${path}`
    }

    this.routes.push(new VisionElixirRoute(method, path, middleware))

    return this
  }

  public getRoutes = (): Route[] => {
    return this.routes
  }

  public getCore = (): KoaRouter => {
    return this.koaRouter
  }
}
