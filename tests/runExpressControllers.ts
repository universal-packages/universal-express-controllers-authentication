import { ExpressControllers } from '@universal-packages/express-controllers'
import { NextFunction, Request, Response } from 'express'

let expressControllers: ExpressControllers

declare global {
  function runExpressControllers(user?: Record<string, any>, debugError?: boolean): Promise<ExpressControllers>
}

global.runExpressControllers = async function runExpressControllers(user?: Record<string, any>, debugError?: boolean): Promise<ExpressControllers> {
  expressControllers = new ExpressControllers({ appLocation: './tests/__fixtures__', port: fDefaultPort })

  if (user) {
    expressControllers.expressControllers.use((request: Request, _response: Response, next: NextFunction) => {
      request['user'] = user
      next()
    })
  }

  if (debugError) expressControllers.on('request/error', console.log)

  await expressControllers.prepare()
  await expressControllers.run()

  return expressControllers
}

afterEach(async (): Promise<void> => {
  if (expressControllers) await expressControllers.stop()

  expressControllers = undefined
})
