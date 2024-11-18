import { AuthDynamic, Authentication } from '@universal-packages/authentication'

import { ExpressControllersAuthDynamicNames, RenderSessionsPayload } from '../types'

@AuthDynamic<ExpressControllersAuthDynamicNames>('render-sessions', true)
export default class RenderSessionsDynamic {
  public perform(_payload: RenderSessionsPayload, authentication: Authentication<ExpressControllersAuthDynamicNames>): Record<string, any> {
    authentication.emit('warning', { message: 'not implemented', payload: { dynamic: this.constructor.name } })

    return {}
  }
}
