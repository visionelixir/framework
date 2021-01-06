import { KeyValue } from '../app/types'

export interface View {
  render(template: string, payload?: KeyValue | undefined): string
}

export interface ViewConfig {
  serviceViewDirectory: string
  themes: {
    directory: string
    fallback: string[]
  }
}

declare module '../app/types' {
  interface VisionElixirConfig {
    view?: ViewConfig
  }
}

export const SERVICE_VIEW = 'view'
