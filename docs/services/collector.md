# Collector Service

- **Registered:** Local container
- **Container Name:** `'collector'` or via constant `import { SERVICE_COLLECTOR } from '@visionelixir/framework'`
- **Type:** Singleton

The collector service stores categorised metadata at a request/response level. At the VisionElixir core level this is
used by several services to store metadata about the queries, request and performance within the request/response lifecycle.

The collector has the concept of collections and values. A collection is a named array, and a value is a value within
that collection which can be any datatype (string, object, number etc). The data is stored in the order that it was received.

```text
Collection: queries
- An array of all the queries that occurred through the database service during
  the request
```

```text
Collection: performance
- An array of all the performance results that triggered during the request
```

```text
Collection: request
- Only a single object in the array with all the metadata of the request
```

This metadata can then be output through the logger, stored to a file, analysed and displayed through a tool, written
to a database or any other purpose you can think of. It's just that, a collector of metadata.

## Accessing the collector

There are 3 ways to access the collector instance

### Facade

The collector facade provides a very easy way to access the instance without pulling it from the container

Import the facade:
```typescript
import { CollectorFacade as Collector } from '@visionelixir/framework'
```

Then use it within your script:
```typescript
Collector.add('myCollection', 'my value')
```

### Container

When you have access to the service container such as in Service Class methods then you can resolve it:

```typescript
import { SERVICE_COLLECTOR, Container } from '@visionelixir/framework'

export default class ConfigService implements Service {
  public boot(container: Container): void {
    const collector = container.resolve<Container>(SERVICE_COLLECTOR) // resolve it from the container
  }
}
```

### Vision Elixir Helper

```typescript
import { VisionElixir, Collector, SERVICE_COLLECTOR } from '@visionelixir/framework'

const collector = VisionElixir.service<Collector>(SERVICE_COLLECTOR)
```

## Configuration

None

## Methods

The collector provides several public methods to access certain functionality:

`.add<T>(collectionName: string, value: T): Collector` Adds a value to a collection, chainable

```typescript
import { CollectorFacade as Collector } from '@visionelixir/framework'

Collector
  .add('myCollection', 'my value')
  .add('myCollection', 'my value 2')
```

`.get<T>(collectionName: string): T[]` Fetches a value to a collection, chainable

```typescript
import { CollectorFacade as Collector } from '@visionelixir/framework'

Collector
  .add('myCollection', 'my value')
  .add('myCollection', 'my value 2')

const myCollection = Collector.get<string[]>('myCollection')
// [ 'my value', 'my value 2' ]
```

`.all(): KeyValue` Returns an object of all collections

```typescript
import { CollectorFacade as Collector } from '@visionelixir/framework'

Collector
  .add('myCollection', 'my value')
  .add('myCollection2', 'my value')

const myCollection = Collector.all()
// { myCollection: [ 'my value' ], myCollection2: [ 'my value' ] }
```

`.clear(?collectionName: string): KeyValue` Clears either all collections, or a named collection if the collection name
parameter is passed

```typescript
import { CollectorFacade as Collector } from '@visionelixir/framework'

Collector
  .add('myCollection', 'my value')
  .add('myCollection2', 'my value')
  .add('myCollection3', 'my value')

// { myCollection: [ 'my value' ], myCollection2: [ 'my value' ], myCollection3: [ 'my value' ] }
Collector.clear('myCollection2')
// { myCollection: [ 'my value' ], myCollection3: [ 'my value' ] }
Collector.clear()
// {}
```

## Types

`Collector` - Interface for the service

`SERVICE_COLLECTOR` - Constant for the container registration string
