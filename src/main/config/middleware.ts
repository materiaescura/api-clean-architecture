import { Express } from 'express'
import { bodyParser } from '@/main/middleware/body-parser'
import { cors } from '@/main/middleware/cors'
import { contentType } from '@/main/middleware/content-type'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
}
