import { ExpressApp } from '@universal-packages/express-controllers'
import fetch from 'node-fetch'
import { AuthenticationRoutes, initialize } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

const port = 4000 + Number(process.env['JEST_WORKER_ID'])

let app: ExpressApp
afterEach(async (): Promise<void> => {
  await app.stop()
})

describe('initialize', (): void => {
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
      await initialize({ debug: true, dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret', routes }, TestAuthenticatable)

      app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
      app.on('request/error', console.log)
      await app.prepare()
      await app.run()

      let response = await fetch(`http://localhost:${port}/authentication/connect-provider`, { method: 'patch' })
      expect(response.status).toEqual(404)

      response = await fetch(`http://localhost:${port}/authentication/continue-with-provider`, { method: 'post' })
      expect(response.status).toEqual(404)

      response = await fetch(`http://localhost:${port}/authentication/invite`, { method: 'put' })
      expect(response.status).toEqual(404)

      response = await fetch(`http://localhost:${port}/authentication/log-in`, { method: 'post' })
      expect(response.status).toEqual(404)

      response = await fetch(`http://localhost:${port}/authentication/request-confirmation`, { method: 'put' })
      expect(response.status).toEqual(404)

      response = await fetch(`http://localhost:${port}/authentication/request-corroboration`, { method: 'put' })
      expect(response.status).toEqual(404)

      response = await fetch(`http://localhost:${port}/authentication/request-multi-factor`, { method: 'put' })
      expect(response.status).toEqual(404)

      response = await fetch(`http://localhost:${port}/authentication/request-password-reset`, { method: 'put' })
      expect(response.status).toEqual(404)

      response = await fetch(`http://localhost:${port}/authentication/sign-up`, { method: 'post' })
      expect(response.status).toEqual(404)

      response = await fetch(`http://localhost:${port}/authentication/update-authenticatable`, { method: 'patch' })
      expect(response.status).toEqual(404)

      response = await fetch(`http://localhost:${port}/authentication/update-credential`, { method: 'patch' })
      expect(response.status).toEqual(404)

      response = await fetch(`http://localhost:${port}/authentication/verify-confirmation`, { method: 'put' })
      expect(response.status).toEqual(404)

      response = await fetch(`http://localhost:${port}/authentication/verify-corroboration`, { method: 'put' })
      expect(response.status).toEqual(404)

      response = await fetch(`http://localhost:${port}/authentication/verify-multi-factor`, { method: 'put' })
      expect(response.status).toEqual(404)

      response = await fetch(`http://localhost:${port}/authentication/verify-password-reset`, { method: 'put' })
      expect(response.status).toEqual(404)

      response = await fetch(`http://localhost:${port}/authentication/verify-unlock`, { method: 'put' })
      expect(response.status).toEqual(404)
    })
  })
})
