import { initialize } from '../../src'
import { CURRENT_AUTHENTICATION } from '../../src/initialize'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' }, TestAuthenticatable)
})

describe('AuthenticationController', (): void => {
  describe('verify-multi-factor', (): void => {
    describe('when the multi-factor verification is successful', (): void => {
      it('returns ok', async (): Promise<void> => {
        await runExpressControllers()

        const oneTimePassword = CURRENT_AUTHENTICATION.instance.performDynamicSync('generate-one-time-password', {
          concern: 'multi-factor',
          identifier: 'email.multi-factor-active'
        })

        await fPut('authentication/verify-multi-factor', { credential: 'email.multi-factor-active', oneTimePassword })
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toMatchObject({ status: 'success', authenticatable: {}, sessionToken: '' })
      })
    })

    describe('when the verification fails', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers()

        await fPut('authentication/verify-multi-factor', { credential: 'email.multi-factor-active', oneTimePassword: 'nop' })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({ status: 'failure', message: 'invalid-one-time-password' })
      })
    })

    describe('when bad parameters are present', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers()

        await fPut('authentication/verify-multi-factor')
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({ status: 'failure', message: 'request/credential was not provided and is not optional' })
      })
    })
  })
})
