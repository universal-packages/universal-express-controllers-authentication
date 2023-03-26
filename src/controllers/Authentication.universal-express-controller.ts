import {
  ConnectProviderPayload,
  ContinueWithProviderPayload,
  InviteAuthenticatablePayload,
  LogInPayload,
  RequestConfirmationPayload,
  RequestCorroborationPayload,
  RequestMultiFactorPayload,
  RequestPasswordResetPayload,
  SignUpPayload,
  UpdateAuthenticatablePayload,
  UpdateCredentialPayload,
  VerifyConfirmationPayload,
  VerifyCorroborationPayload,
  VerifyMultiFactorPayload,
  VerifyPasswordResetPayload,
  VerifyUnlockPayload
} from '@universal-packages/authentication'
import { BaseController } from '@universal-packages/express-controllers'
import { RegisterAction, RegisterController } from '../decorators'
import { CURRENT_AUTHENTICATION } from '../initialize'

@RegisterController()
export default class AuthenticationController extends BaseController {
  @RegisterAction('connectProvider')
  public async connectProvider(): Promise<any> {
    const authenticatable = await CURRENT_AUTHENTICATION.instance.performDynamic('authenticatable-from-request', { request: this.request })

    if (authenticatable) {
      let parameters: ConnectProviderPayload

      try {
        parameters = this.request.parameters.shape<ConnectProviderPayload>('provider', 'token')
      } catch (error) {
        return this.status('BAD_REQUEST').json({ parameters: error.message })
      }

      const result = await CURRENT_AUTHENTICATION.instance.performDynamic('connect-provider', { authenticatable, ...parameters })

      switch (result.status) {
        case 'failure':
          this.status('BAD_REQUEST').json(result)
          break
        case 'warning':
          this.status('ACCEPTED').json(result)
          break
        case 'success':
          const rendered = CURRENT_AUTHENTICATION.instance.performDynamicSync('render-authentication-response', { authenticatable: result.authenticatable })

          this.json(rendered)
          break
      }
    } else {
      this.status('UNAUTHORIZED')
    }
  }

