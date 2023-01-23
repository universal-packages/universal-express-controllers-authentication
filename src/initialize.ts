import { AuthenticatableClass, Authentication } from '@universal-packages/authentication'
import '@universal-packages/express-controllers-parameters'
import { AuthenticationRoutes, CurrentAuthentication, ExpressControllerAuthenticationOptions } from './types'

export const CURRENT_AUTHENTICATION: CurrentAuthentication = { instance: null, options: null }

export async function initialize(options: ExpressControllerAuthenticationOptions, authenticatableClass?: AuthenticatableClass): Promise<CurrentAuthentication> {
  if (!CURRENT_AUTHENTICATION.instance) {
    const routesOptions = { ...options.routes }
    const finalRoutesOptions: AuthenticationRoutes = {
      connectProvider: { enable: true, path: 'connect-provider', method: 'PATCH', ...routesOptions.connectProvider },
      continueWithProvider: { enable: true, path: 'continue-with-provider', method: 'POST', ...routesOptions.continueWithProvider },
      invite: { enable: true, path: 'invite', method: 'PUT', ...routesOptions.invite },
      logIn: { enable: true, path: 'log-in', method: 'POST', ...routesOptions.logIn },
      requestConfirmation: { enable: true, path: 'request-confirmation', method: 'PUT', ...routesOptions.requestConfirmation },
      requestCorroboration: { enable: true, path: 'request-corroboration', method: 'PUT', ...routesOptions.requestCorroboration },
      requestMultiFactor: { enable: true, path: 'request-multi-factor', method: 'PUT', ...routesOptions.requestMultiFactor },
      requestPasswordReset: { enable: true, path: 'request-password-reset', method: 'PUT', ...routesOptions.requestPasswordReset },
      signUp: { enable: true, path: 'sign-up', method: 'POST', ...routesOptions.signUp },
      updateAuthenticatable: { enable: true, path: 'update-authenticatable', method: 'PATCH', ...routesOptions.updateAuthenticatable },
      updateCredential: { enable: true, path: 'update-credential', method: 'PATCH', ...routesOptions.updateCredential },
      verifyConfirmation: { enable: true, path: 'verify-confirmation', method: 'PUT', ...routesOptions.verifyConfirmation },
      verifyCorroboration: { enable: true, path: 'verify-corroboration', method: 'PUT', ...routesOptions.verifyCorroboration },
      verifyMultiFactor: { enable: true, path: 'verify-multi-factor', method: 'PUT', ...routesOptions.verifyMultiFactor },
      verifyPasswordReset: { enable: true, path: 'verify-password-reset', method: 'PUT', ...routesOptions.verifyPasswordReset },
      verifyUnlock: { enable: true, path: 'verify-unlock', method: 'PUT', ...routesOptions.verifyUnlock }
    }

    CURRENT_AUTHENTICATION.options = { rootPath: 'authentication', ...options, routes: finalRoutesOptions }
    CURRENT_AUTHENTICATION.instance = new Authentication(CURRENT_AUTHENTICATION.options, authenticatableClass)

    await CURRENT_AUTHENTICATION.instance.loadDynamics()

    return CURRENT_AUTHENTICATION
  } else {
    throw new Error('Authentication already initialized')
  }
}
