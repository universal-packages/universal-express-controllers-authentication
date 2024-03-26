import { initialize } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' }, TestAuthenticatable)
})

describe('AuthenticationController', (): void => {
  describe('request-unlock', (): void => {
    describe('when the unlock request is successful', (): void => {
      it('returns ok', async (): Promise<void> => {
        await runExpressControllers()

        await fPut('authentication/request-unlock', { credential: 'email.locked' })
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toMatchObject({ status: 'success' })
      })
    })

    describe('when the authenticatable is not active for multi factor', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers()

        await fPut('authentication/request-unlock', { credential: 'email' })
        expect(fResponse).toHaveReturnedWithStatus('ACCEPTED')
        expect(fResponseBody).toMatchObject({ status: 'warning', message: 'nothing-to-do' })
      })
    })

    describe('when bad parameters are present', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers(TestAuthenticatable.findByCredential('email-confirmed'))

        await fPut('authentication/request-unlock')
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({
          status: 'failure',
          message: 'request/credential was not provided and is not optional'
        })
      })
    })
  })
})
