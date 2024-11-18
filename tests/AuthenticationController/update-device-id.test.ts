import { initialize } from '../../src'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' })
})

describe('AuthenticationController', (): void => {
  describe('update-device-id', (): void => {
    describe('when an user is in session', (): void => {
      it('returns ok and sets the device id', async (): Promise<void> => {
        await runExpressControllers({ id: 99, email: 'david@universal-packages.com' })

        await fPatch('authentication/update-device-id', { deviceId: 'my-device-id' })
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toMatchObject({ status: 'success' })
      })
    })

    describe('when no user is in session', (): void => {
      it('returns forbidden', async (): Promise<void> => {
        await runExpressControllers()

        await fPatch('authentication/update-device-id', { deviceId: 'my-device-id' })
        expect(fResponse).toHaveReturnedWithStatus('UNAUTHORIZED')
      })
    })

    describe('when bad params are passed', (): void => {
      it('returns bad request', async (): Promise<void> => {
        await runExpressControllers({ id: 99, email: 'david@universal-packages.com' })

        await fPatch('authentication/update-device-id')
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({ status: 'failure', message: 'request/deviceId was not provided and is not optional' })
      })
    })
  })
})
