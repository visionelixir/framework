import * as yargsParser from 'yargs-parser'
import {
  EnvironmentLoader,
  EnvironmentVars,
  VisionElixirEnvironment,
} from '../types'

type Arguments = Partial<yargsParser.Arguments>

export class CommandVars implements EnvironmentLoader {
  protected vars: EnvironmentVars

  public load(
    _environment?: VisionElixirEnvironment,
    fromCache = true,
  ): EnvironmentVars {
    if (this.vars && fromCache) {
      return this.vars
    }

    const commandVariables: Arguments = yargsParser(process.argv)

    // remove the path script
    delete commandVariables._

    const vars: EnvironmentVars = {}

    for (const i in commandVariables) {
      vars[i.toUpperCase()] = commandVariables[i]
    }

    this.vars = vars

    return vars
  }
}
