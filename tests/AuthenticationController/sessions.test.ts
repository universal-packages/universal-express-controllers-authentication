import { initialize } from '../../src'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' })
})

describe('AuthenticationController', (): void => {
  describe('sessions', (): void => {
    describe('when an user is in session', (): void => {
      it('returns ok and renders the sessions', async (): Promise<void> => {
        await runExpressControllers({ id: 99, email: 'david@universal-packages.com' })

        await fGet('authentication/sessions')
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toMatchObject({ status: 'success', sessions: {} })
      })
    })

    describe('when no user is in session', (): void => {
      it('returns unauthorized', async (): Promise<void> => {
        await runExpressControllers()

        await fGet('authentication/sessions')
        expect(fResponse).toHaveReturnedWithStatus('UNAUTHORIZED')
      })
    })
  })
})
