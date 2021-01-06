import * as chalk from 'chalk'
import { KeyValue } from '../../app/types'
import { SeverityColors, Severity } from '../types'

export class Console {
  public render(
    name: string,
    type: Severity,
    color: SeverityColors,
    timestamp: string,
    message: string,
    meta?: KeyValue,
  ): void {
    const severityName: string = Severity[type]
    const stamp =
      chalk.hex(SeverityColors.STAMP)(`[${timestamp}][${name}]`) +
      chalk.hex(SeverityColors.STAMP)(`[`) +
      chalk.hex(color)(`${severityName}`) +
      chalk.hex(SeverityColors.STAMP)(`] `)

    const print: string[] = [message]

    if (meta) {
      const metaPrint: string = JSON.stringify(
        meta,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (_key: string, value: any) => {
          if (value instanceof Function) {
            return `Function:${value.name}()`
          }

          return value
        },
        2,
      ).replace(/\\n/g, `\n`)

      if (metaPrint.split(`\n`).length > 1) {
        metaPrint.split(`\n`).map((r: string) => print.push(r))
      } else {
        print.push(metaPrint)
      }
    }

    print.forEach((text: string, index: number) => {
      let render = ''

      if (index === 0) {
        render = stamp + chalk.hex(SeverityColors.MESSAGE)(text)
      } else {
        const pad = ' '.repeat(`[${timestamp}]`.length)
        render = chalk.hex(SeverityColors.STAMP)(`${pad}${text}`)
      }

      // eslint-disable-next-line no-console
      console.log(render)
    })
  }
}
