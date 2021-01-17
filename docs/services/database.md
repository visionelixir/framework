# Config Service

- **Registered:** Global container
- **Container Name:** `'database'` or via constant `import { SERVICE_DATABASE } from '@visionelixir/framework'`
- **Type:** Singleton

The database service provides a way to make database requests. Currently, supporting only PostgreSQL.

## Accessing the database object

There are 3 ways to access the database instance

### Facade

The database facade provides a very easy way to access the instance without pulling it from the container

Import the facade:
```typescript
import { DatabaseFacade as Database } from '@visionelixir/framework'
```

Then use it within your script:
```typescript
const result = await Database.get().query('my query')
```

### Container

When you have access to the service container such as in Service Class methods then you can resolve it:

```typescript
import { SERVICE_DATABASE, Database } from '@visionelixir/framework'

export default class SomeService implements Service {
  public boot(container: Container): void {
    const database = container.resolve<Database>(SERVICE_DATABASE) // resolve it from the container
  }
}
```

### Vision Elixir Helper

```typescript
import { VisionElixir, Collector, SERVICE_DATABASE } from '@visionelixir/framework'

const database = VisionElixir.service<VisionElixirConfig>(SERVICE_DATABASE)
```
