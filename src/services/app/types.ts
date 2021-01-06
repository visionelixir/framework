import { Container } from '../container/types'

export interface KeyValue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface VisionElixirConfig {
  name: string
  host: string
  port: number
  debug: boolean

  baseDirectory: string

  static: {
    directory: string
    maxage?: number
    defer?: boolean
    hidden?: boolean
    index?: string
  }

  services: {
    file: string
    directory: string
    require: {
      project: string[]
      visionElixir: string[]
    }
  }
}

export interface Service {
  globalInit?: (container: Container) => void
  globalBoot?: (container: Container) => void
  init?: (container: Container) => void
  boot?: (container: Container) => void
}

export const SERVICE_APP = 'app'
