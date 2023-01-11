import { ConnectProviderPayload, ContinueWithProviderPayload, LogInPayload } from '@universal-packages/authentication'
import { BaseController } from '@universal-packages/express-controllers'
import { RegisterAction, RegisterController } from '../decorators'
import { CURRENT_AUTHENTICATION } from '../express-controllers-authentication'

@RegisterController()
export default class AuthenticationController extends BaseController {
  @RegisterAction('PATCH', 'connectProvider')
  public async connectProvider(): Promise<any> {
    const authenticatable = await CURRENT_AUTHENTICATION.instance.performDynamic('authenticatable-from-request', { request: this.request })

    if (authenticatable) {
      try {
        const parameters = this.request.parameters.shape<ConnectProviderPayload>('provider', 'token')

        try {
          const result = await CURRENT_AUTHENTICATION.instance.performDynamic('connect-provider', { authenticatable, ...parameters })

          switch (result.status) {
            case 'failure':
              this.status('BAD_REQUEST').json({ message: result.message })
              break
            case 'warning':
              this.status('ACCEPTED').json({ message: result.message })
              break
            case 'success':
              const rendered = CURRENT_AUTHENTICATION.instance.performDynamicSync('render-authentication-response', { authenticatable: result.authenticatable })

              this.json(rendered)
              break
          }
        } catch (error) {
          this.status('BAD_REQUEST').json({ provider: 'unknown' })
        }
      } catch (error) {
        this.status('BAD_REQUEST').json({ parameters: error.message })
      }
    } else {
      this.status('UNAUTHORIZED')
    }
  }

  @RegisterAction('PATCH', 'continueWithProvider')
  public async continueWithProvider(): Promise<any> {
    try {
      const parameters = this.request.parameters.shape<ContinueWithProviderPayload>('provider', 'token')

      try {
        const result = await CURRENT_AUTHENTICATION.instance.performDynamic('continue-with-provider', parameters)

        switch (result.status) {
          case 'failure':
            this.status('BAD_REQUEST').json({ message: result.message })
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
        this.status('BAD_REQUEST').json({ provider: 'unknown' })
      }
    } catch (error) {
      this.status('BAD_REQUEST').json({ parameters: error.message })
    }
  }

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
