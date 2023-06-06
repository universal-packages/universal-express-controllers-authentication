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

      let response = await fetch(`http://localhost:${port}/custom/change1`, { method: 'patch' })
      expect(response.status).not.toEqual(404)

      response = await fetch(`http://localhost:${port}/custom/change2`, { method: 'post' })
      expect(response.status).not.toEqual(404)

      response = await fetch(`http://localhost:${port}/custom/change3`, { method: 'put' })
      expect(response.status).not.toEqual(404)

      response = await fetch(`http://localhost:${port}/custom/change4`, { method: 'post' })
      expect(response.status).not.toEqual(404)

      response = await fetch(`http://localhost:${port}/custom/change5`, { method: 'put' })
      expect(response.status).not.toEqual(404)

      response = await fetch(`http://localhost:${port}/custom/change6`, { method: 'put' })
      expect(response.status).not.toEqual(404)

      response = await fetch(`http://localhost:${port}/custom/change7`, { method: 'put' })
      expect(response.status).not.toEqual(404)

      response = await fetch(`http://localhost:${port}/custom/change8`, { method: 'put' })
      expect(response.status).not.toEqual(404)

      response = await fetch(`http://localhost:${port}/custom/change9`, { method: 'post' })
      expect(response.status).not.toEqual(404)

      response = await fetch(`http://localhost:${port}/custom/change10`, { method: 'patch' })
      expect(response.status).not.toEqual(404)

      response = await fetch(`http://localhost:${port}/custom/change11`, { method: 'patch' })
      expect(response.status).not.toEqual(404)

      response = await fetch(`http://localhost:${port}/custom/change12`, { method: 'put' })
      expect(response.status).not.toEqual(404)

      response = await fetch(`http://localhost:${port}/custom/change13`, { method: 'put' })
      expect(response.status).not.toEqual(404)

      response = await fetch(`http://localhost:${port}/custom/change14`, { method: 'put' })
      expect(response.status).not.toEqual(404)

      response = await fetch(`http://localhost:${port}/custom/change15`, { method: 'put' })
      expect(response.status).not.toEqual(404)

      response = await fetch(`http://localhost:${port}/custom/change16`, { method: 'put' })
      expect(response.status).not.toEqual(404)
    })
  })
})
