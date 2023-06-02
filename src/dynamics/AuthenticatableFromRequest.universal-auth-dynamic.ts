import { AuthDynamic } from '@universal-packages/authentication'

import { AuthDynamicNames, AuthenticatableFromRequestPayload } from '../types'

@AuthDynamic<AuthDynamicNames>('authenticatable-from-request', true)
export default class AuthenticatableFromRequestDynamic {
  public async perform(payload: AuthenticatableFromRequestPayload): Promise<Record<string, any>> {
    const { request } = payload

    return request['authenticatable']
  }
}
