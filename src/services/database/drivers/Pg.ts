import { Pool, types } from 'pg'
import * as _ from 'lodash'
import {
  DatabaseConnectionConfig,
  DatabaseConnection,
  QueryResult,
  QueryParams,
} from '../types'
import { DatabaseError } from '../errors/DatabaseError'
import { QueryError } from '../errors/QueryError'
import { VisionElixir } from '../../app/lib/VisionElixir'
import {
  Emitter,
  SERVICE_EMITTER,
  VisionElixirRequestEvents,
} from '../../event/types'
import { VisionElixirEvent } from '../../event/lib/VisionElixirEvent'
import { Performance, SERVICE_PERFORMANCE } from '../../performance/types'
import { StringUtility } from '../../../utilities/StringUtility'
import { NumberUtility } from '../../../utilities/NumberUtility'

export class Pg extends DatabaseConnection {
  protected pool: Pool
  protected config: DatabaseConnectionConfig
  protected name: string

  constructor(name: string, config: DatabaseConnectionConfig) {
    super(name, config)

    this.name = name

    if (config) {
      this.config = config
      this.setup()
      this.connect(config)
    }
  }

  protected setup(): void {
    const timestampTypes = [
      types.builtins.TIMESTAMPTZ,
      types.builtins.TIMESTAMP,
    ]

    timestampTypes.map((t) => {
      types.setTypeParser(t, this.parseDate)
    })
  }

  public connect = (config: DatabaseConnectionConfig): Pg => {
    this.config = config

    this.pool = new Pool(config)

    this.pool.on('error', (error: Error) => {
      throw new DatabaseError(
        `Unexpected error on idle client: ${error.message}`,
      )
    })

    return this
  }

  protected parseDate<T>(val: T): T {
    return val
  }

  public disconnect = async (): Promise<Pg> => {
    await this.pool.end()

    return this
  }

  protected getService<T>(service: string): T | undefined {
    try {
      if (VisionElixir.container().has(service)) {
        return VisionElixir.service<T>(service)
      } else {
        return undefined
      }
    } catch (e) {
      return undefined
    }
  }

  public async query<T>(
    query: string,
    params?: QueryParams,
    name?: string,
  ): Promise<T[]> {
    const { stack } = new Error()
    const client = await this.pool.connect()

    try {
      const performance = this.getService<Performance>(SERVICE_PERFORMANCE)
      const emitter = this.getService<Emitter>(SERVICE_EMITTER)
      const id = StringUtility.id('query:')
      let time: number | undefined

      if (performance) {
        performance.start(`query:${id}`)
      }

      const result = await client.query(query, params)

      if (performance) {
        performance.stop(`query:${id}`)
        time = NumberUtility.round(performance.get(`query:${id}`).getDuration())
        performance.clear(`query:${id}`)
      }

      const formatted = result.rows.map((row: QueryResult) => {
        const record: QueryResult = {}

        for (const i in row) {
          record[_.camelCase(i)] = row[i]
        }

        return record
      })

      if (emitter) {
        emitter.emit(
          VisionElixirRequestEvents.APP_DATA,
          new VisionElixirEvent({
            collection: 'queries',
            payload: { name, query, params, time },
          }),
        )
      }

      return formatted as T[]
    } catch (error) {
      throw new QueryError(error.message, {
        name: 'QueryFailure',
        payload: {
          name,
          query,
          params,
          stack,
          schema: error.schema,
          code: error.code,
          severity: error.severity,
          detail: error.detail,
          table: error.table,
          constraint: error.constraint,
        },
      })
    } finally {
      client.release()
    }
  }

  public async queryOne<T>(
    query: string,
    params?: QueryParams,
    name?: string,
  ): Promise<T | null> {
    const result = await this.query(query, params, name)

    return (result[0] as T) || null
  }

  public getName = (): string => {
    return this.name
  }

  public getConfig = (): DatabaseConnectionConfig => {
    return this.config
  }
}
