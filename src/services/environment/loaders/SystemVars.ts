import { EnvironmentLoader, EnvironmentVars } from '../types'

export class SystemVars implements EnvironmentLoader {
  public load(): EnvironmentVars {
    const vars = process.env
    return vars
  }
}
