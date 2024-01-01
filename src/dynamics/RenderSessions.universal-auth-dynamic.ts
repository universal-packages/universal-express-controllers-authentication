import { AuthDynamic, Authentication } from '@universal-packages/authentication'

import { AuthDynamicNames, RenderSessionsPayload } from '../types'

@AuthDynamic<AuthDynamicNames>('render-sessions', true)
export default class RenderSessionsDynamic {
  public perform(_payload: RenderSessionsPayload, authentication: Authentication<AuthDynamicNames>): Record<string, any> {
    authentication.emit('warning', { message: 'not implemented', payload: { dynamic: this.constructor.name } })

    return {}
  }
}
