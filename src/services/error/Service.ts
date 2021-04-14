import { Service } from '../app/types'
import { ErrorMiddleware } from './middleware/ErrorMiddleware'
import { Middleware } from '../core/types'

export default class ErrorService implements Service {
  public async middleware(middleware: Middleware[]): Promise<void> {
    middleware.splice(1, 0, ErrorMiddleware.errorHandler())
  }
}
