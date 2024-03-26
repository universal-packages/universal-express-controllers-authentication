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
  describe('connect-provider', (): void => {
    describe('when a successful connection happens', (): void => {
      it('returns ok and the rendered authenticatable data', async (): Promise<void> => {
        await runExpressControllers(TestAuthenticatable.findByCredential('email-confirmed'))

        await fPatch('authentication/connect-provider', { provider: 'universal', token: 'token' })
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toMatchObject({ status: 'success', authenticatable: { universalId: 'any.nothing' } })
      })
    })

    describe('when an error occurs when calling the provider', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers(TestAuthenticatable.findByCredential('email-confirmed'))

        await fPatch('authentication/connect-provider', { provider: 'universal', token: 'error' })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toEqual({ status: 'failure', message: 'provider-error' })
      })
    })

    describe('when the provider is already connected', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers(TestAuthenticatable.findByProviderId('universal', 'any.universal-connected'))

        await fPatch('authentication/connect-provider', { provider: 'universal', token: 'token' })
        expect(fResponse).toHaveReturnedWithStatus('ACCEPTED')
        expect(fResponseBody).toEqual({ status: 'warning', message: 'already-connected' })
      })
    })

    describe('when the provider does not exists', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers(TestAuthenticatable.findByProviderId('universal', 80085))

        await fPatch('authentication/connect-provider', { provider: 'nop', token: 'token' })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toEqual({ status: 'failure', message: 'unknown-provider' })
      })
    })

    describe('when the authenticatable can not be extracted from request (not logged in)', (): void => {
      it('returns unauthorized', async (): Promise<void> => {
        await runExpressControllers()

        await fPatch('authentication/connect-provider', { provider: 'universal', token: 'token' })
        expect(fResponse).toHaveReturnedWithStatus('UNAUTHORIZED')
      })
    })

    describe('when bad parameters are present', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers(TestAuthenticatable.findByProviderId('universal', 80085))

        await fPatch('authentication/connect-provider', { other: false })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toEqual({ status: 'failure', message: 'request/provider was not provided and is not optional' })
      })
    })
  })
})
