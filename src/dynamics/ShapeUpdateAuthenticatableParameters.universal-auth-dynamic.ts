import { AuthDynamic, UpdateAuthenticatablePayload } from '@universal-packages/authentication'

import { AuthDynamicNames, ShapeUpdateAuthenticatableParametersPayload } from '../types'

@AuthDynamic<AuthDynamicNames>('shape-update-authenticatable-parameters', true)
export default class ShapeUpdateAuthenticatableParametersDynamic {
  public perform(payload: ShapeUpdateAuthenticatableParametersPayload): UpdateAuthenticatablePayload {
    const { parameters } = payload

    return parameters.shape({
      attributes: [
        {
          username: { optional: true },
          password: { optional: true },
          firstName: { optional: true },
          lastName: { optional: true },
          profilePictureUrl: { optional: true },
          multiFactorEnabled: { optional: true }
        }
      ]
    })
  }
}
