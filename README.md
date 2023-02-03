# Express Controllers Authentication

[![npm version](https://badge.fury.io/js/@universal-packages%2Fexpress-controllers-authentication.svg)](https://www.npmjs.com/package/@universal-packages/express-controllers-authentication)
[![Testing](https://github.com/universal-packages/universal-express-controllers-authentication/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-express-controllers-authentication/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-express-controllers-authentication/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-express-controllers-authentication)

[universal-authentication](https://github.com/universal-packages/universal-authentication) implementation on top of [universal-express-controllers](https://github.com/universal-packages/universal-express-controllers)

## Install

```shell
npm install @universal-packages/express-controllers-authentication

npm install @universal-packages/express-controllers-parameters
npm install @universal-packages/express-controllers
npm install express
```

## Global methods
#### **`initialize(options: Object, [authenticatableClass: AuthenticatableClass])`**

Initialize the authentication api and the authentication controller to prepare routing configuration before the `ExpressApp` runs. The authentication controller is loaded automatically by `ExpressApp`.

```js
import { initialize } from '@universal-packages/express-controllers-authentication'
import { ExpressApp } from '@universal-packages/express-controllers'
import User from './User'

await initialize({ secret: 'my-secret' }, User)

const app = new ExpressApp({ port: 3000 })
await app.prepare()
await app.run()
```

Now all authentication actions are available to access on path `authentication/<action>`

#### Options

`initialize` takes the same [options](https://github.com/universal-packages/universal-authentication#options) as `Authentication`.

Additionally takes the following ones:

- **`rootPath`** `String` `default: /authentication`
  You can set the root of all authentication routes, ex: `/auth/<action>`
- **`routes`**
  - **`connectProvider`**
    - **`enable`** `Boolean` `default: true`
      Enables the controller to expose this action
    - **`path`** `String` `default: connect-provider`
      Enables the customization of the route for this action
    - **`method`** `HTTPVerb` `default: PATCH`
      Lets customize the method to access this action
  - **`continueWithProvider`**
    - **`enable`** `Boolean` `default: true`
      Enables the controller to expose this action
    - **`path`** `String` `default: continue-with-provider`
      Enables the customization of the route for this action
    - **`method`** `HTTPVerb` `default: POST`
      Lets customize the method to access this action
  - **`invite`**
    - **`enable`** `Boolean` `default: true`
      Enables the controller to expose this action
    - **`path`** `String` `default: invite`
      Enables the customization of the route for this action
    - **`method`** `HTTPVerb` `default: PUT`
      Lets customize the method to access this action
  - **`logIn`**
    - **`enable`** `Boolean` `default: true`
      Enables the controller to expose this action
    - **`path`** `String` `default: log-in`
      Enables the customization of the route for this action
    - **`method`** `HTTPVerb` `default: POST`
      Lets customize the method to access this action
  - **`requestConfirmation`**
    - **`enable`** `Boolean` `default: true`
      Enables the controller to expose this action
    - **`path`** `String` `default: request-confirmation`
      Enables the customization of the route for this action
    - **`method`** `HTTPVerb` `default: PUT`
      Lets customize the method to access this action
  - **`requestCorroboration`**
    - **`enable`** `Boolean` `default: true`
      Enables the controller to expose this action
    - **`path`** `String` `default: request-corroboration`
      Enables the customization of the route for this action
    - **`method`** `HTTPVerb` `default: PUT`
      Lets customize the method to access this action
  - **`requestMultiFactor`**
    - **`enable`** `Boolean` `default: true`
      Enables the controller to expose this action
    - **`path`** `String` `default: request-multi-factor`
      Enables the customization of the route for this action
    - **`method`** `HTTPVerb` `default: PUT`
      Lets customize the method to access this action
  - **`requestPasswordReset`**
    - **`enable`** `Boolean` `default: true`
      Enables the controller to expose this action
    - **`path`** `String` `default: request-password-reset`
      Enables the customization of the route for this action
    - **`method`** `HTTPVerb` `default: PUT`
      Lets customize the method to access this action
  - **`signUp`**
    - **`enable`** `Boolean` `default: true`
      Enables the controller to expose this action
    - **`path`** `String` `default: sign-up`
      Enables the customization of the route for this action
    - **`method`** `HTTPVerb` `default: POST`
      Lets customize the method to access this action
  - **`updateAuthenticatable`**
    - **`enable`** `Boolean` `default: true`
      Enables the controller to expose this action
    - **`path`** `String` `default: update-authenticatable`
      Enables the customization of the route for this action
    - **`method`** `HTTPVerb` `default: PATCH`
      Lets customize the method to access this action
  - **`updateCredential`**
    - **`enable`** `Boolean` `default: true`
      Enables the controller to expose this action
    - **`path`** `String` `default: update-credential`
      Enables the customization of the route for this action
    - **`method`** `HTTPVerb` `default: PATCH`
      Lets customize the method to access this action
  - **`verifyConfirmation`**
    - **`enable`** `Boolean` `default: true`
      Enables the controller to expose this action
    - **`path`** `String` `default: verify-confirmation`
      Enables the customization of the route for this action
    - **`method`** `HTTPVerb` `default: PUT`
      Lets customize the method to access this action
  - **`verifyCorroboration`**
    - **`enable`** `Boolean` `default: true`
      Enables the controller to expose this action
    - **`path`** `String` `default: verify-corroboration`
      Enables the customization of the route for this action
    - **`method`** `HTTPVerb` `default: PUT`
      Lets customize the method to access this action
  - **`verifyMultiFactor`**
    - **`enable`** `Boolean` `default: true`
      Enables the controller to expose this action
    - **`path`** `String` `default: verify-multi-factor`
      Enables the customization of the route for this action
    - **`method`** `HTTPVerb` `default: PUT`
      Lets customize the method to access this action
  - **`verifyPasswordReset`**
    - **`enable`** `Boolean` `default: true`
      Enables the controller to expose this action
    - **`path`** `String` `default: verify-password-reset`
      Enables the customization of the route for this action
    - **`method`** `HTTPVerb` `default: PUT`
      Lets customize the method to access this action
  - **`verifyUnlock`**
    - **`enable`** `Boolean` `default: true`
      Enables the controller to expose this action
    - **`path`** `String` `default: verify-unlock`
      Enables the customization of the route for this action
    - **`method`** `HTTPVerb` `default: PUT`
      Lets customize the method to access this action

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
