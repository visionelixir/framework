import * as path from 'path'
import * as nunjucks from 'nunjucks'
import { View } from '../types'
import { ViewError } from '../errors/ViewError'
import { KeyValue } from '../../app/types'

export class VisionElixirView implements View {
  public static EXTENSION = 'njk'

  public render(template: string, payload?: KeyValue | undefined): string {
    template = this.resolveView(template)

    if (!template.endsWith(VisionElixirView.EXTENSION)) {
      template = `${template}.${VisionElixirView.EXTENSION}`
    }

    let render = ''

    try {
      render = nunjucks.render(template, payload)
    } catch (e) {
      new ViewError(e.message, e, 'renderError')
    }

    return render
  }

  protected resolveView(view: string): string {
    const normalised = path.normalize(view)

    return normalised
  }
}
