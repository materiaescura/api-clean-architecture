import express from 'express'
import setupMiddleware from '@/main/config/middleware'
import setupRouter from '@/main/config/routes'

const app = express()
setupMiddleware(app)
setupRouter(app)
export default app
