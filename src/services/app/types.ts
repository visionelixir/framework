import { Container } from '../container/types'
import { Middleware } from '../core/types'

export interface KeyValue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface VisionElixirConfig {
  type: AppType.APP

  name: string
  host: string
  port: number
  debug: boolean

  baseDirectory: string

  output?: {
    bootPerformance?: boolean
  }

  static: {
    directory: string
    maxage?: number
    defer?: boolean
    hidden?: boolean
    index?: string
  }

  services: ServicesConfig
}

export interface VisionElixirJobConfig {
  type: AppType.JOB

  name: string
  debug: boolean

  baseDirectory: string

  output?: {
    bootPerformance?: boolean
  }

  services: ServicesConfig
}

export interface ServicesConfig {
  file: string
  directory: string
  require: {
    project: string[]
    visionElixir: string[]
  }
}

export interface Service {
  applicationInit?: (container: Container) => Promise<void>
  applicationBoot?: (container: Container) => Promise<void>
  applicationDown?: (container: Container) => Promise<void>
  init?: (container: Container) => Promise<void>
  boot?: (container: Container) => Promise<void>
  middleware?: (middleware: Middleware[], container: Container) => Promise<void>
  // @todo implement down
  down?: (container: Container) => Promise<void>
}

export const SERVICE_APP = 'app'

export enum AppType {
  APP = 'app',
  JOB = 'job',
}
