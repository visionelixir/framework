import * as filters from './filters'

describe('utils:nunjucks:filters', () => {

  it('should export', () => {
    expect(filters).toHaveProperty('camelCase')
    expect(filters).toHaveProperty('dashCase')
    expect(filters).toHaveProperty('snakeCase')
    expect(filters).toHaveProperty('titleCase')
  })
})
