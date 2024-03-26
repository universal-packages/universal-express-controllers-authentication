import { initialize } from '../../src'
import { CURRENT_AUTHENTICATION } from '../../src/initialize'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' }, TestAuthenticatable)
})

describe('AuthenticationController', (): void => {
  describe('verify-password-reset', (): void => {
    describe('when the password-reset verification is successful', (): void => {
      it('returns ok', async (): Promise<void> => {
        await runExpressControllers()

        const oneTimePassword = CURRENT_AUTHENTICATION.instance.performDynamicSync('generate-one-time-password', {
          concern: 'password-reset',
          identifier: 'email'
        })

        await fPut('authentication/verify-password-reset', { credential: 'email', oneTimePassword, password: 'new-password' })
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toMatchObject({ status: 'success' })
      })
    })

    describe('when the verification fails', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers()

        const oneTimePassword = CURRENT_AUTHENTICATION.instance.performDynamicSync('generate-one-time-password', {
          concern: 'password-reset',
          identifier: 'email'
        })

        await fPut('authentication/verify-password-reset', { credential: 'email', oneTimePassword, password: 'short' })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({ status: 'failure', validation: { errors: { password: ['password-out-of-size'] }, valid: false } })
      })
    })

    describe('when bad parameters are present', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers()

        await fPut('authentication/verify-password-reset')
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({ status: 'failure', message: 'request/credential was not provided and is not optional' })
      })
    })
  })
})
