import { AuthDynamic, Authentication } from '@universal-packages/authentication'

import { ExpressControllersAuthDynamicNames, SetSessionDeviceIdPayload } from '../types'

@AuthDynamic<ExpressControllersAuthDynamicNames>('set-session-device-id', true)
export default class SetSessionDeviceIdDynamic {
  public async perform(_payload: SetSessionDeviceIdPayload, authentication: Authentication<ExpressControllersAuthDynamicNames>): Promise<void> {
    authentication.emit('warning', { message: 'not implemented', payload: { dynamic: this.constructor.name } })
  }
}
