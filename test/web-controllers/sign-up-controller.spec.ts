import { UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/usecases'
import { UserRepository } from '@/usecases/ports'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports/'
import { RegisterUserController } from '@/web-controllers/register-user-controller'
import { InMemoryUserRepository } from '@test/usecases/register-user-on-mailing-list/repository'

describe('Register user web controller', () => {
  it('Should return status code 201 when request cotains valid user data', async () => {
    const request: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@email.com',
      },
    }
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(
      repo
    )
    const controller: RegisterUserController = new RegisterUserController(
      usecase
    )
    const response: HttpResponse | void = await controller.handle(request)

    expect(response?.statusCode).toEqual(201)
    expect(response?.body).toEqual(request.body)
  })
})
