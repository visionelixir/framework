# Config Service

- **Registered:** Global container
- **Container Name:** `'config'` or via constant `import { SERVICE_CONFIG } from '@visionelixir/framework'`
- **Type:** Singleton

The config service provides easy access to the application config

## Accessing the config

There are 3 ways to access the config instance

### Facade

The config facade provides a very easy way to access the instance without pulling it from the container

Import the facade:
```typescript
import { ConfigFacade as Config } from '@visionelixir/framework'
```

Then use it within your script:
```typescript
const appName = Config.name
```

### Container

When you have access to the service container such as in Service Class methods then you can resolve it:

```typescript
import { SERVICE_CONFIG, Container, SERVICE_CONFIG } from '@visionelixir/framework'

export default class ConfigService implements Service {
  public boot(container: Container): void {
    const config = container.resolve<VisionElixirConfig>(SERVICE_CONFIG) // resolve it from the container
  }
}
```

### Vision Elixir Helper

```typescript
import { VisionElixir, Collector, SERVICE_CONFIG } from '@visionelixir/framework'

const collector = VisionElixir.service<VisionElixirConfig>(SERVICE_CONFIG)
```

## Configuration

None

## Methods

None - this just returns the VisionElixirConfig object

## Types 

`SERVICE_CONFIG` - Constant for the container registration string
