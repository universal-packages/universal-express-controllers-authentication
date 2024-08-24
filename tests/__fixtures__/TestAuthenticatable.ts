import { DefaultModuleAuthenticatable, Encrypt } from '@universal-packages/authentication'

export default class TestAuthenticatable implements DefaultModuleAuthenticatable {
  public static lastInstance: TestAuthenticatable

  public static readonly fromEmail = jest.fn().mockImplementation((email: string): TestAuthenticatable => {
    if (!email.includes('invalid')) {
      const instance = new TestAuthenticatable()
      instance.password = 'password'
      instance.email = email
      instance.id = 69

      return instance
    }
  })

  public static readonly fromId = jest.fn().mockImplementation((id: number): TestAuthenticatable => {
    if (id !== 0) {
      const instance = new TestAuthenticatable()
      instance.password = 'password'
      instance.email = 'david@universal-packages.com'
      instance.id = id

      return instance
    }
  })

  public static readonly existsWithEmail = jest.fn().mockImplementation((email: string): boolean => {
    return email.includes('exists')
  })

  public constructor() {
    TestAuthenticatable.lastInstance = this
  }

  id: number = 69

  email: string = null

  @Encrypt()
  password: string
  encryptedPassword: string = null

  public readonly save = jest.fn().mockImplementation(() => {
    return this
  })
}
