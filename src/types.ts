import { AuthDynamicNames as AN, Authenticatable, Authentication, AuthenticationOptions } from '@universal-packages/authentication'
import { Parameters } from '@universal-packages/parameters'
import { Request, Response } from 'express'

export interface ExpressControllerAuthenticationOptions extends AuthenticationOptions {
  rootPath?: string
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
