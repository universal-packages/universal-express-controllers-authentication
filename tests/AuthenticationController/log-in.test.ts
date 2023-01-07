import { ExpressApp } from '@universal-packages/express-controllers'
import fetch from 'node-fetch'
import { initialize } from '../../src'
import { CURRENT_AUTHENTICATION } from '../../src/express-controllers-authentication'
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
  describe('log-in', (): void => {
    describe('when a successful log in happens', (): void => {
      it('returns ok and the rendered session data', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/log-in`, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: 'email', password: 'password' })
        })
        expect(response.status).toEqual(200)
        expect(await response.json()).toMatchObject({ authenticatable: {}, sessionToken: '' })
      })
    })

    describe('when the log in attempt fails', (): void => {
      it('returns bad request', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/log-in`, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: 'email', password: 'nop' })
        })
        expect(response.status).toEqual(400)
      })
    })

    describe('when the log in is still processing because of multi factor or confirmation', (): void => {
      beforeAll((): void => {
        CURRENT_AUTHENTICATION.instance.options.email.enableConfirmation = true
        CURRENT_AUTHENTICATION.instance.options.email.enforceConfirmation = true
      })

      afterAll((): void => {
        CURRENT_AUTHENTICATION.instance.options.email.enableConfirmation = false
        CURRENT_AUTHENTICATION.instance.options.email.enforceConfirmation = false
      })

      it('returns accepted', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/log-in`, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: 'email-unconfirmed', password: 'password' })
        })
        expect(response.status).toEqual(202)
        expect(await response.json()).toEqual({
          message: 'confirmation-required',
          metadata: {
            credential: 'email-unconfirmed',
            credentialKind: 'email'
          }
        })
      })
    })

    describe('when bad parameters are passed', (): void => {
      it('returns bad request', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/log-in`, { method: 'post' })
        expect(response.status).toEqual(400)
        expect(await response.json()).toMatchObject({ parameters: 'request/credential was not provided and is not optional' })
      })
    })
  })
})
