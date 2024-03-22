import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { RegisterUserController } from '@/web-controllers/register-and-send-email-controller'
import { MongodbUserRepository } from '@/external/repositories/mongodb/mongodb-user-repository'

export const makeUserRegisterUserController = (): RegisterUserController => {
  const inMemoryUserRepository = new MongodbUserRepository()
  const registerUserOnMailingListUseCase = new RegisterUserOnMailingList(
    inMemoryUserRepository
  )
  const registerUserController = new RegisterUserController(
    registerUserOnMailingListUseCase
  )
  return registerUserController
}
