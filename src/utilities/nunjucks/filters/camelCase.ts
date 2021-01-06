import { camelCase as lodashCamelCase } from 'lodash'
import { Environment } from 'nunjucks'

export const camelCase = (env: Environment): void => {
  env.addFilter('camelCase', function (string: string): string {
    return lodashCamelCase(string)
  })
}
