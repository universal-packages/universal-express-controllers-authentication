import { initialize } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' }, TestAuthenticatable)
})

describe('DefaultModuleController', (): void => {
  describe('update-email-password', (): void => {
    describe('when a successful update happens', (): void => {
      it('returns ok and the rendered authenticatable data', async (): Promise<void> => {
        await runExpressControllers(TestAuthenticatable.fromId(99))

        await fPatch('authentication/update-email-password', { email: 'new@email.com' })
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toMatchObject({ status: 'success', authenticatable: { email: 'new@email.com' } })
      })
    })

    describe('when attributes are not valid', (): void => {
      it('returns fail', async (): Promise<void> => {
        await runExpressControllers(TestAuthenticatable.fromId(99))

        await fPatch('authentication/update-email-password', { password: 'new' })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({ status: 'failure', validation: { errors: { password: ['password-out-of-size'] }, valid: false } })
      })
    })

    describe('when the authenticatable can not be extracted from request (not logged in)', (): void => {
      it('returns unauthorized', async (): Promise<void> => {
        await runExpressControllers()

        await fPatch('authentication/update-email-password', { attributes: { username: 'new' } })
        expect(fResponse).toHaveReturnedWithStatus('UNAUTHORIZED')
      })
    })

    describe('all parameters are optional', (): void => {
      it('returns successful', async (): Promise<void> => {
        await runExpressControllers(TestAuthenticatable.fromId(99))

        await fPatch('authentication/update-email-password', { email: undefined })
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toMatchObject({ status: 'success' })
      })
    })
  })
})
