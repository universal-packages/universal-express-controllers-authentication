import { AuthDynamicNames as AN, Authenticatable, Authentication, AuthenticationOptions, SignUpPayload, UpdateAuthenticatablePayload } from '@universal-packages/authentication'
import { HTTPVerb } from '@universal-packages/express-controllers'
import { Parameters } from '@universal-packages/parameters'
import { Request, Response } from 'express'

export type RouteName =
  | 'connectProvider'
  | 'continueWithProvider'
  | 'invite'
  | 'logIn'
  | 'logOut'
  | 'me'
  | 'requestConfirmation'
  | 'requestCorroboration'
  | 'requestMultiFactor'
  | 'requestPasswordReset'
  | 'requestUnlock'
  | 'sessions'
  | 'signUp'
  | 'updateAuthenticatable'
  | 'updateCredential'
  | 'updateDeviceId'
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
  'render-authenticatable': { payload: RenderAuthenticatablePayload; result: Record<string, any> }
  'render-sessions': { payload: RenderSessionsPayload; result: Record<string, any> }
  'set-session': { payload: SetSessionPayload; result: string }
  'set-session-device-id': { payload: SetSessionDeviceIdPayload; result: void }
  'shape-sign-up-parameters': { payload: ShapeSignUpParametersPayload; result: SignUpPayload }
  'shape-update-authenticatable-parameters': { payload: ShapeUpdateAuthenticatableParametersPayload; result: UpdateAuthenticatablePayload }
  'unset-session': { payload: UnsetSessionPayload; result: void }
}

export interface AuthenticatableFromRequestPayload {
  request: Request
}

export interface RenderAuthenticatablePayload {
  authenticatable: Authenticatable
}

export interface RenderSessionsPayload {
  authenticatable: Authenticatable
  request: Request
}

export interface SetSessionPayload {
  authenticatable: Authenticatable
  request: Request
  response: Response
}

export interface SetSessionDeviceIdPayload {
  authenticatable: Authenticatable
  request: Request
  deviceId: string
}

export interface ShapeSignUpParametersPayload {
  parameters: Parameters
}

export interface ShapeUpdateAuthenticatableParametersPayload {
  parameters: Parameters
}

export interface UnsetSessionPayload {
  authenticatable: Authenticatable
  request: Request
  sessionId?: string
}
