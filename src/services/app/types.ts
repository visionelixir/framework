import { Container } from '../container/types'

// @todo remove for Map instances instead
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
    performance?: boolean
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
    performance?: boolean
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
  // @todo implement
  down?: (container: Container) => Promise<void>
}

export const SERVICE_APP = 'app'

export enum AppType {
  APP = 'app',
  JOB = 'job',
}
