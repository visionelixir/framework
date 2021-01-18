# Router Service

- **Registered:** Global container
- **Container Name:** `'router'` or via constant `import { SERVICE_ROUTER } from '@visionelixir/framework'`
- **Type:** Singleton

The router service provides a way of registering and handling routes in your application. It is an extension of the
`koa-router` NPM package. Modified for ease of use and integration with VisionElixir

## Accessing the Router Object

There are 3 ways to access the router object

### Facade

The router facade provides a very easy way to access the instance without pulling it from the container

Import the facade:
```typescript
import { RouterFacade as Router } from '@visionelixir/framework'
```

Then use it within your script:
```typescript
Router.get('info', [HomeMiddleware.info()])
```

### Container

When you have access to the service container such as in Service Class methods then you can resolve it:

```typescript
import { SERVICE_ROUTER, Router } from '@visionelixir/framework'

export default class SomeService implements Service {
  public boot(container: Container): void {
    const router = container.resolve<Router>(SERVICE_ROUTER) // resolve it from the container
  }
}
```

### Vision Elixir Helper

```typescript
import { VisionElixir, Router, SERVICE_ROUTER } from '@visionelixir/framework'

const router = VisionElixir.service<Router>(SERVICE_ROUTER)
```

## Usage

### Registering Routes

The router service adds a method to the Service Class for registering routes and passes the router. This is the
recommended place to register your routes for your service.

The method added to Service Classes is called `registerRoutes(router: Router): void`

```typescript
import { RouterFacade as Router } from './types'

export class MyService {
  public registerRoutes(router: Router): void {
    router.post('info', [MyMiddleware.handleSomePost()])
  }
}
```

Or using the facade:
```typescript
import { RouterFacade as Router } from './types'

export class MyService {
  public registerRoutes(): void {
    Router.post('info', [MyMiddleware.handleSomePost()])
  }
}
```

#### Using a separate route file:

Without using the facade:

Create your route file e.g. `routes.ts` in the root of your service:
```typescript
import { Router } from '@visionelixir/framework'
import { HomeMiddleware } from './middleware/HomeMiddleware'

export default (router: Router) => {
  router.get('', [HomeMiddleware.view()])
  router.get('302', [HomeMiddleware.response302()])
  router.get('info', [HomeMiddleware.info()])
  router.get('500', [HomeMiddleware.response500()])
}
```

Then use it in your ServiceClass:

```typescript
import { Service } from '@visionelixir/framework'
import registerRoutes from './routes'

export default class MyService implements Service {
  public registerRoutes(router: Router): void {
    registerRoutes(router)
  }
}
```

Using the Facade:

Create your route file e.g. `routes.ts` in the root of your service:
```typescript
import { RouterFacade as Router } from '@visionelixir/framework'
import { HomeMiddleware } from './middleware/home'

export default () => {
  Router.get('', [HomeMiddleware.view()])
  Router.get('302', [HomeMiddleware.response302()])
  Router.get('info', [HomeMiddleware.info()])
  Router.get('500', [HomeMiddleware.response500()])
}
```

Then use it in your ServiceClass:

```typescript
import { Service } from '@visionelixir/framework'
import registerRoutes from './routes'

export default class MyService implements Service {
  public registerRoutes(): void {
    registerRoutes()
  }
}
```

### Middleware

Routes use middleware from KoaJS and follow the same `onion` execution as Koa middleware with a shared `context` and `next`
to call the next middleware.

### Methods

The router has several methods for registering routes:

`.find(path: string, method: string): Route | undefined` \
Searches registered routes looking for a route registered for a given method on a given path

`.all(path: string, middleware: Middleware[]): Router` \
Registers a route to respond to any HTTP methods (GET, DELETE, PUT, PATCH, POST etc)

`.post(path: string, middleware: Middleware[]): Router` \
Adds a `POST` route for a given path

`.put(path: string, middleware: Middleware[]): Router` \
Adds a `PUT` route for a given path

`.patch(path: string, middleware: Middleware[]): Router` \
Adds a `PATCH` route for a given path

`.delete(path: string, middleware: Middleware[]): Router` \
Adds a `DELETE` route for a given path

`.options(path: string, middleware: Middleware[]): Router` \
Adds an `OPTIONS` route for a given path

`.some(methods: RouterMethod[], path: string, middleware: Middleware[]): Router` \
Adds a route for some HTTP methods
`e.g. Router.some([ RouterMethod.PUT, RouterMethod.POST ], 'route/here', [MyMiddleware.someMethod()]`

`.add(method: RouterMethod, path: string, middleware: Middleware[]`\
The above methods all call this method to add a route

`.getRoutes(): Route[]` \
Returns an array of all the registered routes

`.getCore(): KoaRouter` \
Returns the underlying koa-router instance

## Route Objects

When routes are registered with the router a route object is created, these are accessed through the `.getRoutes()` and
`.find()` methods of the router.

### Methods

`.getMethod(): RouterMethod` - returns the route http method (GET or PUT or POST etc)

`.getPath(): string` - returns the path this route is registered on

`.getMiddleware(): Middleware[]` - returns the array of middleware that the route uses

### Parameters

Routes can contain parameters such as for in REST API's. E.g.

```typescript
Router.get('account/:accountId', [account()])
```

Then in your middleware this will be available on the context: `ctx.params.{name}`
```typescript
function account(): Middleware {
  return async (ctx: Context): Promise<void> => {
    const { accountId } = ctx.params
  }
}
```

## Types

All exported types are available at the root `@visionelixir/framework`

- `RouterMethod` - Enum of HTTP Methods (GET, PUT, POST etc)
- `Route` - Interface contract of a Route implementation
- `Router` - Interface contract of a Router implementation
- `SERVICE_ROUTER` - Constant for the name registered in the container
