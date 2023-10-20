import { ExpressApp } from '@universal-packages/express-controllers'
import { NextFunction, Request, Response } from 'express'

import { initialize } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

const port = 4000 + Number(process.env['JEST_WORKER_ID'])

let app: ExpressApp
afterEach(async (): Promise<void> => {
  await app.stop()
})

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' }, TestAuthenticatable)
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

        await fPatch('authentication/update-credential', { credential: 'new@email.com', credentialKind: 'email' })
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toMatchObject({ status: 'success', authenticatable: { email: 'new@email.com' } })
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

        await fPatch('authentication/update-credential', { credential: 'new', credentialKind: 'email' })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({ status: 'failure', validation: { errors: { email: ['invalid-email'] }, valid: false } })
      })
    })

    describe('when the authenticatable can not be extracted from request (not logged in)', (): void => {
      it('returns unauthorized', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        await fPatch('authentication/update-credential', { credential: 'new', credentialKind: 'email' })
        expect(fResponse).toHaveReturnedWithStatus('UNAUTHORIZED')
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

        await fPatch('authentication/update-credential', { credentialKind: 'email' })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({ status: 'failure', message: 'request/credential was not provided and is not optional' })
      })
    })
  })
})
