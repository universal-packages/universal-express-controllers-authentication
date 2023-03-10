import { AuthDynamicNames as AN, Authenticatable, Authentication, AuthenticationOptions, SignUpPayload, UpdateAuthenticatablePayload } from '@universal-packages/authentication'
import { HTTPVerb } from '@universal-packages/express-controllers'
import { Parameters } from '@universal-packages/parameters'
import { Request, Response } from 'express'

export type RouteName =
  | 'connectProvider'
  | 'continueWithProvider'
  | 'invite'
  | 'logIn'
  | 'requestConfirmation'
  | 'requestCorroboration'
  | 'requestMultiFactor'
  | 'requestPasswordReset'
  | 'signUp'
  | 'updateAuthenticatable'
  | 'updateCredential'
  | 'verifyConfirmation'
  | 'verifyCorroboration'
  | 'verifyMultiFactor'
  | 'verifyPasswordReset'
  | 'verifyUnlock'

export interface ExpressControllerAuthenticationOptions extends AuthenticationOptions {
  rootPath?: string
  routes?: AuthenticationRoutes
}

export type AuthenticationRoutes = {
  [route in RouteName]?: AuthenticationRoute
}

export interface AuthenticationRoute {
  enable?: boolean
  method?: HTTPVerb
  path?: string
}

export interface CurrentAuthentication {
  instance: Authentication<AuthDynamicNames>
  options: ExpressControllerAuthenticationOptions
}

export interface AuthDynamicNames extends AN {
  'authenticatable-from-request': { payload: AuthenticatableFromRequestPayload; result: Authenticatable }
  'render-authentication-response': { payload: RenderAuthenticationResponsePayload; result: Record<string, any> }
  'set-session': { payload: SetSessionPayload; result: string }
  'shape-sign-up-parameters': { payload: ShapeSignUpParametersPayload; result: SignUpPayload }
  'shape-update-authenticatable-parameters': { payload: ShapeUpdateAuthenticatableParametersPayload; result: UpdateAuthenticatablePayload }
}

export interface AuthenticatableFromRequestPayload {
  request: Request
}

export interface RenderAuthenticationResponsePayload {
  authenticatable: Authenticatable
  sessionToken?: string
}

export interface SetSessionPayload {
  authenticatable: Authenticatable
  request: Request
  response: Response
}

export interface ShapeSignUpParametersPayload {
  parameters: Parameters
}

export interface ShapeUpdateAuthenticatableParametersPayload {
  parameters: Parameters
}
