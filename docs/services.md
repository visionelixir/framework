# Services
VisionElixir bases itself around the concept of services. Both the project and core use the same methodology.

A service should be created for an individual group of logic. An example of this is a library (Logger, Event Emitter,
Database) or for a resource of a Rest API (Auth, Users, Orders) etc.

## Core Services
The core consists of several generic services used in a typical project. These include:

- App - The App Service is the service that a project runs within. It creates the application core, loads the 
  services and more
- Collector - A service for collecting together metadata to display/record or whatever at a later date
- Config - A helper to get data from the application configuration
- Container - A simple service container which all services are resolved through
- Core - The core of the application, this serves the app, orchestrates the middleware cycle for a 
  request/response etc
- Database - A way to integrate with databases (currently only PostgeSQL is supported)
- Environment - A way to handle loading and using variables across different environments
- Error - Application error handling
- Event - An event dispatched for emitting and listening to application events
- Logging - A simple logger for printing various outputs (currently supports Console and Google Cloud logging)
- Performance - A library for measuring the time between two points of code
- Router - A wrapper around koa-router integrated with the VisionElixir application for simplicity
- View - A library for rendering nunjucks view files
- Zone - Orchestrates the creation of a context per request/response using node async hooks for data sharing

## Anatomy of a Service
### Service Class
The core of a service, whether a core or project service, is the Service class.
This file exists in the root of each service's directory and exists to boot the service, register libraries belonging
to it in the service container etc.

How you decide to boot your service depends on you, however, the service class provides several hooks into
the application lifecycle to choose where is best for you. This depends on whether your service is specific to the 
application or to the request. For example, the logger service gets booted to the
application, as the same logger can be used throughout the application and doesn't rely on anything within the context
of the request/response lifecycle. Alternatively, the core collector service boots local to the request as it's
used to collect metadata only within the scope of a request lifecycle.

The service class therefore gives you methods that you can implement to allow you to boot and register your service.

#### The methods for services at the application level:

1. `applicationInit` - The application init method is called when the application is first being constructed, this is where all
   application wide accessible services get constructed and registered with the service container. This should be where you
   initialise your service to where another service can use it.
2. `applicationBoot` - Following the application init method being called is the application boot method. This allows you to do any
   further setup of your service as well as know you can safely use other services from the service container.
   
An example of this is within the database core service. Where the database manager class gets constructed and registered
with the service container within the applicationInit method. Then within the applicationBoot method it gets the config and sets
up the connections.

#### The methods for services at the request/response lifecycle level:

1. `init` - The init method is called before the middleware flow of a request/response lifecycle starts, this is where all
   locally accessible services get constructed and registered with the service container. This should be where you
   initialise your service to where another service can use it.
2. `boot` - Following the local init method being called is the boot method. This allows you to do any
   further setup of your service as well as know you can safely use other services from the service container.
   
An example of this is within the event core service. A new event emitter is created and registered with the container
within the init method and then calls all the other services for them to register events within the boot method.

#### Additional Hooks

Other services can add methods to the service class that you can hook into. An example of this is the event and router
core services which give methods for registering event listeners and routes respectively. However, these hooks are
covered within their respective documentation.

If you would like to expose methods to other services from your own service then you can extend the `Service Interface`
as follows:

```typescript
declare module '@visionelixir/framework' {
  interface Service {
    registerEvents?: (emitter?: Emitter, container?: Container) => void
    applicationRegisterEvents?: (emitter?: Emitter, container?: Container) => void
  }
}
```

Then add the call from with in the `boot` or `1applicationBoot` methods of your Service Class as follows:

```typescript
const serviceObjects: Service[] = App.getServiceObjects()

serviceObjects.forEach((service: Service) => {
  if (service.registerEvents) {
    service.registerEvents(Emitter, Container)
  }
})
```

## Creating a service

To create a service, all that is required is to make a new directory within the project services directory.

## Registering a service

Upon creating a service, all you have to do is to register it with the application. To register your service
with the application all you have to do is add the service directory name into the `require.project` section of the
`services` section in the application config:

```javascript
{
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
    project: ['myService', 'myService2', 'myService3'],
  },
}
```

Services are loaded synchronously and in the order defined within the configuration. Therefore, you have control over
any dependencies. Just make sure that if `myService2` needs something from `myService` to have it later in the service
array. VisionElixir core services are loaded before project services.

## Service Configuration

If you don't like the naming conventions of VisionElixir, then you can also change the `service` directory name to
anything you'd like, such as `providers` or `modules`
Similarly, if you don't want the `Service` class file to be called `Service` then you can change that within the service
configuration.

## 3rd Party Services

It's currently not possible to load 3rd party services directly from NPM. However, this is planned for a future release.
