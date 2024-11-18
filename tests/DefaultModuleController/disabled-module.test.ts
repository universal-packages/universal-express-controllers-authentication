import { initialize } from '../../src'

describe('DefaultModuleController', (): void => {
  describe('when the default module is disabled', (): void => {
    beforeAll(async (): Promise<void> => {
      await initialize({
        dynamicsLocation: './tests/__fixtures__/dynamics',
        secret: 'my-secret',
        defaultModule: { enabled: false }
      })
    })

    it('does not enable the controller routes', async (): Promise<void> => {
      await runExpressControllers()

      await fPost('authentication/log-in', { email: 'email', password: 'password' })
      expect(fResponse).toHaveReturnedWithStatus('NOT_FOUND')
    })
  })
})
