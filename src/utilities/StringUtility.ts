import * as crypto from 'crypto'

export class StringUtility {
  public static id(prefix = ''): string {
    return prefix + crypto.randomBytes(20).toString('hex')
  }
}
