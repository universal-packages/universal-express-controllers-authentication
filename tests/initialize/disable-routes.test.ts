import { AuthenticationRoutes, initialize } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

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
      // Remove this when node work well with fetch
      try {
        await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret', routes }, TestAuthenticatable)
      } catch {}

      await runExpressApp()

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
