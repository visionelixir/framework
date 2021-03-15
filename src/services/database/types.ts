import { KeyValue } from '../app/types'

export enum DatabaseConnectionTypes {
  PG = 'PG',
}

export type QueryResult = KeyValue

export type QueryParams = (string | number | null | string[] | number[])[]

export abstract class DatabaseConnection {
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  protected constructor(_name: string, _config: DatabaseConnectionConfig) {}
  public abstract connect(
    config: DatabaseConnectionConfig,
  ): DatabaseConnection | Promise<DatabaseConnection>
  public abstract disconnect(): Promise<DatabaseConnection>
  public abstract query<T>(
    query: string,
    params?: QueryParams,
    name?: string,
  ): Promise<T[]>
  public abstract queryOne<T>(
    query: string,
    params?: QueryParams,
    name?: string,
  ): Promise<T | null>
}

export interface Database {
  add(name: string, instance: DatabaseConnection): Database
  get(name?: string): DatabaseConnection
  all(): { [key: string]: DatabaseConnection }
}

declare module '../app/types' {
  interface VisionElixirConfig {
    database?: DatabaseConfig
  }
}

declare module '../app/types' {
  interface VisionElixirJobConfig {
    database?: DatabaseConfig
  }
}

export interface DatabaseConfig {
  connections: {
    [key: string]: DatabaseConnectionConfig
  }
}

export interface DatabaseConnectionConfig {
  type: DatabaseConnectionTypes
  host: string
  database: string
  user: string
  password: string
  port: number
}

export const DEFAULT_CONNECTION = 'default'

export const SERVICE_DATABASE = 'database'
