# Config Service

- **Registered:** Global container
- **Container Name:** `'environment'` or via constant `import { SERVICE_ENVIRONMENT } from '@visionelixir/framework'`
- **Type:** Singleton

The environment service provides a way to manage multiple environments.

## Accessing the Environment Object

There are 3 ways to access the environment

### Facade

The environment facade provides a very easy way to access the instance without pulling it from the container

Import the facade:
```typescript
import { EnvironmentFacade as Environment } from '@visionelixir/framework'
```

Then use it within your script:
```typescript
const value = Environment.get('NAME')
```

### Container

When you have access to the service container such as in Service Class methods then you can resolve it:

```typescript
import { SERVICE_ENVIRONMENT, Database } from '@visionelixir/framework'

export default class SomeService implements Service {
  public boot(container: Container): void {
    const environment = container.resolve<Environment>(SERVICE_ENVIRONMENT) // resolve it from the container
  }
}
```

### Vision Elixir Helper

```typescript
import { VisionElixir, Environment, SERVICE_ENVIRONMENT } from '@visionelixir/framework'

const environment = VisionElixir.service<Environment>(SERVICE_ENVIRONMENT)
```

## Configuration

An example configuration is as follows:

```typescript
import { DatabaseConnectionTypes } from '@visionelixir/framework'

export const DATABASE_CONFIG: DatabaseConfig = {
  connections: {
    default: {
      type: DatabaseConnectionTypes.PG,
      host: 'localhost',
      port: 5432,
      database: 'my_database',
      user: 'postgres',
      password: 'postgres',
    },
    connection2: {
      type: DatabaseConnectionTypes.PG,
      host: 'localhost',
      port: 5432,
      database: 'my_other_database',
      user: 'postgres',
      password: 'postgres',
    }
  },
}
```

Under the connections key you can add as many named database connections as you require.

Then import it into your app config under the database key:

```typescript
import { DATABASE_CONFIG } from './database'

export const APP_CONFIG: VisionElixirConfig = {
  name: Environment.get('NAME', 'App'),

  host: Environment.get('HOST', 'http://localhost'),
  port: Environment.get('PORT', 8080, EnvironmentCasts.NUMBER),

  // ...
  
  database: DATABASE_CONFIG,
}

```

## Defining Environment Variables

Environment variables can be defined in 4 ways:

### Environment Files

In your project root create an environment file for each environment that you want:
`.production.environment`
`.development.environment`
`.staging.environment`
`.test.environment`

Within these files define your variables:
```dotenv
NAME="Vision Elixir - Development"
PORT=3000
DEBUG=true
```

### Command Options

You can pass any environment variables as options when booting the application

```
node index.js --PORT=3000 --environment='development'
```

### System Environment Variables

VisionElixir will also use environment variables

```
PORT=3001 NODE_ENV=development node index.js
```

### Setting at Runtime

Whilst not recommended you can also set them at runtime:

```typescript
import { EnvironmentFacade as Environment } from '@visionelixir/framework'

Environment.set('name', 'value')
```

## Retrieving Environment Variables

Retrieving environment variables is easy. Below we will show examples using the facade:
```typescript
// import the facade
import { EnvironmentFacade as Environment } from '@visionelixir/framework'
```

Get a variable value:
```typescript
const appPort = Environment.get('PORT')
```

Sometimes you'll want to have a default value for when the environment value does not exist
```typescript
const appPort = Environment.get('PORT', 3000)
```

Sometimes you'll want to cast your value to a certain type. E.g. number or boolean. You can do this by passing in a cast
as the 3rd value. `EnvironmentCasts.NUMBER` `EnvironmentCasts.BOOLEAN` `EnvironmentCasts.STRING` `EnvironmentCasts.JSON`
```typescript
const appPort = Environment.get('PORT', 3000, EnvironmentCasts.NUMBER)
```

You can also retrieve all loaded environment variables:
```typescript
const allEnvVars = Environment.all()
```

## Determining the Current Environment

You can easily determine the environment the application is currently running in:

```typescript
import { EnvironmentFacade as Environment } from '@visionelixir/framework'

const currentEnvironment = Environment.which()
```

## Refreshing the Environment Variables

By default, the environment variables are only loaded when the app is booted. If for some reason you want to reload them
you can do so by calling the `.fetch()` method. Note that this resets all programmatically set environment variables.

```typescript
import { EnvironmentFacade as Environment } from '@visionelixir/framework'

Environment.fetch()
```
