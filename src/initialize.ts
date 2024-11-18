import { Authentication } from '@universal-packages/authentication'
import '@universal-packages/express-controllers-parameters'

import { CurrentAuthentication, ExpressControllerAuthenticationOptions } from './types'

export const CURRENT_AUTHENTICATION: CurrentAuthentication = { instance: null, options: null }

export async function initialize(options: ExpressControllerAuthenticationOptions): Promise<CurrentAuthentication> {
  if (!CURRENT_AUTHENTICATION.instance) {
    CURRENT_AUTHENTICATION.options = { rootPath: 'authentication', ...options }
    CURRENT_AUTHENTICATION.instance = new Authentication(CURRENT_AUTHENTICATION.options)

    await CURRENT_AUTHENTICATION.instance.loadDynamics()

    return CURRENT_AUTHENTICATION
  } else {
    throw new Error('Authentication already initialized')
  }
}
