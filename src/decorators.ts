import { Action, Controller, HTTPVerb } from '@universal-packages/express-controllers'
import { ClassDecoratorFunction, MethodDecoratorFunction } from '@universal-packages/namespaced-decorators'

import { CURRENT_AUTHENTICATION } from './initialize'

export function RegisterAuthenticationController(module: string): ClassDecoratorFunction {
  if (CURRENT_AUTHENTICATION.instance) {
    const dynamicModule = CURRENT_AUTHENTICATION.instance.options.modules?.[module]

    if (dynamicModule && dynamicModule.enabled) {
      return Controller(CURRENT_AUTHENTICATION.options.rootPath, { bodyParser: 'json' })
    }
  }

  return (): void => {}
}

export function RegisterMainAuthenticationController(): ClassDecoratorFunction {
  if (CURRENT_AUTHENTICATION.instance) {
    return Controller(CURRENT_AUTHENTICATION.options.rootPath, { bodyParser: 'json' })
  }

  return (): void => {}
}

export function RegisterAuthenticationAction(method: HTTPVerb, path: string, module?: string): MethodDecoratorFunction {
  if (CURRENT_AUTHENTICATION.instance) {
    return Action(method, path)
  }

  return (_target: any, _propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => descriptor
}

export function RegisterAuthenticationModuleAction(module: string, method: HTTPVerb, path: string): MethodDecoratorFunction {
  if (CURRENT_AUTHENTICATION.instance) {
    const dynamicModule = CURRENT_AUTHENTICATION.instance.options.modules?.[module]

    if (dynamicModule && dynamicModule.enabled) {
      return Action(method, path)
    }
  }

  return (_target: any, _propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => descriptor
}
