import { KeyValue } from '../app/types'

export enum VisionElixirEnvironment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

export enum EnvironmentCasts {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  JSON = 'json',
}

export interface EnvironmentLoader {
  load(
    environment: VisionElixirEnvironment,
    fromCache?: boolean,
  ): EnvironmentVars
}

export type EnvironmentVars = KeyValue

export const SERVICE_ENVIRONMENT = 'environment'
