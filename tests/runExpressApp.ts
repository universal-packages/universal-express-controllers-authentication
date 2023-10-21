import { Authenticatable } from '@universal-packages/authentication'
import { ExpressApp } from '@universal-packages/express-controllers'
import { NextFunction, Request, RequestHandler, Response } from 'express'

let currentApp: ExpressApp

declare global {
  function runExpressApp(authenticatable?: Authenticatable, debugError?: boolean): Promise<ExpressApp>
}

global.runExpressApp = async function setAppLocation(authenticatable?: Authenticatable, debugError?: boolean): Promise<ExpressApp> {
  currentApp = new ExpressApp({ appLocation: './tests/__fixtures__', port: fDefaultPort })

  if (authenticatable) {
    currentApp.expressApp.use((request: Request, _response: Response, next: NextFunction) => {
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
