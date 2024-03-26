import { initialize } from '../../src'
import { CURRENT_AUTHENTICATION } from '../../src/initialize'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' }, TestAuthenticatable)
})

describe('AuthenticationController', (): void => {
  describe('request-confirmation', (): void => {
    describe('when the confirmation request is successful', (): void => {
      beforeAll((): void => {
        CURRENT_AUTHENTICATION.instance.options.email.enableConfirmation = true
      })

      afterAll((): void => {
        CURRENT_AUTHENTICATION.instance.options.email.enableConfirmation = false
      })

      it('returns ok', async (): Promise<void> => {
        await runExpressControllers()

        await fPut('authentication/request-confirmation', { credential: 'email', credentialKind: 'email' })
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toMatchObject({ status: 'success' })
      })
    })

    describe('when confirmations are not enabled', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers()

        await fPut('authentication/request-confirmation', { credential: 'email', credentialKind: 'email' })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({ status: 'failure', message: 'confirmation-disabled' })
      })
    })

    describe('when bad parameters are present', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers(TestAuthenticatable.findByCredential('email-confirmed'))

        await fPut('authentication/request-confirmation', { credential: 'email', credentialKind: 'nop' })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({
          status: 'failure',
          message: 'request/credentialKind does not provide right enum value, valid enum values are [email, phone], "nop" was given'
        })
      })
    })
  })
})
