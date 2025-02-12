import { initialize } from '../../src'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' })
})

describe('AuthenticationController', (): void => {
  describe('log-out', (): void => {
    describe('when a successful log out happens', (): void => {
      it('returns ok and the rendered session data', async (): Promise<void> => {
        await runExpressControllers({ id: 99, email: 'david@universal-packages.com' })

        await fDelete('authentication/log-out')
        expect(fResponse).toHaveReturnedWithStatus('OK')
      })
    })

    describe('when no user is in session', (): void => {
      it('returns forbidden', async (): Promise<void> => {
        await runExpressControllers()

        await fDelete('authentication/log-out')
        expect(fResponse).toHaveReturnedWithStatus('UNAUTHORIZED')
      })
    })
  })
})
