import { camelCase as lodashCamelCase, upperFirst } from 'lodash'
import { Environment } from 'nunjucks'

export const titleCase = (env: Environment): void => {
  env.addFilter('titleCase', function (string: string) {
    return upperFirst(lodashCamelCase(string))
  })
}
