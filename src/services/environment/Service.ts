import { Service } from '../app/types'
import { Container } from '../container/types'
import { SERVICE_ENVIRONMENT } from './types'
import { Environment } from './lib/Environment'

export default class DatabaseService implements Service {
  public applicationInit(container: Container): void {
    container.singleton(SERVICE_ENVIRONMENT, Environment)
  }
}
