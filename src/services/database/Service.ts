import { Service, SERVICE_APP } from '../app/types'
import {
  DatabaseConfig,
  DatabaseConnectionTypes,
  Database,
  SERVICE_DATABASE,
} from './types'
import { DatabaseError } from './errors/DatabaseError'
import { Pg } from './drivers/Pg'
import { Container } from '../container/types'
import { VisionElixirDatabase } from './lib/VisionElixirDatabase'
import { App } from '../app/lib/App'

export default class DatabaseService implements Service {
  public async applicationInit(container: Container): Promise<void> {
    const database = new VisionElixirDatabase()

    container.singleton(SERVICE_DATABASE, database)
  }

  public async applicationBoot(container: Container): Promise<void> {
    const { app, database } = container.resolve<{
      app: App
      database: Database
    }>(SERVICE_APP, SERVICE_DATABASE)

    const { database: databaseConfig } = app.getConfig()

    if (databaseConfig) {
      DatabaseService.setupConnections(database, databaseConfig)
    } else {
    }
  }

  public async applicationDown(container: Container): Promise<void> {
    const database = container.resolve<Database>(SERVICE_DATABASE)

    const databases = database.all()

    for (const i in databases) {
      const database = databases[i]

      await database.disconnect()
    }
  }

  public static setupConnections = (
    databaseManager: Database,
    config: DatabaseConfig,
  ): void => {
    for (const i in config.connections) {
      const connection = config.connections[i]

      switch (connection.type) {
        case DatabaseConnectionTypes.PG:
          databaseManager.add(i, new Pg(i, connection))
          break
        default:
          throw new DatabaseError(`
        Cannot handle database connection of type ${connection.type}
        `)
      }
    }
  }
}
