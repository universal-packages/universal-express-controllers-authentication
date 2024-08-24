import { initialize } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe('DefaultModuleController', (): void => {
  describe('when the default module is disabled', (): void => {
    beforeAll(async (): Promise<void> => {
      await initialize(
        {
          dynamicsLocation: './tests/__fixtures__/dynamics',
          secret: 'my-secret',
          defaultModule: { enabled: false }
        },
        TestAuthenticatable
      )
    })

    it('does not enable the controller routes', async (): Promise<void> => {
      await runExpressControllers()

      await fPost('authentication/log-in', { email: 'email', password: 'password' })
      expect(fResponse).toHaveReturnedWithStatus('NOT_FOUND')
    })
  })
})
