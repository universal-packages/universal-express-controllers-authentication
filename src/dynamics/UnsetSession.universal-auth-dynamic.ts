import { AuthDynamic, Authentication } from '@universal-packages/authentication'

import { AuthDynamicNames, UnsetSessionPayload } from '../types'

@AuthDynamic<AuthDynamicNames>('unset-session', true)
export default class UnsetSessionDynamic {
  public async perform(_payload: UnsetSessionPayload, authentication: Authentication<AuthDynamicNames>): Promise<void> {
    authentication.emit('warning', { dynamic: this.constructor.name, message: 'not implemented' })
  }
}
