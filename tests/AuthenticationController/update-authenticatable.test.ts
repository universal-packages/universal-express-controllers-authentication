import { initialize } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' }, TestAuthenticatable)
})

describe('AuthenticationController', (): void => {
  describe('update-authenticatable', (): void => {
    describe('when a successful update happens', (): void => {
      it('returns ok and the rendered authenticatable data', async (): Promise<void> => {
        await runExpressApp(TestAuthenticatable.findByCredential('email-confirmed'))

        await fPatch('authentication/update-authenticatable', { attributes: { username: 'new' } })
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toMatchObject({ status: 'success', authenticatable: { username: 'new' } })
      })
    })

    describe('when attributes are not valid', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressApp(TestAuthenticatable.findByCredential('email-confirmed'))

        await fPatch('authentication/update-authenticatable', { attributes: { password: 'new' } })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({ status: 'failure', validation: { errors: { password: ['password-out-of-size'] }, valid: false } })
      })
    })

    describe('when the authenticatable can not be extracted from request (not logged in)', (): void => {
      it('returns unauthorized', async (): Promise<void> => {
        await runExpressApp()

        await fPatch('authentication/update-authenticatable', { attributes: { username: 'new' } })
        expect(fResponse).toHaveReturnedWithStatus('UNAUTHORIZED')
      })
    })

    describe('when bad parameters are present', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressApp(TestAuthenticatable.findByCredential('email-confirmed'))

        await fPatch('authentication/update-authenticatable')
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({ status: 'failure', message: 'request/attributes was not provided and is not optional' })
      })
    })
  })
})
