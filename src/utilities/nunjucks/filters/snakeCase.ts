import { snakeCase as lodashSnakeCase } from 'lodash'
import { Environment } from 'nunjucks'

export const snakeCase = (env: Environment): void => {
  env.addFilter('snakeCase', function (string: string): string {
    return lodashSnakeCase(string)
  })
}
