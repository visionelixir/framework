# View Service

- **Registered:** Global container
- **Container Name:** `'view'` or via constant `import { SERVICE_VIEW } from '@visionelixir/framework'`
- **Type:** Singleton

The view service is responsible for rendering views using nunjucks as well as offering a theme layer with theme fallback

By default, themes exist under the `/srv/themes/theme-name` directory. However, this can be changed in the config.

## Accessing the View Object

There are 3 ways to access the view object

### Facade

The view facade provides a very easy way to access the instance without pulling it from the container

Import the facade:
```typescript
import { ViewFacade as View } from '@visionelixir/framework'
```

Then use it within your script:
```typescript
const rendered = View.render('welcome', {
  page: {
    title: 'Welcome',
  },
})

ctx.body = rendered
```

### Container

When you have access to the service container such as in Service Class methods then you can resolve it:

```typescript
import { SERVICE_VIEW, View } from '@visionelixir/framework'

export default class SomeService implements Service {
  public boot(container: Container): void {
    const view = container.resolve<View>(SERVICE_VIEW) // resolve it from the container
  }
}
```

### Vision Elixir Helper

```typescript
import { VisionElixir, View, SERVICE_VIEW } from '@visionelixir/framework'

const view = VisionElixir.service<View>(SERVICE_VIEW)
```

## Configuration

An example configuration is as follows:

`src/config/view.ts`
```typescript
import { ViewConfig } from '@visionelixir/framework'

export const VIEW_CONFIG: ViewConfig = {
  serviceViewDirectory: 'views', // the folder within service directories to look for views
  themes: {
    directory: 'themes', // the name of the themes directory, in case you want to change it
    fallback: ['my-theme', 'base'], // the theme fallback. See the fallback section below for more information
  },
}
```

Then import it into your app config under the `view` key:

`src/config/app.ts`
```typescript
import { VIEW_CONFIG } from './view'

export const APP_CONFIG: VisionElixirConfig = {
  name: Environment.get('NAME', 'App'),

  host: Environment.get('HOST', 'http://localhost'),
  port: Environment.get('PORT', 8080, EnvironmentCasts.NUMBER),

  // ...

  view: VIEW_CONFIG,
}

```

## Theme Fallback

VisionElixir views offer themes as well as theme fallback. The fallback works by looking for a view in the theme directories
in the order defined in the config. For example:

Given the following fallback
`['my-theme', 'base']` when looking for a view it will look in the `my-theme` theme first, and if it's not found it will
then resolve it from the `base` theme.

Why is this useful? Consider having a base set of templates you share across multiple websites. You can have this as your
`base` theme and then only create views that differ for the specific site in the `my-theme` directory. This means your
base templates remain unaltered by the implementation specific to the theme you're creating.

## Usage

The below example uses the View Facade

```typescript
import { ViewFacade as View } from '@visionelixir/framework'

const rendered = View.render('welcome', {
  page: {
    title: 'Welcome',
  },
})

ctx.body = rendered
```

The View object has only the `.render()` method:

`.render(template: string, payload?: KeyValue | undefined): string`

Template is the path to the view starting from the root (either the theme directory or the service view directory). There
is no need to add the extension. E.g. if your template is within the `my-theme/pages/home.njk` then enter `my-theme/pages/home`

Payload is any data to supply to the view that can then be rendered within the view

## Templates

Create your templates with the `.njk` extension

All templates use Nunjucks, for more information please refer to the nunjucks documentation

## Types

All exported types are available at the root `@visionelixir/framework`

- `View` - Interface contract of a View implementation
- `ViewConfig` - Interface for the view configuration object
- `SERVICE_VIEW` - Constant for the name registered in the container
