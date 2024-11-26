import UserFromEmailDynamic from '@universal-packages/authentication/default-module/UserFromEmail.universal-auth-dynamic'

import { initialize } from '../../src'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' })
})

describe('DefaultModuleController', (): void => {
  describe('request-password-reset', (): void => {
    describe('when the password-reset request is successful', (): void => {
      it('returns ok', async (): Promise<void> => {
        await runExpressControllers()

        dynamicApiJest.mockDynamicReturnValue(UserFromEmailDynamic, { id: 99, email: 'david@universal-packages.com' })

        await fPut('authentication/request-password-reset', { email: 'email' })

        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toEqual({ status: 'success' })
      })
    })

    describe('when no user can be match with the credential', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers()

        dynamicApiJest.mockDynamicReturnValue(UserFromEmailDynamic, null)

        await fPut('authentication/request-password-reset', { email: 'invalid' })

        expect(fResponse).toHaveReturnedWithStatus('ACCEPTED')
      })
    })

    describe('when bad parameters are present', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers()

        await fPut('authentication/request-password-reset')

        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toEqual({
          status: 'failure',
          message: 'request/email was not provided and is not optional'
        })
      })
    })
  })
})
