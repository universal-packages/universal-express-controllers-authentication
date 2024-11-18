import { BaseController } from '@universal-packages/express-controllers'

import { RegisterAuthenticationAction, RegisterMainAuthenticationController } from '../decorators'
import { CURRENT_AUTHENTICATION } from '../initialize'

@RegisterMainAuthenticationController()
export default class AuthenticationController extends BaseController {
  @RegisterAuthenticationAction('DELETE', 'log-out')
  public async logOut(): Promise<any> {
    const user = await CURRENT_AUTHENTICATION.instance.performDynamic('user-from-request', { request: this.request })

    if (user) {
      await CURRENT_AUTHENTICATION.instance.performDynamic('unset-session', { request: this.request, user, sessionId: this.request.query.sessionId as string })
    } else {
      this.status('UNAUTHORIZED')
    }
  }

  @RegisterAuthenticationAction('GET', 'me')
  public async me(): Promise<any> {
    const user = await CURRENT_AUTHENTICATION.instance.performDynamic('user-from-request', { request: this.request })

    if (user) {
      const rendered = await CURRENT_AUTHENTICATION.instance.performDynamic('render-user', { user })

      this.json({ status: 'success', user: rendered })
    } else {
      this.status('UNAUTHORIZED')
    }
  }

  @RegisterAuthenticationAction('GET', 'sessions')
  public async sessions(): Promise<any> {
    const user = await CURRENT_AUTHENTICATION.instance.performDynamic('user-from-request', { request: this.request })

    if (user) {
      const rendered = await CURRENT_AUTHENTICATION.instance.performDynamic('render-sessions', { user, request: this.request })

      this.json({ status: 'success', sessions: rendered })
    } else {
      this.status('UNAUTHORIZED')
    }
  }

  @RegisterAuthenticationAction('PATCH', 'update-device-id')
  public async updateDeviceId(): Promise<any> {
    const user = await CURRENT_AUTHENTICATION.instance.performDynamic('user-from-request', { request: this.request })

    if (user) {
      let parameters: { deviceId: string }

      try {
        parameters = this.request.parameters.shape<{ deviceId: string }>('deviceId')
      } catch (error) {
        return this.status('BAD_REQUEST').json({ status: 'failure', message: error.message })
      }

      await CURRENT_AUTHENTICATION.instance.performDynamic('set-session-device-id', { user, request: this.request, deviceId: parameters.deviceId })

      this.json({ status: 'success' })
    } else {
      this.status('UNAUTHORIZED')
    }
  }
}
