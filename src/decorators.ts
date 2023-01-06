import { Action, Controller, HTTPVerb } from '@universal-packages/express-controllers'
import { ClassDecoratorFunction, MethodDecoratorFunction } from '@universal-packages/namespaced-decorators'
import { CURRENT_AUTHENTICATION } from './express-controllers-authentication'
import { RouteName } from './types'

export function RegisterAction(method: HTTPVerb, route: RouteName): MethodDecoratorFunction {
  if (CURRENT_AUTHENTICATION.instance) {
    const routeConf = CURRENT_AUTHENTICATION.options.routes[route]

    if (routeConf.enable) {
      return Action(method, routeConf.path)
    }
  }

  return (_target: any, _propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => descriptor
}

export function RegisterController(): ClassDecoratorFunction {
  if (CURRENT_AUTHENTICATION.instance) {
    return Controller(CURRENT_AUTHENTICATION.options.rootPath, {})
  }

  return (): void => {}
}
