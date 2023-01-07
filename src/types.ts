import { AuthDynamicNames as AN, Authenticatable, Authentication, AuthenticationOptions, LogInPayload, SignUpPayload } from '@universal-packages/authentication'
import { Parameters } from '@universal-packages/parameters'
import { Request, Response } from 'express'

export type RouteName = 'logIn' | 'signUp' | 'verifyUnlock'

export interface ExpressControllerAuthenticationOptions extends AuthenticationOptions {
  rootPath?: string
  routes?: AuthenticationRoutes
}

export type AuthenticationRoutes = {
  [route in RouteName]: AuthenticationRoute
}

export interface AuthenticationRoute {
  enable: boolean
  path: string
}

export interface CurrentAuthentication {
  instance: Authentication<AuthDynamicNames>
  options: ExpressControllerAuthenticationOptions
}

export interface AuthDynamicNames extends AN {
  'render-authentication-response': { payload: RenderAuthenticationResponsePayload; result: Record<string, any> }
  'set-session': { payload: SetSessionPayload; result: string }
  'shape-sign-up-parameters': { payload: ShapeSignUpParametersPayload; result: SignUpPayload }
}

export interface RenderAuthenticationResponsePayload {
  authenticatable: Authenticatable
  sessionToken: string
}

export interface SetSessionPayload {
  authenticatable: Authenticatable
  request: Request
  response: Response
}

export interface ShapeSignUpParametersPayload {
  parameters: Parameters
}
