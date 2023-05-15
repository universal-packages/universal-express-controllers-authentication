import { ExpressApp } from '@universal-packages/express-controllers'
import { NextFunction, Request, Response } from 'express'
import fetch from 'node-fetch'
import { initialize } from '../../src'
import { CURRENT_AUTHENTICATION } from '../../src/initialize'
import GetUniversalUserDataDynamic from '../__fixtures__/GetUniversalDataDynamic'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

const port = 4000 + Number(process.env['JEST_WORKER_ID'])

let app: ExpressApp
afterEach(async (): Promise<void> => {
  await app.stop()
})

beforeAll(async (): Promise<void> => {
  await initialize({ debug: true, dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' }, TestAuthenticatable)

  CURRENT_AUTHENTICATION.instance.dynamics['get-universal-user-data'] = {
    afterHooks: [],
    beforeHooks: [],
    implementations: [],
    name: 'get-universal-user-data',
    default: GetUniversalUserDataDynamic
  }
})

describe('AuthenticationController', (): void => {
  describe('connect-provider', (): void => {
    describe('when a successful connection happens', (): void => {
      it('returns ok and the rendered authenticatable data', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        app.expressApp.use((request: Request, _response: Response, next: NextFunction) => {
          request['authenticatable'] = TestAuthenticatable.findByCredential('email-confirmed')
          next()
        })
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/connect-provider`, {
          method: 'patch',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: 'universal', token: 'token' })
        })

        expect(response.status).toEqual(200)
        expect(await response.json()).toMatchObject({ status: 'success', authenticatable: { universalId: 'any.nothing' } })
      })
    })

    describe('when an error occurs when calling the provider', (): void => {
      it('returns fail', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        app.expressApp.use((request: Request, _response: Response, next: NextFunction) => {
          request['authenticatable'] = TestAuthenticatable.findByCredential('email-confirmed')
          next()
        })
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/connect-provider`, {
          method: 'patch',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: 'universal', token: 'error' })
        })

        expect(response.status).toEqual(400)
        expect(await response.json()).toMatchObject({ status: 'failure', message: 'provider-error' })
      })
    })

    describe('when the provider is already connected', (): void => {
      it('returns fail', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        app.expressApp.use((request: Request, _response: Response, next: NextFunction) => {
          request['authenticatable'] = TestAuthenticatable.findByProviderId('universal', 'any.universal-connected')
          next()
        })
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/connect-provider`, {
          method: 'patch',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: 'universal', token: 'token' })
        })

        expect(response.status).toEqual(202)
        expect(await response.json()).toMatchObject({ status: 'warning', message: 'already-connected' })
      })
    })

    describe('when the provider does not exists', (): void => {
      it('returns fail', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        app.expressApp.use((request: Request, _response: Response, next: NextFunction) => {
          request['authenticatable'] = TestAuthenticatable.findByProviderId('universal', 80085)
          next()
        })
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/connect-provider`, {
          method: 'patch',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: 'nop', token: 'token' })
        })

        expect(response.status).toEqual(400)
        expect(await response.json()).toMatchObject({ status: 'failure', message: 'unknown-provider' })
      })
    })

    describe('when the authenticatable can not be extracted from request (not logged in)', (): void => {
      it('returns unauthorized', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/connect-provider`, {
          method: 'patch',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: 'universal', token: 'token' })
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

        let response = await fetch(`http://localhost:${port}/authentication/connect-provider`, {
          method: 'patch',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ other: false })
        })

        expect(response.status).toEqual(400)
        expect(await response.json()).toMatchObject({ status: 'failure', message: 'request/provider was not provided and is not optional' })
      })
    })
  })
})
