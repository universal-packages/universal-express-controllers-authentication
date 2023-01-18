import { Authenticatable, CredentialKind, Encrypt } from '@universal-packages/authentication'

export default class TestAuthenticatable implements Authenticatable {
  public static lastInstance: TestAuthenticatable

  public static readonly findByCredential = jest.fn().mockImplementation((credential: string): TestAuthenticatable => {
    return this.instanceFromInput(credential)
  })

  public static readonly findById = jest.fn().mockImplementation((id: string | number | bigint): TestAuthenticatable => {
    return this, this.instanceFromInput(String(id))
  })

  public static readonly findByProviderId = jest.fn().mockImplementation((_provider: string, id: string | number | bigint): TestAuthenticatable => {
    return this, this.instanceFromInput(String(id))
  })

  public static readonly existsWithCredential = jest.fn().mockImplementation((_credentialKind: CredentialKind, credential: string): boolean => {
    switch (credential) {
      case 'exists@email.com':
      case '+524491234567':
        return true
    }

    return false
  })

  public static readonly existsWithUsername = jest.fn().mockImplementation((username: string): boolean => {
    switch (username) {
      case 'exists':
        return true
    }

    return false
  })

  public constructor() {
    TestAuthenticatable.lastInstance = this
  }

  id: number = 69

  email?: string = null
  emailConfirmedAt?: Date = null

  phone?: string = null
  phoneConfirmedAt?: Date = null

  username?: string = null

  failedLogInAttempts?: number = 0
  lockedAt?: Date = null

  logInCount?: number = 0

  multiFactorEnabled?: boolean = null
  multiFactorActiveAt?: Date = null

  @Encrypt()
  password?: string
  encryptedPassword?: string = null

  firstName?: string = null
  lastName?: string = null
  name?: string = null

  inviterId?: number = null

  createdAt?: Date = null

  public readonly save = jest.fn().mockImplementation(() => {
    if (!this.createdAt) this.createdAt = new Date()
  })

  private static instanceFromInput(input: string): TestAuthenticatable {
    const instance = new TestAuthenticatable()
    const inputSplit = input.split('.')

    instance.password = 'password'
    instance.createdAt = new Date(Date.now() - 10000)

    const credentialKind = inputSplit[0]
    const directives = (inputSplit[1] || '').split(',')

    instance[credentialKind] = input

    for (let i = 0; i < directives.length; i++) {
      switch (directives[i]) {
        case 'about-to-lock':
          instance.failedLogInAttempts = 2
          break

        case 'nothing':
          return

        case 'confirmed':
          instance[`${credentialKind}ConfirmedAt`] = new Date()
          break

        case 'locked':
          instance.failedLogInAttempts = 3
          instance.lockedAt = new Date()
          break

        case 'multi-factor-enabled':
          instance.multiFactorEnabled = true
          break

        case 'multi-factor-active':
          instance.multiFactorActiveAt = new Date(Date.now() - 10000)
          break

        case 'multi-factor-active-confirmed':
          instance[`${credentialKind}ConfirmedAt`] = new Date()
          instance.multiFactorActiveAt = new Date(Date.now() - 10000)
          break

        case 'multi-factor-active-unconfirmed':
          instance[`${credentialKind}ConfirmedAt`] = null
          instance.multiFactorActiveAt = new Date(Date.now() - 10000)
          break

        case 'multi-factor-inactive':
          instance.multiFactorActiveAt = null
          break

        case 'no-password':
          instance.encryptedPassword = null
          break

        case 'ready-to-unlock':
          instance.failedLogInAttempts = 5
          instance.lockedAt = new Date(Date.now() - 10000)
          break

        case 'unconfirmed':
          instance[`${credentialKind}ConfirmedAt`] = null
          break

        case 'universal-connected':
          instance['universalId'] = 80085
          break
      }
    }

    return instance
  }
}
