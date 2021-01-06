import { Router } from '../types'
import { Middleware } from '../../core/types'

export class RouterMiddleware {
  public static attachRoutes(router: Router): Middleware {
    const loadRoutes = router.getCore().routes()

    // add a name to the function to make debugging easier
    Reflect.defineProperty(loadRoutes, 'name', {
      value: 'RouterMiddleware.attachRoutes',
    })

    return loadRoutes
  }

  public static allowedMethods(router: Router): Middleware {
    const allowedMethods = router.getCore().allowedMethods()

    // add a name to the function to make debugging easier
    Reflect.defineProperty(allowedMethods, 'name', {
      value: 'RouterMiddleware.allowedMethods',
    })

    return allowedMethods
  }
}
