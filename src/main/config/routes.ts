/* eslint-disable node/no-path-concat */

import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

const routesPath = join(__dirname, '..', 'routes')

export default (app: Express) => {
  const router = Router()
  app.use('/api', router)
  readdirSync(routesPath).map(async (file) => {
    ;(await import(join(routesPath, file))).default(router)
  })
}
