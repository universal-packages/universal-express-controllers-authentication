import { AuthDynamicNames as AN, Authenticatable, Authentication, AuthenticationOptions } from '@universal-packages/authentication'
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
  'set-session': { payload: SetSessionPayload; result: string }
  'render-authentication-response': { payload: RenderAuthenticationResponsePayload; result: Record<string, any> }
}

export interface SetSessionPayload {
  authenticatable: Authenticatable
  request: Request
  response: Response
}

export interface RenderAuthenticationResponsePayload {
  authenticatable: Authenticatable
  sessionToken: string
}
