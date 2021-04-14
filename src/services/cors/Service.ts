import { Service } from '../app/types'
import { Middleware } from '../core/types'
import cors = require('@koa/cors')

export default class CorsService implements Service {
  public async middleware(middleware: Middleware[]): Promise<void> {
    Reflect.defineProperty(cors, 'name', {
      value: 'CorsMiddleware.cors',
    })

    middleware.push(cors())
  }
}
