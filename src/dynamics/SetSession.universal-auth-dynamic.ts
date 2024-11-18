import { AuthDynamic, Authentication } from '@universal-packages/authentication'

import { ExpressControllersAuthDynamicNames, SetSessionPayload } from '../types'

@AuthDynamic<ExpressControllersAuthDynamicNames>('set-session', true)
export default class SetSessionDynamic {
  public async perform(_payload: SetSessionPayload, authentication: Authentication<ExpressControllersAuthDynamicNames>): Promise<string> {
    authentication.emit('warning', { message: 'not implemented', payload: { dynamic: this.constructor.name } })

    return ''
  }
}
