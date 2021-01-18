# Error Service

- **Registered:** N/A
- **Container Name:** N/A
- **Type:** N/A

The error service is responsible for handling errors that get thrown during the application lifecycle. This is done via
the emitter and is left up to you how you want to handle the errors. However, two error handlers have been created as a
base way of handling errors in a project. One is for API's and one for websites. We'll dive into both below.

## The Event

VisionElixir emits the `VisionElixirLocalEvents.RESPONSE_ERROR` event when an error gets thrown within any request lifecycle:

```typescript
await emitter.emit(
  VisionElixirLocalEvents.RESPONSE_ERROR,
  new VisionElixirEvent({
    status,
    error,
    ctx,
  })
)
```

To understand more about VisionElixir events then visit the documentation on the VisionElixir event service.

## Handling Errors

Under the core service in the base project repo the error event is handled in `services/core/events.ts`:

```typescript
Emitter.on(
    VisionElixirLocalEvents.RESPONSE_ERROR,
    async (event: VisionElixirEvent): Promise<void> => {
      const { status, ctx, error } = event.getData()

      await websiteErrorHandler(status, error, ctx)
    },
  )
```

Here it awaits the `websiteErrorHandler` to handle the errors, there's also an `apiErrorHandler` if you're building an api.
However, feel free to handle errors in which ever way works for you. This is why it's not part of the core VisionElixir 
framework so that you can customise it to how it fits your application.

The two provided handlers exist under: `services/core/utils/error-handler.ts` and can be customised to suit your needs.

This includes how to respond to the request and what information to expose depending on the debug config etc.

Note that VisionElixir will automatically log all errors through the logger so there's no need to log manually from here.
