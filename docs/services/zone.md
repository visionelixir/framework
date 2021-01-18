# Zone Service

- **Registered:** Global Container
- **Container Name:** `'zone'` or via constant `import { SERVICE_ZONE } from '@visionelixir/framework'`
- **Type:** Singleton

Orchestrates the creation of a context per request/response using node async hooks for data sharing

Zones are the main extension of KoaJS that VisionElixir provides. It prevents passing the ctx and other objects everywhere
instead sharing that data through the zone.

This service shouldn't be required by general use. However, it's accessible through the container/facade.

The best way to interact with the zone is through the VisionElixir library available in the App Service. This helper
provides ways of accessing the ctx, id, container etc from the zone without interacting directly with the zone itself.

## Accessing the Zone Object

There are 3 ways to access the Zone

### Facade

The zone facade provides a very easy way to access the instance without pulling it from the container

Import the facade:
```typescript
import { ZoneFacade as Zone } from '@visionelixir/framework'
```

### Container

When you have access to the service container such as in Service Class methods then you can resolve it:

```typescript
import { SERVICE_ZONE, Zone } from '@visionelixir/framework'

export default class SomeService implements Service {
  public boot(container: Container): void {
    // resolve it from the container
    const zone = container.resolve<Zone>(SERVICE_ZONE)
  }
}
```

### Vision Elixir Helper

```typescript
import { VisionElixir, Zone, SERVICE_ZONE } from '@visionelixir/framework'

const zone = VisionElixir.service<Zone>(SERVICE_ZONE)
```

## Usage

Examples will use the facade for accessing the zone

Getting the current zone:

```typescript
import { ZoneFacade as Zone } from '@visionelixir/framework'

const zone = Zone.getCurrentZone()
```
