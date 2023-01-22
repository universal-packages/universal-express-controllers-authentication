import {
  ConnectProviderPayload,
  ContinueWithProviderPayload,
  InviteAuthenticatablePayload,
  LogInPayload,
  RequestConfirmationPayload,
  RequestCorroborationPayload,
  RequestMultiFactorPayload,
  RequestPasswordResetPayload,
  UpdateCredentialPayload,
  VerifyConfirmationPayload,
  VerifyCorroborationPayload,
  VerifyMultiFactorPayload
} from '@universal-packages/authentication'
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

  @RegisterAction('POST', 'continueWithProvider')
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

  @RegisterAction('PUT', 'invite')
  public async invite(): Promise<any> {
    const authenticatable = await CURRENT_AUTHENTICATION.instance.performDynamic('authenticatable-from-request', { request: this.request })

    if (authenticatable) {
      try {
        const parameters = this.request.parameters.shape<InviteAuthenticatablePayload>('credential', { credentialKind: { enum: new Set(['email', 'phone']) } })
        const result = await CURRENT_AUTHENTICATION.instance.performDynamic('invite-authenticatable', { inviterId: authenticatable.id, ...parameters })

        switch (result.status) {
          case 'failure':
            this.status('BAD_REQUEST').json({ message: result.message })
            break
        }
      } catch (error) {
        this.status('BAD_REQUEST').json({ parameters: error.message })
      }
    } else {
      this.status('UNAUTHORIZED')
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

  @RegisterAction('PUT', 'requestConfirmation')
  public async requestConfirmation(): Promise<any> {
    const authenticatable = await CURRENT_AUTHENTICATION.instance.performDynamic('authenticatable-from-request', { request: this.request })

    try {
      const parameters = this.request.parameters.shape<RequestConfirmationPayload>({ credential: { optional: true }, credentialKind: { enum: new Set(['email', 'phone']) } })
      const result = await CURRENT_AUTHENTICATION.instance.performDynamic('request-confirmation', { authenticatable, ...parameters })

      switch (result.status) {
        case 'failure':
          this.status('BAD_REQUEST').json({ message: result.message })
          break
        case 'warning':
          this.status('ACCEPTED').json({ message: result.message })
          break
      }
    } catch (error) {
      this.status('BAD_REQUEST').json({ parameters: error.message })
    }
  }

  @RegisterAction('PUT', 'requestCorroboration')
  public async requestCorroboration(): Promise<any> {
    try {
      const parameters = this.request.parameters.shape<RequestCorroborationPayload>('credential', { credentialKind: { enum: new Set(['email', 'phone']) } })
      const result = await CURRENT_AUTHENTICATION.instance.performDynamic('request-corroboration', parameters)

      switch (result.status) {
        case 'failure':
          this.status('BAD_REQUEST').json({ message: result.message })
          break
      }
    } catch (error) {
      this.status('BAD_REQUEST').json({ parameters: error.message })
    }
  }

  @RegisterAction('PUT', 'requestMultiFactor')
  public async requestMultiFactor(): Promise<any> {
    try {
      const parameters = this.request.parameters.shape<RequestMultiFactorPayload>('identifier', { credentialKind: { enum: new Set(['email', 'phone']) } })
      const result = await CURRENT_AUTHENTICATION.instance.performDynamic('request-multi-factor', parameters)

      switch (result.status) {
        case 'failure':
          this.status('BAD_REQUEST').json({ message: result.message })
          break
        case 'warning':
          this.status('ACCEPTED').json({ message: result.message })
          break
      }
    } catch (error) {
      this.status('BAD_REQUEST').json({ parameters: error.message })
    }
  }

  @RegisterAction('PUT', 'requestPasswordReset')
  public async requestPasswordReset(): Promise<any> {
    try {
      const parameters = this.request.parameters.shape<RequestPasswordResetPayload>('credential', { credentialKind: { enum: new Set(['email', 'phone']) } })
      const result = await CURRENT_AUTHENTICATION.instance.performDynamic('request-password-reset', parameters)

      switch (result.status) {
        case 'warning':
          this.status('ACCEPTED').json({ message: result.message })
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

  @RegisterAction('PATCH', 'updateAuthenticatable')
  public async updateAuthenticatable(): Promise<any> {
    const authenticatable = await CURRENT_AUTHENTICATION.instance.performDynamic('authenticatable-from-request', { request: this.request })

    if (authenticatable) {
      try {
        const parameters = CURRENT_AUTHENTICATION.instance.performDynamicSync('shape-update-authenticatable-parameters', { parameters: this.request.parameters })
        const result = await CURRENT_AUTHENTICATION.instance.performDynamic('update-authenticatable', { authenticatable, ...parameters })

        switch (result.status) {
          case 'failure':
            this.status('BAD_REQUEST').json({ validation: result.validation })
            break
          case 'success':
            const rendered = CURRENT_AUTHENTICATION.instance.performDynamicSync('render-authentication-response', { authenticatable: result.authenticatable })

            this.json(rendered)
            break
        }
      } catch (error) {
        this.status('BAD_REQUEST').json({ parameters: error.message })
      }
    } else {
      this.status('UNAUTHORIZED')
    }
  }

  @RegisterAction('PATCH', 'updateCredential')
  public async updateCredential(): Promise<any> {
    const authenticatable = await CURRENT_AUTHENTICATION.instance.performDynamic('authenticatable-from-request', { request: this.request })

    if (authenticatable) {
      try {
        const parameters = this.request.parameters.shape<UpdateCredentialPayload>('credential', {
          credentialKind: { enum: new Set(['email', 'phone']) },
          corroborationToken: { optional: true }
        })
        const result = await CURRENT_AUTHENTICATION.instance.performDynamic('update-credential', { authenticatable, ...parameters })

        switch (result.status) {
          case 'failure':
            this.status('BAD_REQUEST').json({ message: result.message, validation: result.validation })
            break
          case 'success':
            const rendered = CURRENT_AUTHENTICATION.instance.performDynamicSync('render-authentication-response', { authenticatable: result.authenticatable })

            this.json(rendered)
            break
        }
      } catch (error) {
        this.status('BAD_REQUEST').json({ parameters: error.message })
      }
    } else {
      this.status('UNAUTHORIZED')
    }
  }

  @RegisterAction('PUT', 'verifyConfirmation')
  public async verifyConfirmation(): Promise<any> {
    try {
      const parameters = this.request.parameters.shape<VerifyConfirmationPayload>('credential', { credentialKind: { enum: new Set(['email', 'phone']) } }, 'oneTimePassword')
      const result = await CURRENT_AUTHENTICATION.instance.performDynamic('verify-confirmation', parameters)

      switch (result.status) {
        case 'failure':
          this.status('BAD_REQUEST').json({ message: result.message })
          break
      }
    } catch (error) {
      this.status('BAD_REQUEST').json({ parameters: error.message })
    }
  }

  @RegisterAction('PUT', 'verifyCorroboration')
  public async verifyCorroboration(): Promise<any> {
    try {
      const parameters = this.request.parameters.shape<VerifyCorroborationPayload>('credential', { credentialKind: { enum: new Set(['email', 'phone']) } }, 'oneTimePassword')
      const result = await CURRENT_AUTHENTICATION.instance.performDynamic('verify-corroboration', parameters)

      switch (result.status) {
        case 'failure':
          this.status('BAD_REQUEST').json({ message: result.message })
          break
      }
    } catch (error) {
      this.status('BAD_REQUEST').json({ parameters: error.message })
    }
  }

  @RegisterAction('PUT', 'verifyMultiFactor')
  public async verifyMultiFactor(): Promise<any> {
    try {
      const parameters = this.request.parameters.shape<VerifyMultiFactorPayload>('identifier', 'oneTimePassword')
      const result = await CURRENT_AUTHENTICATION.instance.performDynamic('verify-multi-factor', parameters)

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
      this.status('BAD_REQUEST').json({ parameters: error.message })
    }
  }
}
