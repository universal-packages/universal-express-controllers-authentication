import { Authenticatable } from '@universal-packages/authentication'
import { ExpressControllers } from '@universal-packages/express-controllers'
import { NextFunction, Request, Response } from 'express'

let currentApp: ExpressControllers

declare global {
  function runExpressControllers(authenticatable?: Authenticatable, debugError?: boolean): Promise<ExpressControllers>
}

global.runExpressControllers = async function setAppLocation(authenticatable?: Authenticatable, debugError?: boolean): Promise<ExpressControllers> {
  currentApp = new ExpressControllers({ appLocation: './tests/__fixtures__', port: fDefaultPort })

  if (authenticatable) {
    currentApp.expressControllers.use((request: Request, _response: Response, next: NextFunction) => {
      request['authenticatable'] = authenticatable
      next()
    })
  }

  if (debugError) currentApp.on('request/error', console.log)

  await currentApp.prepare()
  await currentApp.run()

  return currentApp
}

afterEach(async (): Promise<void> => {
  if (currentApp) currentApp.stop()

  currentApp = undefined
})