  @RegisterAction('continueWithProvider')
  public async continueWithProvider(): Promise<any> {
    let parameters: ContinueWithProviderPayload

    try {
      parameters = this.request.parameters.shape<ContinueWithProviderPayload>('provider', 'token')
    } catch (error) {
      return this.status('BAD_REQUEST').json({ parameters: error.message })
    }

    const result = await CURRENT_AUTHENTICATION.instance.performDynamic('continue-with-provider', parameters)

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

        const rendered = CURRENT_AUTHENTICATION.instance.performDynamicSync('render-authentication-response', {
          authenticatable: result.authenticatable,
          sessionToken
        })

        this.json(rendered)
        break
    }
  }

  @RegisterAction('invite')
  public async invite(): Promise<any> {
    const authenticatable = await CURRENT_AUTHENTICATION.instance.performDynamic('authenticatable-from-request', { request: this.request })

    if (authenticatable) {
      let parameters: InviteAuthenticatablePayload

      try {
        parameters = this.request.parameters.shape<InviteAuthenticatablePayload>('credential', { credentialKind: { enum: new Set(['email', 'phone']) } })
      } catch (error) {
        return this.status('BAD_REQUEST').json({ parameters: error.message })
      }

      const result = await CURRENT_AUTHENTICATION.instance.performDynamic('invite-authenticatable', { inviterId: authenticatable.id, ...parameters })

      switch (result.status) {
        case 'failure':
          this.status('BAD_REQUEST').json(result)
          break
      }
    } else {
      this.status('UNAUTHORIZED')
    }
  }

  @RegisterAction('logIn')
  public async logIn(): Promise<any> {
    let parameters: LogInPayload

    try {
      parameters = this.request.parameters.shape<LogInPayload>('credential', 'password')
    } catch (error) {
      return this.status('BAD_REQUEST').json({ parameters: error.message })
    }

    const result = await CURRENT_AUTHENTICATION.instance.performDynamic('log-in', parameters)

    switch (result.status) {
      case 'failure':
        this.status('BAD_REQUEST').json(result)
        break
      case 'warning':
        this.status('ACCEPTED').json(result)
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

  @RegisterAction('requestConfirmation')
  public async requestConfirmation(): Promise<any> {
    const authenticatable = await CURRENT_AUTHENTICATION.instance.performDynamic('authenticatable-from-request', { request: this.request })

    let parameters: RequestConfirmationPayload

    try {
      parameters = this.request.parameters.shape<RequestConfirmationPayload>({ credential: { optional: true }, credentialKind: { enum: new Set(['email', 'phone']) } })
    } catch (error) {
      return this.status('BAD_REQUEST').json({ parameters: error.message })
    }

    // Authenticatable us optional here because the user could be requesting from a session or not
    const result = await CURRENT_AUTHENTICATION.instance.performDynamic('request-confirmation', { authenticatable, ...parameters })

    switch (result.status) {
      case 'failure':
        this.status('BAD_REQUEST').json(result)
        break
      case 'warning':
        this.status('ACCEPTED').json(result)
        break
    }
  }

  @RegisterAction('requestCorroboration')
  public async requestCorroboration(): Promise<any> {
    let parameters: RequestCorroborationPayload

    try {
      parameters = this.request.parameters.shape<RequestCorroborationPayload>('credential', { credentialKind: { enum: new Set(['email', 'phone']) } })
    } catch (error) {
      return this.status('BAD_REQUEST').json({ parameters: error.message })
    }

    const result = await CURRENT_AUTHENTICATION.instance.performDynamic('request-corroboration', parameters)

    switch (result.status) {
      case 'failure':
        this.status('BAD_REQUEST').json(result)
        break
    }
  }

  @RegisterAction('requestMultiFactor')
  public async requestMultiFactor(): Promise<any> {
    let parameters: RequestMultiFactorPayload

    try {
      parameters = this.request.parameters.shape<RequestMultiFactorPayload>('identifier', { credentialKind: { enum: new Set(['email', 'phone']) } })
    } catch (error) {
      return this.status('BAD_REQUEST').json({ parameters: error.message })
    }

    const result = await CURRENT_AUTHENTICATION.instance.performDynamic('request-multi-factor', parameters)

    switch (result.status) {
      case 'failure':
        this.status('BAD_REQUEST').json(result)
        break
      case 'warning':
        this.status('ACCEPTED').json(result)
        break
    }
  }

  @RegisterAction('requestPasswordReset')
  public async requestPasswordReset(): Promise<any> {
    let parameters: RequestPasswordResetPayload

    try {
      parameters = this.request.parameters.shape<RequestPasswordResetPayload>('credential', { credentialKind: { enum: new Set(['email', 'phone']) } })
    } catch (error) {
      return this.status('BAD_REQUEST').json({ parameters: error.message })
    }

    const result = await CURRENT_AUTHENTICATION.instance.performDynamic('request-password-reset', parameters)

    switch (result.status) {
      case 'warning':
        this.status('ACCEPTED').json(result)
        break
    }
  }

  @RegisterAction('signUp')
  public async signUp(): Promise<any> {
    let parameters: SignUpPayload

    try {
      parameters = CURRENT_AUTHENTICATION.instance.performDynamicSync('shape-sign-up-parameters', { parameters: this.request.parameters })
    } catch (error) {
      return this.status('BAD_REQUEST').json({ parameters: error.message })
    }

    const result = await CURRENT_AUTHENTICATION.instance.performDynamic('sign-up', parameters)

    switch (result.status) {
      case 'failure':
        this.status('BAD_REQUEST').json(result)
        break
      case 'warning':
        this.status('ACCEPTED').json(result)
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

  @RegisterAction('updateAuthenticatable')
  public async updateAuthenticatable(): Promise<any> {
    const authenticatable = await CURRENT_AUTHENTICATION.instance.performDynamic('authenticatable-from-request', { request: this.request })

    if (authenticatable) {
      let parameters: UpdateAuthenticatablePayload

      try {
        parameters = CURRENT_AUTHENTICATION.instance.performDynamicSync('shape-update-authenticatable-parameters', { parameters: this.request.parameters })
      } catch (error) {
        return this.status('BAD_REQUEST').json({ parameters: error.message })
      }

      const result = await CURRENT_AUTHENTICATION.instance.performDynamic('update-authenticatable', { authenticatable, ...parameters })

      switch (result.status) {
        case 'failure':
          this.status('BAD_REQUEST').json(result)
          break
        case 'success':
          const rendered = CURRENT_AUTHENTICATION.instance.performDynamicSync('render-authentication-response', { authenticatable: result.authenticatable })

          this.json(rendered)
          break
      }
    } else {
      this.status('UNAUTHORIZED')
    }
  }

  @RegisterAction('updateCredential')
  public async updateCredential(): Promise<any> {
    const authenticatable = await CURRENT_AUTHENTICATION.instance.performDynamic('authenticatable-from-request', { request: this.request })

    if (authenticatable) {
      let parameters: UpdateCredentialPayload

      try {
        parameters = this.request.parameters.shape<UpdateCredentialPayload>('credential', {
          credentialKind: { enum: new Set(['email', 'phone']) },
          corroborationToken: { optional: true }
        })
      } catch (error) {
        return this.status('BAD_REQUEST').json({ parameters: error.message })
      }

      const result = await CURRENT_AUTHENTICATION.instance.performDynamic('update-credential', { authenticatable, ...parameters })

      switch (result.status) {
        case 'failure':
          this.status('BAD_REQUEST').json(result)
          break
        case 'success':
          const rendered = CURRENT_AUTHENTICATION.instance.performDynamicSync('render-authentication-response', { authenticatable: result.authenticatable })

          this.json(rendered)
          break
      }
    } else {
      this.status('UNAUTHORIZED')
    }
  }

  @RegisterAction('verifyConfirmation')
  public async verifyConfirmation(): Promise<any> {
    let parameters: VerifyConfirmationPayload

    try {
      parameters = this.request.parameters.shape<VerifyConfirmationPayload>('credential', { credentialKind: { enum: new Set(['email', 'phone']) } }, 'oneTimePassword')
    } catch (error) {
      return this.status('BAD_REQUEST').json({ parameters: error.message })
    }

    const result = await CURRENT_AUTHENTICATION.instance.performDynamic('verify-confirmation', parameters)

    switch (result.status) {
      case 'failure':
        this.status('BAD_REQUEST').json(result)
        break
    }
  }

  @RegisterAction('verifyCorroboration')
  public async verifyCorroboration(): Promise<any> {
    let parameters: VerifyCorroborationPayload

    try {
      parameters = this.request.parameters.shape<VerifyCorroborationPayload>('credential', { credentialKind: { enum: new Set(['email', 'phone']) } }, 'oneTimePassword')
    } catch (error) {
      return this.status('BAD_REQUEST').json({ parameters: error.message })
    }

    const result = await CURRENT_AUTHENTICATION.instance.performDynamic('verify-corroboration', parameters)

    switch (result.status) {
      case 'failure':
        this.status('BAD_REQUEST').json(result)
        break
    }
  }

  @RegisterAction('verifyMultiFactor')
  public async verifyMultiFactor(): Promise<any> {
    let parameters: VerifyMultiFactorPayload

    try {
      parameters = this.request.parameters.shape<VerifyMultiFactorPayload>('identifier', 'oneTimePassword')
    } catch (error) {
      return this.status('BAD_REQUEST').json({ parameters: error.message })
    }

    const result = await CURRENT_AUTHENTICATION.instance.performDynamic('verify-multi-factor', parameters)

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

        const rendered = CURRENT_AUTHENTICATION.instance.performDynamicSync('render-authentication-response', {
          authenticatable: result.authenticatable,
          sessionToken
        })

        this.json(rendered)
        break
    }
  }

  @RegisterAction('verifyPasswordReset')
  public async verifyPasswordReset(): Promise<any> {
    let parameters: VerifyPasswordResetPayload

    try {
      parameters = this.request.parameters.shape<VerifyPasswordResetPayload>('identifier', 'oneTimePassword', 'password')
    } catch (error) {
      return this.status('BAD_REQUEST').json({ parameters: error.message })
    }

    const result = await CURRENT_AUTHENTICATION.instance.performDynamic('verify-password-reset', parameters)

    switch (result.status) {
      case 'failure':
        this.status('BAD_REQUEST').json(result)
        break
    }
  }

  @RegisterAction('verifyUnlock')
  public async verifyUnlock(): Promise<any> {
    let parameters: VerifyUnlockPayload

    try {
      parameters = this.request.parameters.shape<VerifyUnlockPayload>('identifier', 'oneTimePassword')
    } catch (error) {
      return this.status('BAD_REQUEST').json({ parameters: error.message })
    }

    const result = await CURRENT_AUTHENTICATION.instance.performDynamic('verify-unlock', parameters)

    switch (result.status) {
      case 'failure':
        this.status('BAD_REQUEST').json(result)
        break
    }
  }
}
