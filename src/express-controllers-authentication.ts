import { AuthenticatableClass, Authentication } from '@universal-packages/authentication'
import '@universal-packages/express-controllers-parameters'
import { AuthenticationRoutes, CurrentAuthentication, ExpressControllerAuthenticationOptions } from './types'

export const CURRENT_AUTHENTICATION: CurrentAuthentication = { instance: null, options: null }

export async function initialize(options: ExpressControllerAuthenticationOptions, authenticatableClass?: AuthenticatableClass): Promise<CurrentAuthentication> {
  if (!CURRENT_AUTHENTICATION.instance) {
    const routesOptions = { ...options.routes }
    const finalRoutesOptions: AuthenticationRoutes = {
      connectProvider: { enable: true, path: 'connect-provider', ...routesOptions.connectProvider },
      logIn: { enable: true, path: 'log-in', ...routesOptions.logIn },
      signUp: { enable: true, path: 'sign-up', ...routesOptions.signUp },
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
