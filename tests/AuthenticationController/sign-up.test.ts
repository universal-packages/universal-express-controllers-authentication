import { ExpressApp } from '@universal-packages/express-controllers'
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
  describe('sign-up', (): void => {
    describe('when a successful signup happens', (): void => {
      it('returns ok and the rendered session data', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/sign-up`, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            attributes: {
              email: 'DAVID@UNIVERSAL.com',
              username: 'david',
              password: '12345678',
              firstName: 'David',
              lastName: 'De Anda',
              name: 'David De Anda'
            },
            credentialKind: 'email'
          })
        })
        expect(response.status).toEqual(200)
        expect(await response.json()).toMatchObject({ authenticatable: {}, sessionToken: '' })
      })
    })

    describe('when the sign up is lacking a requirement like the corroboration token', (): void => {
      beforeAll((): void => {
        CURRENT_AUTHENTICATION.instance.options.email.enableCorroboration = true
      })

      afterAll((): void => {
        CURRENT_AUTHENTICATION.instance.options.email.enableCorroboration = false
      })

      it('returns bad request and message', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/sign-up`, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            attributes: {
              email: 'DAVID@UNIVERSAL.com',
              username: 'david',
              password: '12345678',
              firstName: 'David',
              lastName: 'De Anda',
              name: 'David De Anda'
            },
            credentialKind: 'email'
          })
        })
        expect(response.status).toEqual(400)
        expect(await response.json()).toMatchObject({ message: 'corroboration-required' })
      })
    })

    describe('when the sign up is still processing because of confirmation', (): void => {
      beforeAll((): void => {
        CURRENT_AUTHENTICATION.instance.options.email.enableConfirmation = true
        CURRENT_AUTHENTICATION.instance.options.email.enforceConfirmation = true
      })

      afterAll((): void => {
        CURRENT_AUTHENTICATION.instance.options.email.enableConfirmation = false
        CURRENT_AUTHENTICATION.instance.options.email.enforceConfirmation = false
      })

      it('returns bad request and message', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/sign-up`, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            attributes: {
              email: 'DAVID@UNIVERSAL.com',
              username: 'david',
              password: '12345678',
              firstName: 'David',
              lastName: 'De Anda',
              name: 'David De Anda'
            },
            credentialKind: 'email'
          })
        })
        expect(response.status).toEqual(202)
        expect(await response.json()).toMatchObject({ message: 'confirmation-inbound' })
      })
    })

    describe('when bad parameters are passed', (): void => {
      it('returns bad request', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/sign-up`, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attributes: {} })
        })
        expect(response.status).toEqual(400)
        expect(await response.json()).toMatchObject({ parameters: 'request/credentialKind was not provided and is not optional' })
      })
    })
  })
})
