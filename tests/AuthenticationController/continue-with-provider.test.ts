import { initialize } from '../../src'
import { CURRENT_AUTHENTICATION } from '../../src/initialize'
import GetUniversalUserDataDynamic from '../__fixtures__/GetUniversalDataDynamic'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' }, TestAuthenticatable)

  CURRENT_AUTHENTICATION.instance.dynamics['get-universal-user-data'] = {
    afterHooks: [],
    beforeHooks: [],
    implementations: [],
    name: 'get-universal-user-data',
    default: GetUniversalUserDataDynamic
  }
})

describe('AuthenticationController', (): void => {
  describe('continue-with-provider', (): void => {
    describe('when a successful connection happens', (): void => {
      it('returns ok and the rendered session data', async (): Promise<void> => {
        await runExpressControllers()

        await fPost('authentication/continue-with-provider', { provider: 'universal', token: 'token' })
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toMatchObject({ status: 'success', authenticatable: { universalId: 'any.nothing' }, sessionToken: '' })
      })
    })

    describe('when an error occurs when calling the provider', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers()

        await fPost('authentication/continue-with-provider', { provider: 'universal', token: 'error' })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({ status: 'failure', message: 'provider-error' })
      })
    })

    describe('when the provider does not exists', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers()

        await fPost('authentication/continue-with-provider', { provider: 'nop', token: 'token' })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({ status: 'failure', message: 'unknown-provider' })
      })
    })

    describe('when bad parameters are present', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers()

        await fPost('authentication/continue-with-provider', { other: false })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({ status: 'failure', message: 'request/provider was not provided and is not optional' })
      })
    })
  })
})
