import { AuthDynamic, Authentication } from '@universal-packages/authentication'

import { ExpressControllersAuthDynamicNames, UnsetSessionPayload } from '../types'

@AuthDynamic<ExpressControllersAuthDynamicNames>('unset-session', true)
export default class UnsetSessionDynamic {
  public async perform(_payload: UnsetSessionPayload, authentication: Authentication<ExpressControllersAuthDynamicNames>): Promise<void> {
    authentication.emit('warning', { message: 'not implemented', payload: { dynamic: this.constructor.name } })
  }
}
