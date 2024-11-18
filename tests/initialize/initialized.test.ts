import { initialize } from '../../src'

describe(initialize, (): void => {
  describe('disable-routes', (): void => {
    it('disable routes if configured', async (): Promise<void> => {
      // Just to check controller registration when no initialization has taken place
      await runExpressControllers()

      await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' })

      let error: Error

      try {
        await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' })
      } catch (err) {
        error = err
      }

      expect(error.message).toEqual('Authentication already initialized')
    })
  })
})
