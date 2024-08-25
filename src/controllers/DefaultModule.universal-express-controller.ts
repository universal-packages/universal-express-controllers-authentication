import { EmailPasswordOneTimePasswordPayload, EmailPasswordPayload, EmailPayload, UpdateEmailPasswordPayload } from '@universal-packages/authentication'
import { BaseController } from '@universal-packages/express-controllers'

import { RegisterAuthenticationController, RegisterAuthenticationModuleAction } from '../decorators'
import { CURRENT_AUTHENTICATION } from '../initialize'

@RegisterAuthenticationController('default')
export default class DefaultModuleController extends BaseController {
  @RegisterAuthenticationModuleAction('default', 'POST', 'log-in')
  public async logIn(): Promise<any> {
    let parameters: EmailPasswordPayload

    try {
      parameters = this.request.parameters.shape<EmailPasswordPayload>('email', 'password')
    } catch (error) {
      return this.status('BAD_REQUEST').json({ status: 'failure', message: error.message })
    }

    const result = await CURRENT_AUTHENTICATION.instance.performDynamic('log-in', parameters)

    switch (result.status) {
      case 'failure':
        this.status('BAD_REQUEST').json(result)
        break
      case 'success':
        const sessionToken = await CURRENT_AUTHENTICATION.instance.performDynamic('set-session', {
          request: this.request,
          response: this.response,
          authenticatable: result.authenticatable
        })

        const rendered = await CURRENT_AUTHENTICATION.instance.performDynamic('render-authenticatable', { authenticatable: result.authenticatable })

        this.json({ status: 'success', authenticatable: rendered, sessionToken })
        break
    }
  }

  @RegisterAuthenticationModuleAction('default', 'PUT', 'request-password-reset')
  public async requestPasswordReset(): Promise<any> {
    let parameters: EmailPayload

    try {
      parameters = this.request.parameters.shape<EmailPayload>('email')
    } catch (error) {
      return this.status('BAD_REQUEST').json({ status: 'failure', message: error.message })
    }

    const result = await CURRENT_AUTHENTICATION.instance.performDynamic('request-password-reset', parameters)

    switch (result.status) {
      case 'warning':
        this.status('ACCEPTED').json(result)
        break
      case 'success':
        this.json(result)
    }
  }

  @RegisterAuthenticationModuleAction('default', 'POST', 'sign-up')
  public async signUp(): Promise<any> {
    let parameters: EmailPasswordPayload

    try {
      parameters = this.request.parameters.shape<EmailPasswordPayload>('email', 'password')
    } catch (error) {
      return this.status('BAD_REQUEST').json({ status: 'failure', message: error.message })
    }

    const result = await CURRENT_AUTHENTICATION.instance.performDynamic('sign-up', parameters)

    switch (result.status) {
      case 'failure':
        this.status('BAD_REQUEST').json(result)
        break
      case 'success':
        const sessionToken = await CURRENT_AUTHENTICATION.instance.performDynamic('set-session', {
          request: this.request,
          response: this.response,
          authenticatable: result.authenticatable
        })

        const rendered = await CURRENT_AUTHENTICATION.instance.performDynamic('render-authenticatable', { authenticatable: result.authenticatable })

        this.json({ status: 'success', authenticatable: rendered, sessionToken })
        break
    }
  }

  @RegisterAuthenticationModuleAction('default', 'PATCH', 'update-email-password')
  public async updateEmailPassword(): Promise<any> {
    const authenticatable = await CURRENT_AUTHENTICATION.instance.performDynamic('authenticatable-from-request', { request: this.request })

    if (authenticatable) {
      let parameters: UpdateEmailPasswordPayload

      try {
        parameters = this.request.parameters.shape<UpdateEmailPasswordPayload>({ email: { optional: true }, password: { optional: true } })
      } catch (error) {
        return this.status('BAD_REQUEST').json({ status: 'failure', message: error.message })
      }

      const result = await CURRENT_AUTHENTICATION.instance.performDynamic('update-email-password', { authenticatable, ...parameters })

      switch (result.status) {
        case 'failure':
          this.status('BAD_REQUEST').json(result)
          break
        case 'success':
          const rendered = await CURRENT_AUTHENTICATION.instance.performDynamic('render-authenticatable', { authenticatable: result.authenticatable })

          this.json({ status: 'success', authenticatable: rendered })
          break
      }
    } else {
      this.status('UNAUTHORIZED')
    }
  }

  @RegisterAuthenticationModuleAction('default', 'PUT', 'verify-password-reset')
  public async verifyPasswordReset(): Promise<any> {
    let parameters: EmailPasswordOneTimePasswordPayload

    try {
      parameters = this.request.parameters.shape<EmailPasswordOneTimePasswordPayload>('email', 'oneTimePassword', 'password')
    } catch (error) {
      return this.status('BAD_REQUEST').json({ status: 'failure', message: error.message })
    }

    const result = await CURRENT_AUTHENTICATION.instance.performDynamic('verify-password-reset', parameters)

    switch (result.status) {
      case 'failure':
        this.status('BAD_REQUEST').json(result)
        break
      case 'success':
        this.json(result)
    }
  }
}