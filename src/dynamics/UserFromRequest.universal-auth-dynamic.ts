import { AuthDynamic } from '@universal-packages/authentication'

import { ExpressControllersAuthDynamicNames, UserFromRequestPayload } from '../types'

@AuthDynamic<ExpressControllersAuthDynamicNames>('user-from-request', true)
export default class UserFromRequestDynamic {
  public async perform(payload: UserFromRequestPayload): Promise<Record<string, any>> {
    const { request } = payload

    return request['user']
  }
}
