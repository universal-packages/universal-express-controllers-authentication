import { initialize } from '../../src'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' })
})

describe('AuthenticationController', (): void => {
  describe('me', (): void => {
    describe('when an user is in session', (): void => {
      it('returns ok and renders the user', async (): Promise<void> => {
        await runExpressControllers({ id: 99, email: 'david@universal-packages.com' })

        await fGet('authentication/me')
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toMatchObject({ status: 'success', user: {} })
      })
    })

    describe('when no user is in session', (): void => {
      it('returns forbidden', async (): Promise<void> => {
        await runExpressControllers()

        await fGet('authentication/me')
        expect(fResponse).toHaveReturnedWithStatus('UNAUTHORIZED')
      })
    })
  })
})
