import { initialize } from '../../src'
import { CURRENT_AUTHENTICATION } from '../../src/initialize'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' }, TestAuthenticatable)
})

describe('AuthenticationController', (): void => {
  describe('verify-confirmation', (): void => {
    describe('when the confirmation verification is successful', (): void => {
      it('returns ok', async (): Promise<void> => {
        await runExpressApp()

        const oneTimePassword = CURRENT_AUTHENTICATION.instance.performDynamicSync('generate-one-time-password', {
          concern: 'confirmation',
          identifier: 'email.unconfirmed.email'
        })

        await fPut('authentication/verify-confirmation', { credential: 'email.unconfirmed', credentialKind: 'email', oneTimePassword })
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toMatchObject({ status: 'success', authenticatable: {} })
      })
    })

    describe('when the verification fails', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressApp()

        await fPut('authentication/verify-confirmation', { credential: 'email.unconfirmed', credentialKind: 'email', oneTimePassword: 'nop' })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({ status: 'failure', message: 'invalid-one-time-password' })
      })
    })

    describe('when bad parameters are present', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressApp()

        await fPut('authentication/verify-confirmation')
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({ status: 'failure', message: 'request/credential was not provided and is not optional' })
      })
    })
  })
})
