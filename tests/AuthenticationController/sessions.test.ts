import { ExpressApp } from '@universal-packages/express-controllers'
import fetch from 'node-fetch'
import { initialize } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'
import { NextFunction, Request, Response } from 'express'

const port = 4000 + Number(process.env['JEST_WORKER_ID'])

let app: ExpressApp
afterEach(async (): Promise<void> => {
  await app.stop()
})

beforeAll(async (): Promise<void> => {
  await initialize({ debug: true, dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' }, TestAuthenticatable)
})

describe('AuthenticationController', (): void => {
  describe('sessions', (): void => {
    describe('when an authenticatable is in session', (): void => {
      it('returns ok and renders the sessions', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        app.expressApp.use((request: Request, _response: Response, next: NextFunction) => {
          request['authenticatable'] = TestAuthenticatable.findByCredential('email-confirmed')
          next()
        })
        await app.prepare()
        await app.run()

        const response = await fetch(`http://localhost:${port}/authentication/sessions`, { headers: { 'Content-Type': 'application/json' } })
        expect(response.status).toEqual(200)
        expect(await response.json()).toEqual({})
      })
    })

    describe('when no authenticatable is in session', (): void => {
      it('returns forbidden', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/sessions`, { headers: { 'Content-Type': 'application/json' } })
        expect(response.status).toEqual(401)
      })
    })
  })
})