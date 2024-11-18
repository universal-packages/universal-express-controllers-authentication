import CreateUserDynamic from '@universal-packages/authentication/CreateUser.universal-auth-dynamic'

import { initialize } from '../../src'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' })
})

describe('DefaultModuleController', (): void => {
  describe('sign-up', (): void => {
    describe('when a successful signup happens', (): void => {
      it('returns ok and the rendered session data', async (): Promise<void> => {
        await runExpressControllers(undefined, true)

        dynamicApiJest.mockDynamicReturnValue(CreateUserDynamic, { id: 99, email: 'david@universal-packages' })

        await fPost('authentication/sign-up', {
          email: 'DAVID@UNIVERSAL.com',
          password: '12345678'
        })
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toEqual({ status: 'success', user: { id: 99, email: 'david@universal-packages' }, sessionToken: '' })
      })
    })

    describe('when bad parameters are passed', (): void => {
      it('returns bad request', async (): Promise<void> => {
        await runExpressControllers()

        await fPost('authentication/sign-up', {})
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toEqual({ status: 'failure', message: 'request/email was not provided and is not optional' })
      })
    })
  })
})
