import TestAuthenticatable from './__fixtures__/TestAuthenticatable'

jest.retryTimes(process.env.CI ? 2 : 0)
jest.setTimeout(10000)

beforeEach((): void => {
  TestAuthenticatable.lastInstance = undefined
})
