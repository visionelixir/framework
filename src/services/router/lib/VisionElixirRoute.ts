import { Route, RouterMethods } from '../types'
import { Middleware } from '../../core/types'

export class VisionElixirRoute implements Route {
  protected readonly method: string
  protected readonly path: string
  protected readonly middleware: Middleware[]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(method: RouterMethods, path: string, middleware: Middleware[]) {
    this.method = method
    this.path = path
    this.middleware = middleware
  }

  public getMethod = (): string => {
    return this.method
  }

  public getPath = (): string => {
    return this.path
  }

  public getMiddleware = (): Middleware[] => {
    return this.middleware
  }
}
