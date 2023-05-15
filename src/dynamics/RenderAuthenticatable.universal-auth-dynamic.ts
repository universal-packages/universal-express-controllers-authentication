import { AuthDynamic } from '@universal-packages/authentication'
import { AuthDynamicNames, RenderAuthenticatablePayload } from '../types'

@AuthDynamic<AuthDynamicNames>('render-authenticatable', true)
export default class RenderAuthenticatableDynamic {
  public perform(payload: RenderAuthenticatablePayload): Record<string, any> {
    const { authenticatable } = payload
    const authenticatableKeys = Object.keys(authenticatable)
    const providerKeys = {}

    for (let i = 0; i < authenticatableKeys.length; i++) {
      const currentKey = authenticatableKeys[i]

      if (/.*Id$/.exec(currentKey)) {
        providerKeys[currentKey] = authenticatable[currentKey]
      }
    }

    return {
      id: authenticatable.id,
      ...providerKeys,
      profilePictureUrl: authenticatable.profilePictureUrl,
      email: authenticatable.email,
      emailConfirmed: !!authenticatable.emailConfirmedAt,
      unconfirmedEmail: authenticatable.unconfirmedEmail,
      phone: authenticatable.phone,
      phoneConfirmed: !!authenticatable.phoneConfirmedAt,
      unconfirmedPhone: authenticatable.unconfirmedPhone,
      username: authenticatable.username,
      firstName: authenticatable.firstName,
      lastName: authenticatable.lastName,
      name: authenticatable.name,
      memberSince: authenticatable.createdAt
    }
  }
}
