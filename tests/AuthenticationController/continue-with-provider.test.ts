import { ExpressApp } from '@universal-packages/express-controllers'
import fetch from 'node-fetch'
import { initialize } from '../../src'
import { CURRENT_AUTHENTICATION } from '../../src/express-controllers-authentication'
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
  describe('continue-with-provider', (): void => {
    describe('when a successful connection happens', (): void => {
      it('returns ok and the rendered session data', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/continue-with-provider`, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: 'universal', token: 'token' })
        })

        expect(response.status).toEqual(200)
        expect(await response.json()).toMatchObject({ authenticatable: { universalId: 'any.nothing' }, sessionToken: '' })
      })
    })

    describe('when an error occurs when calling the provider', (): void => {
      it('returns fail', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/continue-with-provider`, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: 'universal', token: 'error' })
        })

        expect(response.status).toEqual(400)
        expect(await response.json()).toMatchObject({ message: 'provider-error' })
      })
    })

    describe('when the provider does not exists', (): void => {
      it('returns fail', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/continue-with-provider`, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: 'nop', token: 'token' })
        })

        expect(response.status).toEqual(400)
        expect(await response.json()).toMatchObject({ provider: 'unknown' })
      })
    })

    describe('when bad parameters are present', (): void => {
      it('returns fail', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/continue-with-provider`, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ other: false })
        })

        expect(response.status).toEqual(400)
        expect(await response.json()).toMatchObject({ parameters: 'request/provider was not provided and is not optional' })
      })
    })
  })
})
