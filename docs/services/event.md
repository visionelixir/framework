# Event Service

- **Registered:** Application and Request containers
- **Container Name:** `'emitter'` or via constant `import { SERVICE_EMITTER } from '@visionelixir/framework'`
- **Type:** Singleton

The event service provides a way to emit and listen to events at both the Application and Request scopes. This is useful
for decoupling your services from each other.

It's important to note the two scopes of the event emitter:
- One is scoped at the application level for events such as: `VisionElixirApplicationEvents.INIT_MIDDLEWARE`
- The other is scoped at the request level for events such as: `VisionElixirRequestEvents.RESPONSE_PRE` and `VisionElixirLocalEvents.RESPONSE_POST`

This is important to know as if you're listening to the wrong Emitter then you'll never receive the event. Equally, if you
emit on the wrong Emitter, then you'll never trigger the right listeners.

## Accessing the Emitter Object

There are 4 ways to access the Emitter

### Facade

The emitter facade provides a very easy way to access the instance without pulling it from the container

Import the facade:
```typescript
import { EmitterFacade as Emitter } from '@visionelixir/framework'
```

Then use it within your script:

```typescript
import { VisionElixirEvent, Event } from './VisionElixirEvent'

// listen to the event (usually registered through the Service Class)
Emitter.on('some.event', (event: Event) => {
  const eventData = event.getData()
})

// throw an event somewhere else
const someEvent = new VisionElixirEvent({ some: 'data to go with the event' })
Emitter.emit('some.event', event)
```

### Container

When you have access to the service container such as in Service Class methods then you can resolve it:

```typescript
import { SERVICE_EMITTER, Emitter } from '@visionelixir/framework'

export default class SomeService implements Service {
  public boot(container: Container): void {
    // resolve it from the LOCAL container
    const emitter = container.resolve<Emitter>(SERVICE_EMITTER)
  }

  public globalBoot(container: Container): void {
    // resolve it from the LOCAL container
    const emitter = container.resolve<Emitter>(SERVICE_EMITTER)
  }
}
```

### Vision Elixir Helper

```typescript
import { VisionElixir, Emitter, SERVICE_EMITTER } from '@visionelixir/framework'

const emitter = VisionElixir.service<Emitter>(SERVICE_EMITTER)
```

## Usage

### Listening to Events

There are many ways to use the emitter, yet you're free to add listeners where you like, however, the event service adds
methods to the Service Class for registering events and passes the emitter and this is the recommended place to register your
event listeners.

Two methods are available to you for listening to events, one for each scope (`Application` and `Request`):

```typescript
import { VisionElixirGlobalEvents, VisionElixirLocalEvents } from './types'

export class MyService {
  registerEvents(requestEmitter: Emitter, container: Container): void {
    emitter.on(VisionElixirLocalEvents.RESPONSE_PRE, (event: Event): void => {
      // do something with the event
    })
  }

  globalRegisterEvents(applicationEmitter: Emitter, container: Container): void {
    emitter.on(VisionElixirGlobalEvents.INIT_MIDDLEWARE, (event: Event): void => {
      // do something with the event
    })
  }
}
```

### Emitting Events

Emitting your own events is easy. Simply use the `.emit()` method on the emitter and pass it an `Event` object. This is
the same event object that will be received by your listener and so you can send any data along with it that might be useful
for another service to use.

In the example below we'll use the `Emitter Facade` but you can use any other method above to get the instance

```typescript
import { EmitterFacade as Emitter, VisionElixirEvent } from '@visionelixir/framework'

// emit an event with some data
Emitter.emit('Some:event.name', new VisionElixirEvent({ key: 'value' }))
```

When naming your events it's best to namespace them somehow so to not conflict with other events that might exist from other
services or libraries. An example for that could be `{Project}:{Service}.{EventName}` such as `VisionElixir:App.ResponsePre`

## Core Events

The VisionElixir core fires many events that you can use to hook into the core functionality. Two enums exist for these events
to make it easier to access them. `VisionElixirLocalEvents` and `VisionElixirGlobalEvents`

## Exported Types

All exported types are available at the root `@visionelixir/framework`

- `Emitter` - Interface contract for an emitter
- `Event` - Interface a for an event object. This gets set when the event is emitted and then received by the listener
- `EventListener` - Typing for an EventListener
- `VisionElixirLocalEvents` - see Core Events section above
- `VisionElixirGlobalEvents` - see Core Events section above
- `SERVICE_EMITTER` - Constant for the registered container name
