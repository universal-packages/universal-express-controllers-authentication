import { AuthenticatableClass, Authentication } from '@universal-packages/authentication'
import '@universal-packages/express-controllers-parameters'
import { AuthenticationRoutes, CurrentAuthentication, ExpressControllerAuthenticationOptions } from './types'

export const CURRENT_AUTHENTICATION: CurrentAuthentication = { instance: null, options: null }

export async function initialize(options: ExpressControllerAuthenticationOptions, authenticatableClass?: AuthenticatableClass): Promise<CurrentAuthentication> {
  if (!CURRENT_AUTHENTICATION.instance) {
    const routesOptions = { ...options.routes }
    const finalRoutesOptions: AuthenticationRoutes = {
      connectProvider: { enable: true, path: 'connect-provider', ...routesOptions.connectProvider },
      continueWithProvider: { enable: true, path: 'continue-with-provider', ...routesOptions.continueWithProvider },
      invite: { enable: true, path: 'invite', ...routesOptions.invite },
      logIn: { enable: true, path: 'log-in', ...routesOptions.logIn },
      requestConfirmation: { enable: true, path: 'request-confirmation', ...routesOptions.requestConfirmation },
      requestCorroboration: { enable: true, path: 'request-corroboration', ...routesOptions.requestCorroboration },
      requestMultiFactor: { enable: true, path: 'request-multi-factor', ...routesOptions.requestMultiFactor },
      requestPasswordReset: { enable: true, path: 'request-password-reset', ...routesOptions.requestPasswordReset },
      signUp: { enable: true, path: 'sign-up', ...routesOptions.signUp },
      updateAuthenticatable: { enable: true, path: 'update-authenticatable', ...routesOptions.updateAuthenticatable },
      updateCredential: { enable: true, path: 'update-credential', ...routesOptions.updateCredential },
      verifyConfirmation: { enable: true, path: 'verify-confirmation', ...routesOptions.verifyConfirmation },
      verifyCorroboration: { enable: true, path: 'verify-corroboration', ...routesOptions.verifyCorroboration },
      verifyMultiFactor: { enable: true, path: 'verify-multi-factor', ...routesOptions.verifyMultiFactor },
      verifyPasswordReset: { enable: true, path: 'verify-password-reset', ...routesOptions.verifyPasswordReset },
      verifyUnlock: { enable: true, path: 'verify-unlock', ...routesOptions.verifyUnlock }
    }

    CURRENT_AUTHENTICATION.options = { rootPath: 'authentication', ...options, routes: finalRoutesOptions }
    CURRENT_AUTHENTICATION.instance = new Authentication(CURRENT_AUTHENTICATION.options, authenticatableClass)

    await CURRENT_AUTHENTICATION.instance.loadDynamics()

    return CURRENT_AUTHENTICATION
  } else {
    throw new Error('Authentication already initialized')
  }
}
