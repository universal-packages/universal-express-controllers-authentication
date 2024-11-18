# Express Controllers Authentication

[![npm version](https://badge.fury.io/js/@universal-packages%2Fexpress-controllers-authentication.svg)](https://www.npmjs.com/package/@universal-packages/express-controllers-authentication)
[![Testing](https://github.com/universal-packages/universal-express-controllers-authentication/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-express-controllers-authentication/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-express-controllers-authentication/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-express-controllers-authentication)

[universal-authentication](https://github.com/universal-packages/universal-authentication) implementation on top of [universal-express-controllers](https://github.com/universal-packages/universal-express-controllers)

## Install

```shell
npm install @universal-packages/express-controllers-authentication

npm install @universal-packages/express-controllers
```

## Global methods

#### **`initialize(options: Object)`**

Initialize the authentication api and the authentication controller to prepare routing configuration before the `ExpressControllers` runs. The authentication controller is loaded automatically by `ExpressControllers`.

```js
import { ExpressControllers } from '@universal-packages/express-controllers'
import { initialize } from '@universal-packages/express-controllers-authentication'

await initialize({ secret: 'my-secret' })

const app = new ExpressControllers({ port: 3000 })
await app.prepare()
await app.run()
```

Now all authentication actions are available to access on path `authentication/<action>`

#### Options

`initialize` takes the same [options](https://github.com/universal-packages/universal-authentication#options) as `Authentication`.

Additionally takes the following ones:

- **`rootPath`** `String` `default: /authentication`
  You can set the root of all authentication routes, ex: `/auth/<action>`

## Authentication Modules

Enabled authentication modules that provide a controllers will be enabled in express controllers if they are enabled in the authentication api. For example the default module provided by `universal-authentication` is enabled by default.

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
