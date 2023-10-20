import { ExpressApp } from '@universal-packages/express-controllers'

import { AuthenticationRoutes, initialize } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

const port = 4000 + Number(process.env['JEST_WORKER_ID'])

let app: ExpressApp
afterEach(async (): Promise<void> => {
  await app.stop()
})

describe(initialize, (): void => {
  describe('disable-routes', (): void => {
    it('disable routes if configured', async (): Promise<void> => {
      const routes: AuthenticationRoutes = {
        connectProvider: { enable: false },
        continueWithProvider: { enable: false },
        invite: { enable: false },
        logIn: { enable: false },
        requestConfirmation: { enable: false },
        requestCorroboration: { enable: false },
        requestMultiFactor: { enable: false },
        requestPasswordReset: { enable: false },
        signUp: { enable: false },
        updateAuthenticatable: { enable: false },
        updateCredential: { enable: false },
        verifyConfirmation: { enable: false },
        verifyCorroboration: { enable: false },
        verifyMultiFactor: { enable: false },
        verifyPasswordReset: { enable: false },
        verifyUnlock: { enable: false }
      }
      await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret', routes }, TestAuthenticatable)

      app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
      app.on('request/error', console.log)
      await app.prepare()
      await app.run()

      await fPatch('authentication/connect-provider')
      expect(fResponse).toHaveReturnedWithStatus('NOT_FOUND')

      await fPost('authentication/continue-with-provider')
      expect(fResponse).toHaveReturnedWithStatus('NOT_FOUND')

      await fPut('authentication/invite')
      expect(fResponse).toHaveReturnedWithStatus('NOT_FOUND')

      await fPost('authentication/log-in')
      expect(fResponse).toHaveReturnedWithStatus('NOT_FOUND')

      await fPut('authentication/request-confirmation')
      expect(fResponse).toHaveReturnedWithStatus('NOT_FOUND')

      await fPut('authentication/request-corroboration')
      expect(fResponse).toHaveReturnedWithStatus('NOT_FOUND')

      await fPut('authentication/request-multi-factor')
      expect(fResponse).toHaveReturnedWithStatus('NOT_FOUND')

      await fPut('authentication/request-password-reset')
      expect(fResponse).toHaveReturnedWithStatus('NOT_FOUND')

      await fPost('authentication/sign-up')
      expect(fResponse).toHaveReturnedWithStatus('NOT_FOUND')

      await fPatch('authentication/update-authenticatable')
      expect(fResponse).toHaveReturnedWithStatus('NOT_FOUND')

      await fPatch('authentication/update-credential')
      expect(fResponse).toHaveReturnedWithStatus('NOT_FOUND')

      await fPut('authentication/verify-confirmation')
      expect(fResponse).toHaveReturnedWithStatus('NOT_FOUND')

      await fPut('authentication/verify-corroboration')
      expect(fResponse).toHaveReturnedWithStatus('NOT_FOUND')

      await fPut('authentication/verify-multi-factor')
      expect(fResponse).toHaveReturnedWithStatus('NOT_FOUND')

      await fPut('authentication/verify-password-reset')
      expect(fResponse).toHaveReturnedWithStatus('NOT_FOUND')

      await fPut('authentication/verify-unlock')
      expect(fResponse).toHaveReturnedWithStatus('NOT_FOUND')
    })
  })
})
