import { LogInPayload } from '@universal-packages/authentication'
import { BaseController } from '@universal-packages/express-controllers'
import '@universal-packages/express-controllers-parameters'
import { RegisterAction, RegisterController } from '../decorators'
import { CURRENT_AUTHENTICATION } from '../express-controllers-authentication'

@RegisterController()
export default class AuthenticationController extends BaseController {
  private parameters

  @RegisterAction('POST', 'logIn')
  public async logIn(): Promise<void> {
    const parameters = this.shapeParameters()

    if (parameters) {
      const result = await CURRENT_AUTHENTICATION.instance.performDynamic('log-in', parameters)

      switch (result.status) {
        case 'failure':
          this.status('BAD_REQUEST')
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
    }
  }

  private shapeParameters(): LogInPayload {
    try {
      return this.request.parameters.shape('credential', 'password')
    } catch {
      this.status('BAD_REQUEST')
    }
  }
}
