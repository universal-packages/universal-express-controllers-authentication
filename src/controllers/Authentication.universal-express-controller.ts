import { BaseController } from '@universal-packages/express-controllers'

import { RegisterAuthenticationAction, RegisterMainAuthenticationController } from '../decorators'
import { CURRENT_AUTHENTICATION } from '../initialize'

@RegisterMainAuthenticationController()
export default class AuthenticationController extends BaseController {
  @RegisterAuthenticationAction('DELETE', 'log-out')
  public async logOut(): Promise<any> {
    const authenticatable = await CURRENT_AUTHENTICATION.instance.performDynamic('authenticatable-from-request', { request: this.request })

    if (authenticatable) {
      await CURRENT_AUTHENTICATION.instance.performDynamic('unset-session', { request: this.request, authenticatable, sessionId: this.request.query.sessionId as string })
    } else {
      this.status('UNAUTHORIZED')
    }
  }

  @RegisterAuthenticationAction('GET', 'me')
  public async me(): Promise<any> {
    const authenticatable = await CURRENT_AUTHENTICATION.instance.performDynamic('authenticatable-from-request', { request: this.request })

    if (authenticatable) {
      const rendered = await CURRENT_AUTHENTICATION.instance.performDynamic('render-authenticatable', { authenticatable: authenticatable })

      this.json({ status: 'success', authenticatable: rendered })
    } else {
      this.status('UNAUTHORIZED')
    }
  }

  @RegisterAuthenticationAction('GET', 'sessions')
  public async session(): Promise<any> {
    const authenticatable = await CURRENT_AUTHENTICATION.instance.performDynamic('authenticatable-from-request', { request: this.request })

    if (authenticatable) {
      const rendered = await CURRENT_AUTHENTICATION.instance.performDynamic('render-sessions', { authenticatable: authenticatable, request: this.request })

      this.json({ status: 'success', sessions: rendered })
    } else {
      this.status('UNAUTHORIZED')
    }
  }

  @RegisterAuthenticationAction('PATCH', 'update-device-id')
  public async updateDeviceId(): Promise<any> {
    const authenticatable = await CURRENT_AUTHENTICATION.instance.performDynamic('authenticatable-from-request', { request: this.request })

    if (authenticatable) {
      let parameters: { deviceId: string }

      try {
        parameters = this.request.parameters.shape<{ deviceId: string }>('deviceId')
      } catch (error) {
        return this.status('BAD_REQUEST').json({ status: 'failure', message: error.message })
      }

      await CURRENT_AUTHENTICATION.instance.performDynamic('set-session-device-id', { authenticatable, request: this.request, deviceId: parameters.deviceId })

      this.json({ status: 'success' })
    } else {
      this.status('UNAUTHORIZED')
    }
  }
}
