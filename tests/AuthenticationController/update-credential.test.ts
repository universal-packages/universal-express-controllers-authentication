import { ExpressApp } from '@universal-packages/express-controllers'
import { NextFunction, Request, Response } from 'express'
import fetch from 'node-fetch'
import { initialize } from '../../src'
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
  describe('update-credential', (): void => {
    describe('when a successful update happens', (): void => {
      it('returns ok and the rendered authenticatable data', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        app.expressApp.use((request: Request, _response: Response, next: NextFunction) => {
          request['authenticatable'] = TestAuthenticatable.findByCredential('email-confirmed')
          next()
        })
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/update-credential`, {
          method: 'patch',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: 'new@email.com', credentialKind: 'email' })
        })

        expect(response.status).toEqual(200)
        expect(await response.json()).toMatchObject({ authenticatable: { email: 'new@email.com' } })
      })
    })

    describe('when credential is not valid', (): void => {
      it('returns fail', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        app.expressApp.use((request: Request, _response: Response, next: NextFunction) => {
          request['authenticatable'] = TestAuthenticatable.findByCredential('email-confirmed')
          next()
        })
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/update-credential`, {
          method: 'patch',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: 'new', credentialKind: 'email' })
        })

        expect(response.status).toEqual(400)
        expect(await response.json()).toMatchObject({ validation: { errors: { email: ['invalid-email'] }, valid: false } })
      })
    })

    describe('when the authenticatable can not be extracted from request (not logged in)', (): void => {
      it('returns unauthorized', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/update-credential`, {
          method: 'patch',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: 'new@email.com', credentialKind: 'email' })
        })

        expect(response.status).toEqual(401)
      })
    })

    describe('when bad parameters are present', (): void => {
      it('returns fail', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        app.expressApp.use((request: Request, _response: Response, next: NextFunction) => {
          request['authenticatable'] = TestAuthenticatable.findByProviderId('universal', 80085)
          next()
        })
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/update-credential`, {
          method: 'patch',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        })

        expect(response.status).toEqual(400)
        expect(await response.json()).toMatchObject({ parameters: 'request/credential was not provided and is not optional' })
      })
    })
  })
})
