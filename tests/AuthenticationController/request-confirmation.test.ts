import { ExpressApp } from '@universal-packages/express-controllers'
import { NextFunction, Request, Response } from 'express'
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
})

describe('AuthenticationController', (): void => {
  describe('request-confirmation', (): void => {
    describe('when the confirmation request is successful', (): void => {
      beforeAll((): void => {
        CURRENT_AUTHENTICATION.instance.options.email.enableConfirmation = true
      })

      afterAll((): void => {
        CURRENT_AUTHENTICATION.instance.options.email.enableConfirmation = false
      })

      it('returns ok', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        app.expressApp.use((request: Request, _response: Response, next: NextFunction) => {
          request['authenticatable'] = TestAuthenticatable.findByCredential('email-unconfirmed')
          next()
        })
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/request-confirmation`, {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credentialKind: 'email' })
        })

        expect(response.status).toEqual(200)
      })
    })

    describe('when the authenticatable is already confirmed', (): void => {
      beforeAll((): void => {
        CURRENT_AUTHENTICATION.instance.options.email.enableConfirmation = true
      })

      afterAll((): void => {
        CURRENT_AUTHENTICATION.instance.options.email.enableConfirmation = false
      })

      it('returns accepted and does nothing', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        app.expressApp.use((request: Request, _response: Response, next: NextFunction) => {
          request['authenticatable'] = TestAuthenticatable.findByCredential('email.confirmed')
          next()
        })
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/request-confirmation`, {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credentialKind: 'email' })
        })

        expect(response.status).toEqual(202)
      })
    })

    describe('when confirmations are not enabled', (): void => {
      it('returns fail', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        app.expressApp.use((request: Request, _response: Response, next: NextFunction) => {
          request['authenticatable'] = TestAuthenticatable.findByCredential('email-unconfirmed')
          next()
        })
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/request-confirmation`, {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credentialKind: 'email' })
        })

        expect(response.status).toEqual(400)
        expect(await response.json()).toMatchObject({ message: 'confirmation-disabled' })
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

        let response = await fetch(`http://localhost:${port}/authentication/request-confirmation`, {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credentialKind: 'nop' })
        })

        expect(response.status).toEqual(400)
        expect(await response.json()).toMatchObject({
          parameters: 'request/credentialKind does not provide right enum value, valid enum values are [email, phone], "nop" was given'
        })
      })
    })
  })
})
