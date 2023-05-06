import { AuthDynamic } from '@universal-packages/authentication'
import { AuthDynamicNames, RenderAuthenticationResponsePayload } from '../types'

@AuthDynamic<AuthDynamicNames>('render-authentication-response', true)
export default class RenderAuthenticationResponseDynamic {
  public perform(payload: RenderAuthenticationResponsePayload): Record<string, any> {
    const { authenticatable, sessionToken } = payload
    const authenticatableKeys = Object.keys(authenticatable)
    const providerKeys = {}

    for (let i = 0; i < authenticatableKeys.length; i++) {
      const currentKey = authenticatableKeys[i]

      if (/.*Id$/.exec(currentKey)) {
        providerKeys[currentKey] = authenticatable[currentKey]
      }
    }

    return {
      authenticatable: {
        id: authenticatable.id,
        ...providerKeys,
        profilePictureUrl: authenticatable.profilePictureUrl,
        email: authenticatable.unconfirmedEmail || authenticatable.email,
        emailConfirmed: !!authenticatable.emailConfirmedAt,
        unconfirmedEmail: authenticatable.unconfirmedEmail,
        phone: authenticatable.unconfirmedPhone || authenticatable.phone,
        phoneConfirmed: !!authenticatable.phoneConfirmedAt,
        unconfirmedPhone: authenticatable.unconfirmedPhone,
        username: authenticatable.username,
        firstName: authenticatable.firstName,
        lastName: authenticatable.lastName,
        name: authenticatable.name,
        memberSince: authenticatable.createdAt
      },
      sessionToken
    }
  }
}
