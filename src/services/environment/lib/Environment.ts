import { CommandVars } from '../loaders/CommandVars'
import { FileVars } from '../loaders/FileVars'
import { SystemVars } from '../loaders/SystemVars'
import {
  EnvironmentCasts,
  VisionElixirEnvironment,
  EnvironmentVars,
} from '../types'

export class Environment {
  public static hasFetched = false
  public static vars: EnvironmentVars = {}
  public static loaders = [SystemVars, FileVars, CommandVars]

  public static get<T>(variableName: string): T
  public static get<T>(variableName: string, defaultValue?: T): T
  public static get<T>(
    variableName: string,
    defaultValue?: T,
    cast?: EnvironmentCasts.BOOLEAN,
  ): boolean
  public static get<T>(
    variableName: string,
    defaultValue?: T,
    cast?: EnvironmentCasts.STRING,
  ): string
  public static get<T>(
    variableName: string,
    defaultValue?: T,
    cast?: EnvironmentCasts.NUMBER,
  ): number
  public static get<T>(
    variableName: string,
    defaultValue?: T,
    cast?: EnvironmentCasts.JSON,
  ): T
  public static get<T>(
    variableName: string,
    defaultValue?: T,
    cast?: EnvironmentCasts,
  ): T | null {
    if (!this.hasFetched) {
      this.fetch()
    }

    let value = this.vars[variableName.toUpperCase()]

    if (typeof value === 'undefined') {
      if (defaultValue) {
        return defaultValue
      }

      return null
    }

    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1)
    }

    switch (cast) {
      case EnvironmentCasts.BOOLEAN:
        if (value === 'true' || value === '1') {
          value = true
        } else if (value === 'false' || value === '0') {
          value = false
        } else {
          value = Boolean(value)
        }
        break
      case EnvironmentCasts.NUMBER:
        value = Number(value)
        break
      case EnvironmentCasts.JSON:
        value = JSON.parse(value)
        break
      default:
        value = String(value)
    }

    return value
  }

  public static all(): EnvironmentVars {
    if (!this.hasFetched) {
      this.fetch()
    }

    return this.vars
  }

  public static set(name: string, value: string): Environment {
    if (!this.hasFetched) {
      this.fetch()
    }

    this.vars[name] = value

    return this
  }

  public static which(): VisionElixirEnvironment {
    const commandVars = new CommandVars().load()

    let environment: VisionElixirEnvironment =
      VisionElixirEnvironment.PRODUCTION

    if (process.env.NODE_ENV) {
      environment = process.env.NODE_ENV as VisionElixirEnvironment
    }

    if (commandVars.ENVIRONMENT) {
      environment = commandVars.ENVIRONMENT as VisionElixirEnvironment
    }

    if (Array.isArray(environment)) {
      environment = environment.pop()
    }

    return environment
  }

  public static fetch(): Environment {
    let vars = {}

    // the loaded hierarchy is the following:
    // command vars > file vars > system vars
    // therefore an env var set in command line
    // will override the same variable in a file
    // and a file var will override one set on
    // the system
    this.loaders.map((Loader) => {
      const loader = new Loader()

      const result = loader.load(Environment.which())

      const resultParsed: EnvironmentVars = {}

      for (const i in result) {
        resultParsed[i.toUpperCase()] = result[i]
      }

      if (result) {
        vars = {
          ...vars,
          ...result,
        }
      }
    })

    this.vars = vars

    this.hasFetched = true

    return this
  }
}
