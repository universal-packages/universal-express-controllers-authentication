import { initialize } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' }, TestAuthenticatable)
})

describe('AuthenticationController', (): void => {
  describe('log-out', (): void => {
    describe('when a successful log out happens', (): void => {
      it('returns ok and the rendered session data', async (): Promise<void> => {
        await runExpressControllers(TestAuthenticatable.findByCredential('email-confirmed'))

        await fDelete('authentication/log-out')
        expect(fResponse).toHaveReturnedWithStatus('OK')
      })
    })

    describe('when no authenticatable is in session', (): void => {
      it('returns forbidden', async (): Promise<void> => {
        await runExpressControllers()

        await fDelete('authentication/log-out')
        expect(fResponse).toHaveReturnedWithStatus('UNAUTHORIZED')
      })
    })
  })
})
