import { ExpressApp } from '@universal-packages/express-controllers'

import { AuthenticationRoutes, initialize } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

const port = 4000 + Number(process.env['JEST_WORKER_ID'])

let app: ExpressApp
afterEach(async (): Promise<void> => {
  await app.stop()
})

describe(initialize, (): void => {
  describe('change-routes', (): void => {
    it('change routes ', async (): Promise<void> => {
      const routes: AuthenticationRoutes = {
        connectProvider: { path: 'change1' },
        continueWithProvider: { path: 'change2' },
        invite: { path: 'change3' },
        logIn: { path: 'change4' },
        requestConfirmation: { path: 'change5' },
        requestCorroboration: { path: 'change6' },
        requestMultiFactor: { path: 'change7' },
        requestPasswordReset: { path: 'change8' },
        signUp: { path: 'change9' },
        updateAuthenticatable: { path: 'change10' },
        updateCredential: { path: 'change11' },
        verifyConfirmation: { path: 'change12' },
        verifyCorroboration: { path: 'change13' },
        verifyMultiFactor: { path: 'change14' },
        verifyPasswordReset: { path: 'change15' },
        verifyUnlock: { path: 'change16' }
      }
      await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret', routes, rootPath: '/custom' }, TestAuthenticatable)

      app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
      app.on('request/error', console.log)
      await app.prepare()
      await app.run()

      await fPatch('/custom/change1')
      expect(fResponse).not.toHaveReturnedWithStatus('NOT_FOUND')

      await fPost('/custom/change2')
      expect(fResponse).not.toHaveReturnedWithStatus('NOT_FOUND')

      await fPut('/custom/change3')
      expect(fResponse).not.toHaveReturnedWithStatus('NOT_FOUND')

      await fPost('/custom/change4')
      expect(fResponse).not.toHaveReturnedWithStatus('NOT_FOUND')

      await fPut('/custom/change5')
      expect(fResponse).not.toHaveReturnedWithStatus('NOT_FOUND')

      await fPut('/custom/change6')
      expect(fResponse).not.toHaveReturnedWithStatus('NOT_FOUND')

      await fPut('/custom/change7')
      expect(fResponse).not.toHaveReturnedWithStatus('NOT_FOUND')

      await fPut('/custom/change8')
      expect(fResponse).not.toHaveReturnedWithStatus('NOT_FOUND')

      await fPost('/custom/change9')
      expect(fResponse).not.toHaveReturnedWithStatus('NOT_FOUND')

      await fPatch('/custom/change10')
      expect(fResponse).not.toHaveReturnedWithStatus('NOT_FOUND')

      await fPatch('/custom/change11')
      expect(fResponse).not.toHaveReturnedWithStatus('NOT_FOUND')

      await fPut('/custom/change12')
      expect(fResponse).not.toHaveReturnedWithStatus('NOT_FOUND')

      await fPut('/custom/change13')
      expect(fResponse).not.toHaveReturnedWithStatus('NOT_FOUND')

      await fPut('/custom/change14')
      expect(fResponse).not.toHaveReturnedWithStatus('NOT_FOUND')

      await fPut('/custom/change15')
      expect(fResponse).not.toHaveReturnedWithStatus('NOT_FOUND')

      await fPut('/custom/change16')
      expect(fResponse).not.toHaveReturnedWithStatus('NOT_FOUND')
    })
  })
})
