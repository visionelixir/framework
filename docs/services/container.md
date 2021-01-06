# Container Service

- **Registered:** N/A
- **Container Name:** N/A
- **Type:** Singleton

What is the service container? It provides a single access point for all services within the application. It also allows 
for those services to be decoupled. E.g. if everything uses the Logger from the container, then it's easy to swap out that
logger for a different logger, all they have to do is meet the same contract (interface). Therefore, the underlying
implementation no longer matters to any other service.

As VisionElixir is created as services and are registered into the same container as your project services then it's easy
for you to swap out a core service for your own, so long as you meet the same contract for that service.

VisionElixir has two scopes:
1. Global - The application level scope
2. Local - The request/response lifecycle scope (this happens within the global scope)

Therefore, there are two service container instances, one at each level.

Why two containers/scopes? Some services are better booted once, at application level such as a logger. Others need to
be local to the request/response, such as the collector.

The local service container extends the global container. Therefore, if a service is registered within the global
container then resolving it from the local container will still find it.

## Accessing the container

There are several ways to access the container

### Methods Where it's Provided

Some methods provide it as a parameter such as within the Service Class methods

```typescript
export default class MyService implements Service {
  // global container
  public globalInit(globalContainer: Container): void {
    // do something
  }

  // global container
  public globalBoot(globalContainer: Container): void {
    // do something
  }

  // local container
  public init(container: Container): void {
    // do something
  }
  
  // local container
  public boot(container: Container): void {
    // do something
  }
}
```

### Vision Elixir Helper

```typescript
import { VisionElixir, Collector, SERVICE_CONFIG } from '@visionelixir/framework'

// local container
const requestContainer = VisionElixir.container()

// global container
const applicationContainer = VisionElixir.globalContainer()
```

## Configuration

None

## Methods

`constructor(name: string, parent?: Container)` constructs a new container
`name` just names the container, `parent` is a parent container to extend allowing resolution to fallback to the parent
if the service is not found within the container.

`.getName(): string` returns the name of the container

`.transient(name: string, object: Class, force = false,): VisionElixirContainer` registers a class as transient
