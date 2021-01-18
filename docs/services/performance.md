# Performance Service

- **Registered:** Global and Local containers
- **Container Name:** `'performance'` or via constant `import { SERVICE_PERFORMANCE } from '@visionelixir/framework'`
- **Type:** Singleton

The performance service provides a way to time (benchmark) execution between two points.

It's important to note the two scopes of the performance object:
- One is scoped at the application level
- The other is scoped at the request level

## Accessing the Performance Object

There are 3 ways to access the performance object

### Facade

The performance facade provides a very easy way to access the instance without pulling it from the container

Import the facade:
```typescript
import { PerformanceFacade as Performance } from '@visionelixir/framework'
```

Then use it within your script:
```typescript
Performance.start('timing.name')
// perform some action to be timed
Performance.stop('timing.name')
```

### Container

When you have access to the service container such as in Service Class methods then you can resolve it:

```typescript
import { SERVICE_PERFORMANCE, Performance } from '@visionelixir/framework'

export default class SomeService implements Service {
  public boot(container: Container): void {
    const performance = container.resolve<Performance>(SERVICE_PERFORMANCE) // resolve it from the container
  }
}
```

### Vision Elixir Helper

```typescript
import { VisionElixir, Performance, SERVICE_PERFORMANCE } from '@visionelixir/framework'

const performance = VisionElixir.service<Performance>(SERVICE_PERFORMANCE)
```

## Usage

To use the performance library call start with a name before the code to benchmark and then stop with the same name after
the code has completed executing:

```typescript
import { PerformanceFacade as Performance } from '@visionelixir/framework'

Performance.start('timer')
// execute your code here
Performance.stop('timer')

const timeInMs = Performance.get('timer').getDuration()
```

It's possible to use the same mark to time the total of a series of events

```typescript
Performance.start('external.service.call')
// call to external service
Performance.stop('external.service.call')

Performance.start('external.service.call')
// call to external service
Performance.stop('external.service.call')

Performance.start('external.service.call')
// call to external service
Performance.stop('external.service.call')

// Use get to get the PerformanceMarkObject
const externalServiceTimings = Performance.get('external.service.call')

console.info(externalServiceTimings.getCount()) // 3
console.info(externalServiceTimings.getDuration()) // time in ms for all calls

// reset the benchmark
externalServiceTimings.reset()

console.info(externalServiceTimings.getCount()) // 0
console.info(externalServiceTimings.getDuration()) // 0

Performance.start('external.service.call')
// call to external service
Performance.stop('external.service.call')

console.info(externalServiceTimings.getCount()) // 1
console.info(externalServiceTimings.getDuration()) // time in ms for the one call
```

### Performance Object
`Performance` object has the following methods:

`.start(name: string): Performance` - starts a new PerformanceMark of the given name

`.stop(name: string): Performance` - stops a new PerformanceMark of the given name

`.get(name: string): PerformanceMark` - retrieves a PerformanceMark by name

`.all(): PerformanceMarkCollection` - returns an object of all performance marks keyed by name

`.allArray(): PerformanceMark[]` - returns an array of all performance marks (name can be resolved from the marks themselves)

`.clear(name: string): Performance` - clears a performance mark by name

`.clearAll(): Performance` - clears all performance marks

### PerformanceMark Object

`PerformanceMark` objects have the following methods:

`.getName(): string` - returns the name of the performance mark, this is the name you passed in when starting the benchmark

`.isRunning(): boolean` - returns true if the benchmark is still running (hasn't had stop called yet)

`.start(): PerformanceMark` - starts the benchmark

`.stop(): PerformanceMark` - stops the benchmark

`.getDuration(): number` - returns the time taken to complete the benchmark in ms

`.reset(): PerformanceMark` - resets the performance mark duration and counts

`.getCount(): number` - returns the amount of times this performance mark has been run

## Types

All exported types are available at the root `@visionelixir/framework`

- `PerformanceMarkCollection` - An object keyed by the names of the marks
- `PerformanceMark` - Interface contract of a PerformanceMark implementation
- `Performance` - Interface contract of a Performance implementation
- `SERVICE_PERFORMANCE` - Constant for the name registered in the container
