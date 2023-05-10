import { AuthDynamic, Authentication } from '@universal-packages/authentication'
import { AuthDynamicNames, RenderSessionsResponsePayload } from '../types'

@AuthDynamic<AuthDynamicNames>('render-sessions-response', true)
export default class RenderSessionsResponseDynamic {
  public perform(_payload: RenderSessionsResponsePayload, authentication: Authentication<AuthDynamicNames>): Record<string, any> {
    authentication.emit('warning', { dynamic: this.constructor.name, message: 'not implemented' })

    return {}
  }
}
