import { Service, SERVICE_APP, VisionElixirConfig } from '../app/types'
import { Container } from '../container/types'
import { VisionElixirView } from './lib/VisionElixirView'
import { App } from '../app/lib/App'
import * as Path from 'path'
import * as nunjucks from 'nunjucks'
import { SERVICE_VIEW } from './types'

export default class ViewService implements Service {
  public globalInit(container: Container): void {
    container.singleton(SERVICE_VIEW, new VisionElixirView())
  }

  public globalBoot(container: Container): void {
    const config = container.resolve<App>(SERVICE_APP).getConfig()

    if (config.view) {
      const viewFallback = this.getViewFallback(config)
      this.configureNunjucks(viewFallback)
    }
  }

  protected getViewFallback(config: VisionElixirConfig): string[] {
    if (config.view === undefined) {
      return []
    }

    const themePath = `${config.baseDirectory}/${config.view.themes.directory}`
    const themeDirectory = Path.normalize(themePath)
    const servicePath = `${config.baseDirectory}/${config.services.directory}`

    let viewFallback = config.view.themes.fallback.map((theme: string) => {
      return themeDirectory + '/' + theme
    })

    const veServiceViewFolders = config.services.require.visionElixir.map(
      (service: string) => {
        const directory = Path.normalize(
          `${__dirname}/../${service}/${config.view?.serviceViewDirectory}`,
        )
        return directory
      },
    )

    const projectServiceViewFolders = config.services.require.project.map(
      (service: string) => {
        const directory = Path.normalize(
          `${servicePath}/${service}/${config.view?.serviceViewDirectory}`,
        )
        return directory
      },
    )

    viewFallback = viewFallback
      .concat(projectServiceViewFolders)
      .concat(veServiceViewFolders)

    return viewFallback
  }

  protected configureNunjucks(viewFallback: string[]): void {
    nunjucks.configure(viewFallback, {
      autoescape: true,
    })
  }
}
