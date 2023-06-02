import { AuthDynamic, Authentication } from '@universal-packages/authentication'

import { AuthDynamicNames, SetSessionPayload } from '../types'

@AuthDynamic<AuthDynamicNames>('set-session', true)
export default class SetSessionDynamic {
  public async perform(_payload: SetSessionPayload, authentication: Authentication<AuthDynamicNames>): Promise<string> {
    authentication.emit('warning', { dynamic: this.constructor.name, message: 'not implemented' })

    return ''
  }
}
