import { initialize } from '../../src'
import { CURRENT_AUTHENTICATION } from '../../src/initialize'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

beforeAll(async (): Promise<void> => {
  await initialize({ dynamicsLocation: './tests/__fixtures__/dynamics', secret: 'my-secret' }, TestAuthenticatable)
})

describe('AuthenticationController', (): void => {
  describe('sign-up', (): void => {
    describe('when a successful signup happens', (): void => {
      it('returns ok and the rendered session data', async (): Promise<void> => {
        await runExpressApp()

        await fPost('authentication/sign-up', {
          attributes: {
            email: 'DAVID@UNIVERSAL.com',
            username: 'david',
            password: '12345678',
            firstName: 'David',
            lastName: 'De Anda',
            name: 'David De Anda'
          },
          credentialKind: 'email'
        })
        expect(fResponse).toHaveReturnedWithStatus('OK')
        expect(fResponseBody).toMatchObject({ status: 'success', authenticatable: {}, sessionToken: '' })
      })
    })

    describe('when the sign up is lacking a requirement like the corroboration token', (): void => {
      beforeAll((): void => {
        CURRENT_AUTHENTICATION.instance.options.email.enableCorroboration = true
      })

      afterAll((): void => {
        CURRENT_AUTHENTICATION.instance.options.email.enableCorroboration = false
      })

      it('returns bad request and message', async (): Promise<void> => {
        await runExpressApp()

        await fPost('authentication/sign-up', {
          attributes: {
            email: 'DAVID@UNIVERSAL.com',
            username: 'david',
            password: '12345678',
            firstName: 'David',
            lastName: 'De Anda',
            name: 'David De Anda'
          },
          credentialKind: 'email'
        })
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({ status: 'failure', message: 'corroboration-required' })
      })
    })

    describe('when the sign up is still processing because of confirmation', (): void => {
      beforeAll((): void => {
        CURRENT_AUTHENTICATION.instance.options.email.enableConfirmation = true
        CURRENT_AUTHENTICATION.instance.options.email.enforceConfirmation = true
      })

      afterAll((): void => {
        CURRENT_AUTHENTICATION.instance.options.email.enableConfirmation = false
        CURRENT_AUTHENTICATION.instance.options.email.enforceConfirmation = false
      })

      it('returns bad request and message', async (): Promise<void> => {
        await runExpressApp()

        await fPost('authentication/sign-up', {
          attributes: {
            email: 'DAVID@UNIVERSAL.com',
            username: 'david',
            password: '12345678',
            firstName: 'David',
            lastName: 'De Anda',
            name: 'David De Anda'
          },
          credentialKind: 'email'
        })
        expect(fResponse).toHaveReturnedWithStatus('ACCEPTED')
        expect(fResponseBody).toMatchObject({ status: 'warning', message: 'confirmation-inbound' })
      })
    })

    describe('when bad parameters are passed', (): void => {
      it('returns bad request', async (): Promise<void> => {
        await runExpressApp()

        await fPost('authentication/sign-up', {})
        expect(fResponse).toHaveReturnedWithStatus('BAD_REQUEST')
        expect(fResponseBody).toMatchObject({ status: 'failure', message: 'request/attributes was not provided and is not optional' })
      })
    })
  })
})
