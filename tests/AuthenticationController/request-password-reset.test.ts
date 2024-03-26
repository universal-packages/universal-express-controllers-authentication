import { initialize } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' }, TestAuthenticatable)
})

describe('AuthenticationController', (): void => {
  describe('request-password-reset', (): void => {
    describe('when the password-reset request is successful', (): void => {
      it('returns ok', async (): Promise<void> => {
        await runExpressControllers()
        await fPut('authentication/request-password-reset', { credential: 'email' })
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toMatchObject({ status: 'success' })
      })
    })

    describe('when no authenticatable can be match with the credential', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers()

        await fPut('authentication/request-password-reset', { credential: 'email.nothing' })
        expect(fResponse).toHaveReturnedWithStatus('ACCEPTED')
        expect(fResponseBody).toMatchObject({ status: 'warning', message: 'nothing-to-do' })
      })
    })

    describe('when bad parameters are present', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers(TestAuthenticatable.findByCredential('email-confirmed'))

        await fPut('authentication/request-password-reset')
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({
          status: 'failure',
          message: 'request/credential was not provided and is not optional'
        })
      })
    })
  })
})
