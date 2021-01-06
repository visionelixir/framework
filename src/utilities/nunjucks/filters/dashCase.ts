import { kebabCase } from 'lodash'
import { Environment } from 'nunjucks'

export const dashCase = (env: Environment): void => {
  env.addFilter('dashCase', function (string: string): string {
    return kebabCase(string)
  })
}
