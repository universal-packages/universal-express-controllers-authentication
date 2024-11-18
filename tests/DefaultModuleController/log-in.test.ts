import DoPasswordsMatch from '@universal-packages/authentication/default-module/DoPasswordsMatch.universal-auth-dynamic'
import UserFromEmailDynamic from '@universal-packages/authentication/default-module/UserFromEmail.universal-auth-dynamic'

import { initialize } from '../../src'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' })
})

describe('DefaultModuleController', (): void => {
  describe('log-in', (): void => {
    describe('when a successful log in happens', (): void => {
      it('returns ok and the rendered session data', async (): Promise<void> => {
        await runExpressControllers()

        dynamicApiJest.mockDynamicReturnValue(UserFromEmailDynamic, { id: 99, email: 'david@universal-packages.com' })
        dynamicApiJest.mockDynamicReturnValue(DoPasswordsMatch, true)

        await fPost('authentication/log-in', { email: 'email', password: 'password' })
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toEqual({ status: 'success', user: { id: 99, email: 'david@universal-packages.com' }, sessionToken: '' })
      })
    })

    describe('when the log in attempt fails', (): void => {
      it('returns bad request', async (): Promise<void> => {
        await runExpressControllers()

        await fPost('authentication/log-in', { email: 'email', password: 'nop' })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toEqual({ status: 'failure', message: 'invalid-credentials' })
      })
    })

    describe('when bad parameters are passed', (): void => {
      it('returns bad request', async (): Promise<void> => {
        await runExpressControllers()

        await fPost('authentication/log-in')
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toEqual({ status: 'failure', message: 'request/email was not provided and is not optional' })
      })
    })
  })
})
