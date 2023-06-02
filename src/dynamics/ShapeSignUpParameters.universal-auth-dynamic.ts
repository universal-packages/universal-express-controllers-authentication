import { AuthDynamic, SignUpPayload } from '@universal-packages/authentication'

import { AuthDynamicNames, ShapeSignUpParametersPayload } from '../types'

@AuthDynamic<AuthDynamicNames>('shape-sign-up-parameters', true)
export default class ShapeSignUpParametersDynamic {
  public perform(payload: ShapeSignUpParametersPayload): SignUpPayload {
    const { parameters } = payload

    return parameters.shape({
      attributes: [
        {
          email: { optional: true },
          username: { optional: true },
          phone: { optional: true },
          password: { optional: true },
          firstName: { optional: true },
          lastName: { optional: true }
        }
      ],
      credentialKind: { enum: new Set(['email', 'phone']) },
      corroborationToken: { optional: true },
      invitationToken: { optional: true }
    })
  }
}
