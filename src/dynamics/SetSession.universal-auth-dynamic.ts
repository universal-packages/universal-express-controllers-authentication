import { AuthDynamic, Authentication } from '@universal-packages/authentication'

import { AuthDynamicNames, SetSessionPayload } from '../types'

@AuthDynamic<AuthDynamicNames>('set-session', true)
export default class SetSessionDynamic {
  public async perform(_payload: SetSessionPayload, authentication: Authentication<AuthDynamicNames>): Promise<string> {
    authentication.emit('warning', { message: 'not implemented', payload: { dynamic: this.constructor.name } })

    return ''
  }
}
