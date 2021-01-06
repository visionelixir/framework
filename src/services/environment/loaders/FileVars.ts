import * as yargsParser from 'yargs-parser'
import * as fs from 'fs'
import * as path from 'path'
import {
  EnvironmentLoader,
  EnvironmentVars,
  VisionElixirEnvironment,
} from '../types'

export class FileVars implements EnvironmentLoader {
  protected vars: EnvironmentVars

  public load(
    environment: VisionElixirEnvironment,
    fromCache = true,
  ): EnvironmentVars {
    if (this.vars && fromCache) {
      return this.vars
    }

    let toLoad: string
    const vars: EnvironmentVars = {}

    if (process.env.BASE_DIRECTORY) {
      toLoad = process.env.BASE_DIRECTORY
    } else if (yargsParser(process.argv).baseDirectory) {
      toLoad = yargsParser(process.argv).baseDirectory
    } else {
      const executedScript = process.argv[1]
      const pathParts = executedScript.split('/')
      pathParts.pop()
      toLoad = pathParts.join('/')
    }

    // try load an environment scoped environment file
    let loaded: string | null = this.loadFile(
      path.resolve(toLoad, `.${environment}.environment`),
    )

    // if no environment scoped file was found then try load the generic one
    if (loaded === null) {
      loaded = this.loadFile(path.resolve(toLoad, `.environment`))
    }

    if (!loaded) {
      return vars
    }

    loaded.split('\n').map((row) => {
      if (row) {
        const [name, value] = row.split('=')

        if (name && value) {
          vars[name.trim()] = value.trim()
        }
      }
    })

    this.vars = vars

    return vars
  }

  public loadFile(file: string): string | null {
    try {
      return fs.readFileSync(file).toString()
    } catch (e) {
      // it's ok if we dont find one
      return null
    }
  }
}
