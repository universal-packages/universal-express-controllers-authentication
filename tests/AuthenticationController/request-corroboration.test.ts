import { ExpressApp } from '@universal-packages/express-controllers'
import { NextFunction, Request, Response } from 'express'
import fetch from 'node-fetch'
import { initialize } from '../../src'
import { CURRENT_AUTHENTICATION } from '../../src/initialize'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

const port = 4000 + Number(process.env['JEST_WORKER_ID'])

let app: ExpressApp
afterEach(async (): Promise<void> => {
  await app.stop()
})

beforeAll(async (): Promise<void> => {
  await initialize({ debug: true, dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' }, TestAuthenticatable)
})

describe('AuthenticationController', (): void => {
  describe('request-corroboration', (): void => {
    describe('when the corroboration request is successful', (): void => {
      beforeAll((): void => {
        CURRENT_AUTHENTICATION.instance.options.email.enableCorroboration = true
      })

      afterAll((): void => {
        CURRENT_AUTHENTICATION.instance.options.email.enableCorroboration = false
      })

      it('returns ok', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/request-corroboration`, {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: 'email', credentialKind: 'email' })
        })

        expect(response.status).toEqual(200)
        expect(await response.json()).toMatchObject({ status: 'success' })
      })
    })

    describe('when corroboration is not enabled', (): void => {
      it('returns fail', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/request-corroboration`, {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: 'email', credentialKind: 'email' })
        })

        expect(response.status).toEqual(400)
        expect(await response.json()).toMatchObject({ status: 'failure', message: 'corroboration-disabled' })
      })
    })

    describe('when bad parameters are present', (): void => {
      it('returns fail', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        app.expressApp.use((request: Request, _response: Response, next: NextFunction) => {
          request['authenticatable'] = TestAuthenticatable.findByCredential('email-unconfirmed')
          next()
        })
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/request-corroboration`, {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: 'email', credentialKind: 'id' })
        })

        expect(response.status).toEqual(400)
        expect(await response.json()).toMatchObject({
          status: 'failure',
          message: 'request/credentialKind does not provide right enum value, valid enum values are [email, phone], "id" was given'
        })
      })
    })
  })
})
