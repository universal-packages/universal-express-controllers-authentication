import UpdateUser from '@universal-packages/authentication/UpdateUser.universal-auth-dynamic'
import UserFromEmailDynamic from '@universal-packages/authentication/default-module/UserFromEmail.universal-auth-dynamic'

import { initialize } from '../../src'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' })
})

describe('DefaultModuleController', (): void => {
  describe('update-email-password', (): void => {
    describe('when a successful update happens', (): void => {
      it('returns ok and the rendered user data', async (): Promise<void> => {
        const user = { id: 99, email: 'david@universal-packages.com' }
        await runExpressControllers(user, true)

        dynamicApiJest.mockDynamicReturnValue(UserFromEmailDynamic, user)
        dynamicApiJest.mockDynamicReturnValue(UpdateUser, user)

        await fPatch('authentication/update-email-password', { email: 'new@email.com' })
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toEqual({ status: 'success', user })
      })
    })

    describe('when attributes are not valid', (): void => {
      it('returns fail', async (): Promise<void> => {
        const user = { id: 99, email: 'david@universal-packages.com' }
        await runExpressControllers(user)

        await fPatch('authentication/update-email-password', { password: 'new' })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toEqual({ status: 'failure', validation: { errors: { password: ['password-should-be-right-sized'] }, valid: false } })
      })
    })

    describe('when the user can not be extracted from request (not logged in)', (): void => {
      it('returns unauthorized', async (): Promise<void> => {
        await runExpressControllers()

        await fPatch('authentication/update-email-password', { attributes: { username: 'new' } })
        expect(fResponse).toHaveReturnedWithStatus('UNAUTHORIZED')
      })
    })

    describe('all parameters are optional', (): void => {
      it('returns successful', async (): Promise<void> => {
        const user = { id: 99, email: 'david@universal-packages.com' }
        await runExpressControllers(user)

        dynamicApiJest.mockDynamicReturnValue(UserFromEmailDynamic, user)
        dynamicApiJest.mockDynamicReturnValue(UpdateUser, user)

        await fPatch('authentication/update-email-password', { email: undefined })
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toEqual({ status: 'success', user })
      })
    })
  })
})
