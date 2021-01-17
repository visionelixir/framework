# Config Service

- **Registered:** N/A
- **Container Name:** N/A
- **Type:** N/A

The core service is an extension of the KoaJS framework adding zones and runs behind the scenes and not directly used.
However, there will be times where it's useful to access the underlying Koa instance and therefore it is exposed through 
the app `.getCore()` method.

## Types

`Context` - The context passed through middleware

`Middleware` - A middleware function

`Next` - the Next middleware function

`Request` - The http request object

`Response` - The http response object

`HttpStatus` - An enum of HTTP response status codes
