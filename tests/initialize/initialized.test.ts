import { ExpressApp } from '@universal-packages/express-controllers'

import { initialize } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

const port = 4000 + Number(process.env['JEST_WORKER_ID'])

describe('initialize', (): void => {
  describe('disable-routes', (): void => {
    it('disable routes if configured', async (): Promise<void> => {
      // Just to check controller registration when no initialization has taken place
      const app = new ExpressApp({ appLocation: './tests/__fixtures__/controllers', port })
      app.on('request/error', console.log)
      await app.prepare()

      await initialize({ debug: true, dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' }, TestAuthenticatable)

      let error: Error

      try {
        await initialize({ debug: true, dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' }, TestAuthenticatable)
      } catch (err) {
        error = err
      }

      expect(error.message).toEqual('Authentication already initialized')
    })
  })
})
