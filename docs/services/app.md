# App Service

- **Registered:** Application and Request containers
- **Container Name:** `'app'` or via constant `import { SERVICE_APP } from '@visionelixir/framework'`
- **Type:** Singleton

The app service is the core of a project. It creates and boots the application.

## Accessing the application from within the application

Sometimes it is useful to access the application object itself from within your application.
There are several ways available for you to do this.

### Facade

The app facade provides a very easy way to access the instance without pulling it from the container

Import the facade:
```typescript
import { AppFacade as App } from '@visionelixir/framework'
```

Then use it within your script:
```typescript
const appConfig = App.getConfig()
```

### Container

When you have access to the service container such as in Service Class methods then you can resolve it:
```typescript
import { SERVICE_APP } from '@visionelixir/framework'

export default class ConfigService implements Service {
  public init(container: Container): void {
    const app = container.resolve<App>(SERVICE_APP) // resolve it from the container

    container.singleton(SERVICE_CONFIG, app.getConfig()) // use it to get the config
  }
}
```

### Vision Elixir Helper

```typescript
import { VisionElixir, App } from '@visionelixir/framework'
import { SERVICE_APP } from './types'

const app = VisionElixir.service<App>(SERVICE_APP)
```

## Creating an application

To create an application it's as simple as follows:

```typescript
import { App } from '@visionelixir/framework'
import { APP_CONFIG } from './config/app'

new App(APP_CONFIG).up().then(() => {
  // party
})
```

Let's have a closer look:

1. We create a new application parsing the configuration to it e.g. `const app: App new App(APP_CONFIG)`
2. We call `.up()` to serve the application `await app.up()`
3. `.up()` returns a promise so if you need to do anything then you can use `then` and `catch` to handle success and failures
of the application booting

## Configuration

An example base config for an application is as follows:

```typescript
import {
  VisionElixirConfig,
  Environment,
  EnvironmentCasts,
  LoggingDriver,
} from '@visionelixir/framework'
import * as path from 'path'

export const APP_CONFIG: VisionElixirConfig = {
  name: Environment.get('NAME', 'App'),

  host: Environment.get('HOST', 'http://localhost'),
  port: Environment.get('PORT', 8080, EnvironmentCasts.NUMBER),

  debug: true,

  baseDirectory: path.normalize(`${__dirname}/..`),

  static: {
    directory: 'public',
    maxage: 1000 /*ms*/ * 60 /*s*/ * 60 /*m*/ * 24 /*hr*/, // cache for 1-day
  },
  
  services: {
    file: 'Service',
    directory: 'services',
    require: {
      ve: [
        'container',
        'zone',
        'logger',
        'app',
        'event',
        'error',
        'performance',
        'router',
        'view',
        'collector',
        'database',
        'config',
      ],
      project: [ 'core', 'auth', 'home' ],
    },
  }
}

```

Let's dive into each option:

`name` This is the name of the application.

`host` The hostname the application will run on. Used for generating urls.

`port` The port to serve on

`debug` Whether to run in debug mode or not - effects logging level

`baseDirectory` This is the base directory of the application, used for resolving

`static` Used for serving static files such as css, images, favicon etc

`static.directory` The directory to find static files from

`static.maxage` The max-age header to be sent with the static file (e.g. cache for 1 day)

`services` The configuration of services - see the services docs for more info

## Methods

The application provides several public methods to access certain functionality

`constructor()` Create an application, taking an optional config object. If the config is passed then the `app.create()`
method will automatically be called
```typescript
new App() // not automatically created
new App(config) // automatically calls create
```


`create()` Calls for the application to be created. This is only required if you want to construct the application without
passing the config.
```typescript
const myApp = new App()
myApp.create(config)
```

`up()` Serves the application on the configured port

`down()` Tears the application down, stopping it from being served

`getServiceObjects()` Returns all the constructed Service class objects of all loaded services. Useful if you want to 
provide an additional method to Service classes to be able to call that method

`getCore()` Gets the underlying core of the application. This is a slightly modified version of koa js. The only change
is the addition of zones

`getStatus()` Returns true if the application is currently served, false if not
```typescript
const app = new App(options)
console.info(app.getStatus()) // false
await app.up()
console.info(app.getStatus()) // true
```

`getConfig()` Returns the config that the app was created with
```typescript
const app = new App(options)
expect(app.getContainer()).toEqual(options) // true
```

`getContainer()` Returns the global application container

## Additional Libraries

### VisionElixir
Additional to the application, the app service also provides the VisionElixir helper object.
This object contains methods for easy access to zone and application resources.

#### Usage
Import it into your script:
```typescript
import { VisionElixir } from '@visionelixir/framework'
```

The available methods are as follows:

`.get<T>(name: string): T` retrieves data by key from the current zone (see the zone documentation for more information)
e.g.
```typescript
const zoneId = VisionElixir.get('id')
```

`.id()` returns the ID of the current zone context (see the zone documentation for more information)
```typescript
const zoneId = VisionElixir.id()
```

`.ctx()` returns the koa context from the current local request/response
```typescript
const ctx = VisionElixir.ctx()
```

`.service<T>(...serviceNames: string[]): T` resolves the services from the container (see the container documentation for more info)

```typescript
import { App, Performance, SERVICE_APP, SERVICE_PERFORMANCE } from './types'

const {
  app,
  performance
} = VisionElixir.service<{ app: App, performance: Performance }>(SERVICE_APP, SERVICE_PERFORMANCE)
```

`.container()` Returns the local request/response level container (see the container documentation for more info)

`.globalContainer()` Returns the global application level container (see the container documentation for more info)

## Types

`VisionElixirConfig` - The configuration interface for the app

`Service` - Interface for the ServiceClasses to implement

`SERVICE_APP` - Constant for the container registration string
