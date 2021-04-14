import { Options } from '@koa/cors'

declare module '../app/types' {
  interface VisionElixirConfig {
    cors?: Options
  }
}
