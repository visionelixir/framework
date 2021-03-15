import { Service } from '../app/types'
import { Container } from '../container/types'
import { SERVICE_ENVIRONMENT } from './types'
import { Environment } from './lib/Environment'

// @todo add apptype into environment
export default class DatabaseService implements Service {
  public async applicationInit(container: Container): Promise<void> {
    container.singleton(SERVICE_ENVIRONMENT, Environment)
  }
}
