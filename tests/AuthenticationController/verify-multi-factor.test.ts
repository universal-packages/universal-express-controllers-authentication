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
  describe('verify-multi-factor', (): void => {
    describe('when the multi-factor verification is successful', (): void => {
      it('returns ok', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        const oneTimePassword = CURRENT_AUTHENTICATION.instance.performDynamicSync('generate-one-time-password', {
          concern: 'multi-factor',
          identifier: 'email.multi-factor-active'
        })

        let response = await fetch(`http://localhost:${port}/authentication/verify-multi-factor`, {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: 'email.multi-factor-active', oneTimePassword })
        })

        expect(response.status).toEqual(200)
        expect(await response.json()).toMatchObject({ status: 'success', authenticatable: {}, sessionToken: '' })
      })
    })

    describe('when the verification fails', (): void => {
      it('returns fail', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/verify-multi-factor`, {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: 'email.multi-factor-active', oneTimePassword: 'nop' })
        })

        expect(response.status).toEqual(400)
        expect(await response.json()).toMatchObject({ status: 'failure', message: 'invalid-one-time-password' })
      })
    })

    describe('when bad parameters are present', (): void => {
      it('returns fail', async (): Promise<void> => {
        app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
        app.on('request/error', console.log)
        await app.prepare()
        await app.run()

        let response = await fetch(`http://localhost:${port}/authentication/verify-multi-factor`, {
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
