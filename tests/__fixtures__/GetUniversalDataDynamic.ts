import { Authentication, GetProviderUserDataPayload, ProviderDataResult } from '@universal-packages/authentication'

export default class GetUniversalUserDataDynamic {
  static __api: typeof Authentication
  static __name = 'get-universal-user-data'
  static __defaultDynamic = true
  static __lifeCycle = null

  public async perform(payload: GetProviderUserDataPayload): Promise<ProviderDataResult> {
    const { token } = payload

    switch (token) {
      case 'error':
        return {
          error: new Error('Invalid token')
        }
      case 'exists':
        return {
          attributes: {
            id: 'any.universal-connected',
            username: 'david-universal',
            email: 'user@universal.com',
            firstName: 'david',
            lastName: 'de anda',
            name: 'david de anda',
            profilePictureUrl: 'https://images.com/david'
          }
        }
      case 'exists-confirmation-pending':
        return {
          attributes: {
            id: 'any.universal-connected-confirmation-pending',
            username: 'david-universal',
            email: 'user@universal.com',
            firstName: 'david',
            lastName: 'de anda',
            name: 'david de anda',
            profilePictureUrl: 'https://images.com/david'
          }
        }
      case 'exists-independent-email':
        return {
          attributes: {
            id: 'any',
            username: 'david-universal',
            email: 'user@universal.com',
            firstName: 'david',
            lastName: 'de anda',
            name: 'david de anda',
            profilePictureUrl: 'https://images.com/david'
          }
        }
      default:
        return {
          attributes: {
            id: 'any.nothing',
            username: 'david-universal',
            email: 'user@universal.com',
            firstName: 'david',
            lastName: 'de anda',
            name: 'david de anda',
            profilePictureUrl: 'https://images.com/david'
          }
        }
    }
  }
}
