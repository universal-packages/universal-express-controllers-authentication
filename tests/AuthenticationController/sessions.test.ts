import { ExpressApp } from '@universal-packages/express-controllers'

import { initialize } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' }, TestAuthenticatable)
})

describe('AuthenticationController', (): void => {
  describe('sessions', (): void => {
    describe('when an authenticatable is in session', (): void => {
      it('returns ok and renders the sessions', async (): Promise<void> => {
        await runExpressApp(TestAuthenticatable.findByCredential('email-confirmed'))

        await fGet('authentication/sessions')
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toMatchObject({ status: 'success', sessions: {} })
      })
    })

    describe('when no authenticatable is in session', (): void => {
      it('returns unauthorized', async (): Promise<void> => {
        await runExpressApp()

        await fGet('authentication/sessions')
        expect(fResponse).toHaveReturnedWithStatus('UNAUTHORIZED')
      })
    })
  })
})
