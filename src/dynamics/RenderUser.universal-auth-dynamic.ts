import { AuthDynamic, UserPayload } from '@universal-packages/authentication'

import { ExpressControllersAuthDynamicNames } from '../types'

@AuthDynamic<ExpressControllersAuthDynamicNames>('render-user', true)
export default class RenderUserDynamic {
  public perform(payload: UserPayload): Record<string, any> {
    const { user } = payload

    return {
      id: user.id,
      email: user.email
    }
  }
}
