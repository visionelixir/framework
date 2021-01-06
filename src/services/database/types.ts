import { KeyValue } from '../app/types'

export enum DatabaseConnectionTypes {
  PG = 'PG',
}

export type QueryResult = KeyValue

export type QueryParams = (string | number | null | string[] | number[])[]

export abstract class Database {
  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  protected constructor(_name: string, _config: DatabaseConnectionConfig) {}
  public abstract disconnect(): Promise<Database>
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

export interface DatabaseManager {
  add(name: string, instance: Database): DatabaseManager
  get(name?: string): Database
  all(): { [key: string]: Database }
}

declare module '../app/types' {
  interface VisionElixirConfig {
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
