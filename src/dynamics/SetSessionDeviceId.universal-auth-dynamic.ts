import { AuthDynamic, Authentication } from '@universal-packages/authentication'

import { AuthDynamicNames, SetSessionDeviceIdPayload } from '../types'

@AuthDynamic<AuthDynamicNames>('set-session-device-id', true)
export default class SetSessionDeviceIdDynamic {
  public async perform(_payload: SetSessionDeviceIdPayload, authentication: Authentication<AuthDynamicNames>): Promise<void> {
    authentication.emit('warning', { dynamic: this.constructor.name, message: 'not implemented' })
  }
}
