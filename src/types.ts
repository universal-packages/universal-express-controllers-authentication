import { Authentication, AuthenticationOptions, DefaultModuleDynamicNames, UserPayload } from '@universal-packages/authentication'
import { Parameters } from '@universal-packages/parameters'
import { Request, Response } from 'express'

export interface ExpressControllerAuthenticationOptions extends AuthenticationOptions {
  rootPath?: string
}

export interface CurrentAuthentication {
  instance: Authentication<ExpressControllersAuthDynamicNames>
  options: ExpressControllerAuthenticationOptions
}

export interface ExpressControllersAuthDynamicNames<U = Record<string, any>> extends DefaultModuleDynamicNames<U> {
  'user-from-request': { payload: UserFromRequestPayload; result: U }
  'render-user': { payload: UserPayload<U>; result: Record<string, any> }
  'render-sessions': { payload: RenderSessionsPayload<U>; result: Record<string, any> }
  'set-session': { payload: SetSessionPayload<U>; result: string }
  'set-session-device-id': { payload: SetSessionDeviceIdPayload<U>; result: void }
  'unset-session': { payload: UnsetSessionPayload<U>; result: void }
}

export interface UserFromRequestPayload {
  request: Request
}

export interface RenderSessionsPayload<U = Record<string, any>> {
  user: U
  request: Request
}

export interface SetSessionPayload<U = Record<string, any>> {
  user: U
  request: Request
  response: Response
}

export interface SetSessionDeviceIdPayload<U = Record<string, any>> {
  user: U
  request: Request
  deviceId: string
}

export interface ShapeSignUpParametersPayload {
  parameters: Parameters
}

export interface ShapeUpdateUserParametersPayload {
  parameters: Parameters
}

export interface UnsetSessionPayload<U = Record<string, any>> {
  user: U
  request: Request
  sessionId?: string
}
