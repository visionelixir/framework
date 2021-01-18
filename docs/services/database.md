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
import { VisionElixir, Database, SERVICE_DATABASE } from '@visionelixir/framework'

const database = VisionElixir.service<Database>(SERVICE_DATABASE)
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

## Usage

The database service consists of the `Database` object and then `Connection` objects. You use the `Database` object
to retrieve a connection to then perform operations on.

### Database Object
Let's start with the `Database` object which was shown how to retrieve above. We'll use the facade in the example:

```typescript
import { DatabaseFacade as Database } from '@visionelixir/framework'

// use the get method to retrieve the database connection instance from your config.
// by default the get method with no parameter passed returns the default connection
const defaultConnection = Database.get() // default connection
const connection2 = Database.get('connection2') // passing the connection key from the config
```

This is the main way you'll interact with the `Database` object. However, it also has a couple of other methods.

`.add(name: string, instance: Pg)` adds a new connection. This is used internally by VisionElixir to populate the object
and you should not need to call it yourself.

`.all()` returns an object keyed by the connection name and with the connections as the value

### Connection Object

Now that we've seen how to get a connection object we can look at how we can interact with the database.

The main method you'll use is the `.query()` async method.

In the example below we'll use a parametrised query to fetch an array of `Record`'s from our `connection2` database

```typescript
interface Record {
  id: string,
  time: string,
  value: string,
}

const result = await Database.get('connection2').query<Record[]>(`
  SELECT *
  FROM records
  WHERE time > $1
    AND time < $2
`, [ '1950-01-01 00:00:00', '1950-01-02 00:00:00' ])
```

Result will then contain an array of `Record` objects, or an empty array if none were found.

When you know you'll only receive a single query from the database then you can use the `.queryOne()` method.
This uses the same logic as above, but you'll get either the record or `null` back saving you from checking array results.

```typescript
interface Record {
  id: string,
  time: string,
  value: string,
}

const result = await Database.get('connection2').queryOne<Record | null>(`
  SELECT *
  FROM records
  WHERE id = $1
`, [ 'my_id' ])
```

Here result will be either the record with id `my_id` or null if it was not found.

#### Additional Methods

Additionally, to the main two query methods there's several more methods on a connection that might be useful:

`.getName()` returns the name of the given connection

`.getConfig()` returns the configuration options of the connection

`.connect(): DatabaseConnection | Promise<DatabaseConnection>` (async) function to terminate the connection

`.disconnect(): Promise<DatabaseConnection>` async function to terminate the connection
