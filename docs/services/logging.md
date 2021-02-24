# Logging Service

- **Registered:** Application Container
- **Container Name:** `'logger'` or via constant `import { SERVICE_LOGGER } from '@visionelixir/framework'`
- **Type:** Singleton

The logger service provides a simple logger, currently for logging to console or Google Cloud Platform

## Configuration

The Configuration is very basic. At it's most simple form (console logging) just add a `logging` key to your app config
with the driver to use:

```typescript
import { DATABASE_CONFIG } from './database'

export const APP_CONFIG: VisionElixirConfig = {
  name: Environment.get('NAME', 'App'),

  host: Environment.get('HOST', 'http://localhost'),
  port: Environment.get('PORT', 8080, EnvironmentCasts.NUMBER),

  // ...
  
  logging: {
    type: LoggingDriver.CONSOLE,
  },
}

```

## Accessing the Logger Object

There are 3 ways to access the Logger

### Facade

The logger facade provides a very easy way to access the instance without pulling it from the container

Import the facade:
```typescript
import { LoggerFacade as Logger } from '@visionelixir/framework'
```

Then use it within your script:

```typescript
Logger.info('MyService', 'Something to log', { some: 'Meta Data' })
```

### Container

When you have access to the service container such as in Service Class methods then you can resolve it:

```typescript
import { SERVICE_LOGGER, Logger } from '@visionelixir/framework'

export default class SomeService implements Service {
  public boot(container: Container): void {
    // resolve it from the container
    const logger = container.resolve<Logger>(SERVICE_LOGGER)
  }
}
```

### Vision Elixir Helper

```typescript
import { VisionElixir, Logger, SERVICE_LOGGER } from '@visionelixir/framework'

const logger = VisionElixir.service<Logger>(SERVICE_LOGGER)
```

## Usage

### Methods

All methods work the same, just logging at different severities:

- The log name is typically the service that is doing the logging
- The message is the message you want to log
- The meta is an object of any metadata to go along with the log

`.log(logName: string, message: string, meta?: KeyValue): Logger` - Severity 0

`.debug(logName: string, message: string, meta?: KeyValue): Logger` - Severity 100

`.info(logName: string, message: string, meta?: KeyValue): Logger` - Severity 200

`.notice(logName: string, message: string, meta?: KeyValue): Logger` - Severity 300

`.warning(logName: string, message: string, meta?: KeyValue): Logger` - Severity 400

`.error(logName: string, message: string, meta?: KeyValue): Logger` - Severity 500

`.critical(logName: string, message: string, meta?: KeyValue): Logger` - Severity 600

`.alert(logName: string, message: string, meta?: KeyValue): Logger` - Severity 700

`.emergency(logName: string, message: string, meta?: KeyValue): Logger` - Severity 800

### Severity Levels Explained

```typescript
DEFAULT = 0 // The log entry has no assigned severity level.
DEBUG = 100 // Debug or trace information.
INFO = 200 // Routine information, such as ongoing status or performance.
NOTICE = 300 // Normal but significant events, such as start up, shut down, or a configuration change.
WARNING = 400 // Warning events might cause problems.
ERROR = 500 // Error events are likely to cause problems.
CRITICAL = 600 // Critical events cause more severe problems or outages.
ALERT = 700 // A person must take an action immediately.
EMERGENCY = 800 // One or more systems are unusable.
```

## Exported Types

All exported types are available at the root `@visionelixir/framework`

- `SeverityColors` - The colors that log to console with each severity level
- `Severity` - Enum of the different severity levels
- `Logger` - The interface contract for a logger
- `LoggingDriver` - Enum of available logging drivers
- `GoogleCloudLoggingConfig` - Additional config options for the logger when using GCP
- `LoggingConfig` - The config interface for the logger
- `SERVICE_LOGGER` - Constant for the logger name in the container
