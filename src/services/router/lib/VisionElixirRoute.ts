import { Route, RouterMethod } from '../types'
import { Middleware } from '../../core/types'

export class VisionElixirRoute implements Route {
  protected readonly method: RouterMethod
  protected readonly path: string
  protected readonly middleware: Middleware[]

  constructor(method: RouterMethod, path: string, middleware: Middleware[]) {
    this.method = method
    this.path = path
    this.middleware = middleware
  }

  public getMethod = (): RouterMethod => {
    return this.method
  }

  public getPath = (): string => {
    return this.path
  }

  public getMiddleware = (): Middleware[] => {
    return this.middleware
  }
}
