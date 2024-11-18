import VerifyOneTimePassword from '@universal-packages/authentication/VerifyOneTimePassword.universal-auth-dynamic'
import UserFromEmailDynamic from '@universal-packages/authentication/default-module/UserFromEmail.universal-auth-dynamic'

import { initialize } from '../../src'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' })
})

describe('DefaultModuleController', (): void => {
  describe('verify-password-reset', (): void => {
    describe('when the password-reset verification is successful', (): void => {
      it('returns ok', async (): Promise<void> => {
        await runExpressControllers()

        dynamicApiJest.mockDynamicReturnValue(VerifyOneTimePassword, true)
        dynamicApiJest.mockDynamicReturnValue(UserFromEmailDynamic, { id: 99, email: 'david@universal-packages.com' })

        await fPut('authentication/verify-password-reset', { email: 'email', oneTimePassword: 123, password: 'new-password' })
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toEqual({ status: 'success', user: { id: 99, email: 'david@universal-packages.com' } })
      })
    })

    describe('when the otp verification fails', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers()

        dynamicApiJest.mockDynamicReturnValue(VerifyOneTimePassword, false)

        await fPut('authentication/verify-password-reset', { email: 'email', oneTimePassword: 123, password: 'short' })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toEqual({ status: 'failure', message: 'invalid-one-time-password' })
      })
    })

    describe('when the validation fails', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers()

        dynamicApiJest.mockDynamicReturnValue(VerifyOneTimePassword, true)
        dynamicApiJest.mockDynamicReturnValue(UserFromEmailDynamic, { id: 99, email: 'david@universal-packages.com' })

        await fPut('authentication/verify-password-reset', { email: 'email', oneTimePassword: 123, password: 'short' })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toEqual({ status: 'failure', validation: { errors: { password: ['password-out-of-size'] }, valid: false } })
      })
    })

    describe('when bad parameters are present', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers()

        await fPut('authentication/verify-password-reset')
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toEqual({ status: 'failure', message: 'request/email was not provided and is not optional' })
      })
    })
  })
})
