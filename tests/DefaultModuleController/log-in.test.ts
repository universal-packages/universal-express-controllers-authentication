import { initialize } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' }, TestAuthenticatable)
})

describe('DefaultModuleController', (): void => {
  describe('log-in', (): void => {
    describe('when a successful log in happens', (): void => {
      it('returns ok and the rendered session data', async (): Promise<void> => {
        await runExpressControllers()

        await fPost('authentication/log-in', { email: 'email', password: 'password' })
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toMatchObject({ status: 'success', authenticatable: {}, sessionToken: '' })
      })
    })

    describe('when the log in attempt fails', (): void => {
      it('returns bad request', async (): Promise<void> => {
        await runExpressControllers()

        await fPost('authentication/log-in', { email: 'email', password: 'nop' })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({ status: 'failure', message: 'invalid-credentials' })
      })
    })

    describe('when bad parameters are passed', (): void => {
      it('returns bad request', async (): Promise<void> => {
        await runExpressControllers()

        await fPost('authentication/log-in')
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({ status: 'failure', message: 'request/email was not provided and is not optional' })
      })
    })
  })
})
