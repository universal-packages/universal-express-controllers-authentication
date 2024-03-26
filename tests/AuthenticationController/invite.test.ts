import { initialize } from '../../src'
import { CURRENT_AUTHENTICATION } from '../../src/initialize'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' }, TestAuthenticatable)
})

describe('AuthenticationController', (): void => {
  describe('invite', (): void => {
    describe('when the invitation is successful', (): void => {
      beforeAll((): void => {
        CURRENT_AUTHENTICATION.instance.options.email.enableSignUpInvitations = true
      })

      afterAll((): void => {
        CURRENT_AUTHENTICATION.instance.options.email.enableSignUpInvitations = false
      })

      it('returns ok', async (): Promise<void> => {
        await runExpressControllers(TestAuthenticatable.findByCredential('email-confirmed'))

        await fPut('authentication/invite', { credential: "ma'man", credentialKind: 'email' })
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toMatchObject({ status: 'success' })
      })
    })

    describe('when invitations are not enabled', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers(TestAuthenticatable.findByCredential('email-confirmed'))

        await fPut('authentication/invite', { credential: "ma'man", credentialKind: 'email' })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({ status: 'failure', message: 'invitations-disabled' })
      })
    })

    describe('when the authenticatable can not be extracted from request (not logged in)', (): void => {
      it('returns unauthorized', async (): Promise<void> => {
        await runExpressControllers()

        await fPut('authentication/invite', { credential: "ma'man", credentialKind: 'email' })
        expect(fResponse).toHaveReturnedWithStatus('UNAUTHORIZED')
      })
    })

    describe('when bad parameters are present', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers(TestAuthenticatable.findByCredential('email-confirmed'))

        await fPut('authentication/invite', { credential: "ma'man", credentialKind: 'other' })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({
          status: 'failure',
          message: 'request/credentialKind does not provide right enum value, valid enum values are [email, phone], "other" was given'
        })
      })
    })
  })
})
