import { AuthDynamic } from '@universal-packages/authentication'

import { AuthDynamicNames, RenderAuthenticatablePayload } from '../types'

@AuthDynamic<AuthDynamicNames>('render-authenticatable', true)
export default class RenderAuthenticatableDynamic {
  public perform(payload: RenderAuthenticatablePayload): Record<string, any> {
    const { authenticatable } = payload

    return {
      id: authenticatable.id,
      email: authenticatable['email']
    }
  }
}
