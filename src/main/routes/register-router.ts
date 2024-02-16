import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeUserRegisterUserController } from '../factories'

export default (router: Router) => {
  router.post('/register', adaptRoute(makeUserRegisterUserController()))
}
