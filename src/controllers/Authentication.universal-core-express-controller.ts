import { LogInPayload } from '@universal-packages/authentication'
import { BaseController } from '@universal-packages/express-controllers'
import { RegisterAction, RegisterController } from '../decorators'
import { CURRENT_AUTHENTICATION } from '../express-controllers-authentication'

@RegisterController()
export default class AuthenticationController extends BaseController {
  @RegisterAction('POST', 'logIn')
  public async logIn(): Promise<any> {
    try {
      const parameters = this.request.parameters.shape<LogInPayload>('credential', 'password')

      const result = await CURRENT_AUTHENTICATION.instance.performDynamic('log-in', parameters)

      switch (result.status) {
        case 'failure':
          this.status('BAD_REQUEST').json({ message: result.message })
          break
        case 'warning':
          this.status('ACCEPTED').json({ message: result.message, metadata: result.metadata })
          break
        case 'success':
          const sessionToken = await CURRENT_AUTHENTICATION.instance.performDynamic('set-session', {
            request: this.request,
            response: this.response,
            authenticatable: result.authenticatable
          })

          const rendered = CURRENT_AUTHENTICATION.instance.performDynamicSync('render-authentication-response', {
            authenticatable: result.authenticatable,
            sessionToken
          })

          this.json(rendered)
          break
      }
    } catch (error) {
      this.status('BAD_REQUEST').json({ parameters: error.message })
    }
  }

  @RegisterAction('POST', 'signUp')
  public async signUp(): Promise<any> {
    try {
      const parameters = CURRENT_AUTHENTICATION.instance.performDynamicSync('shape-sign-up-parameters', { parameters: this.request.parameters })
      const result = await CURRENT_AUTHENTICATION.instance.performDynamic('sign-up', parameters)

      switch (result.status) {
        case 'failure':
          this.status('BAD_REQUEST').json({ message: result.message, validation: result.validation })
          break
        case 'warning':
          this.status('ACCEPTED').json({ message: result.message, metadata: result.metadata })
          break
        case 'success':
          const sessionToken = await CURRENT_AUTHENTICATION.instance.performDynamic('set-session', {
            request: this.request,
            response: this.response,
            authenticatable: result.authenticatable
          })

          const rendered = CURRENT_AUTHENTICATION.instance.performDynamicSync('render-authentication-response', {
            authenticatable: result.authenticatable,
            sessionToken
          })

          this.json(rendered)
          break
      }
    } catch (error) {
      this.status('BAD_REQUEST').json({ parameters: error.message })
    }
  }
}
