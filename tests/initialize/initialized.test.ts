import { initialize } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe(initialize, (): void => {
  describe('disable-routes', (): void => {
    it('disable routes if configured', async (): Promise<void> => {
      // Just to check controller registration when no initialization has taken place
      await runExpressControllers()

      await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' }, TestAuthenticatable)

      let error: Error

      try {
        await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' }, TestAuthenticatable)
      } catch (err) {
        error = err
      }

      expect(error.message).toEqual('Authentication already initialized')
    })
  })
})
