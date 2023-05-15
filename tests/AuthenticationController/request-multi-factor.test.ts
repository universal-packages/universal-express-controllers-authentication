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
  describe('request-multi-factor', (): void => {
    describe('when the multi-factor request is successful', (): void => {
      it('returns ok', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/request-multi-factor`, {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: 'email.multi-factor-active' })
        })

        expect(response.status).toEqual(200)
        expect(await response.json()).toMatchObject({ status: 'success' })
      })
    })

    describe('when the authenticatable is not active for multi factor', (): void => {
      it('returns fail', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/request-multi-factor`, {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: 'email' })
        })

        expect(response.status).toEqual(202)
        expect(await response.json()).toMatchObject({ status: 'warning', message: 'nothing-to-do' })
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

        let response = await fetch(`http://localhost:${port}/authentication/request-multi-factor`, {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        })

        expect(response.status).toEqual(400)
        expect(await response.json()).toMatchObject({
          status: 'failure',
          message: 'request/credential was not provided and is not optional'
        })
      })
    })
  })
})
