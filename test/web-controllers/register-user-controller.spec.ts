import { UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { UseCase } from '@/usecases/ports'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { MissingParamError } from '@/web-controllers/errors'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports/'
import { RegisterUserController } from '@/web-controllers/register-user-controller'
import { InMemoryUserRepository } from '@test/usecases/register-user-on-mailing-list/repository'

describe('Register user web controller', () => {
  const users: UserData[] = []
  const repo: UserRepository = new InMemoryUserRepository(users)
  const usecase: UseCase = new RegisterUserOnMailingList(repo)
  const controller: RegisterUserController = new RegisterUserController(usecase)

  class ErrorThrowingUseCaseStub implements UseCase {
    perform(request: any): Promise<any> {
      throw Error()
    }
  }

  const errorThrowingUseCaseStub: ErrorThrowingUseCaseStub =
    new ErrorThrowingUseCaseStub()

  it('Should return status code 201 when request cotains valid user data', async () => {
    const request: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@email.com',
      },
    }

    const response: HttpResponse = await controller.handle(request)

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual(request.body)
  })

  it('Should return status code 400 when request cotains invalid name', async () => {
    const requestWithInvalidName: HttpRequest = {
      body: {
        name: 'A',
        email: 'any@email.com',
      },
    }

    const response: HttpResponse = await controller.handle(
      requestWithInvalidName
    )

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidNameError)
  })

  it('Should return status code 400 when request cotains invalid name', async () => {
    const requestWithInvalidEmail: HttpRequest = {
      body: {
        name: 'Any Name',
        email: 'anyemailcom',
      },
    }
    const response: HttpResponse = await controller.handle(
      requestWithInvalidEmail
    )

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidEmailError)
  })

  it('Should return status code 400 when request is missing user name', async () => {
    const missingNameRequest: HttpRequest = {
      body: { email: 'any@email.com' },
    }

    const response: HttpResponse = await controller.handle(missingNameRequest)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect(response.body.message as Error).toEqual('Missing params: name')
  })

  it('Should return status code 400 when request is missing user email', async () => {
    const missingEmailRequest: HttpRequest = {
      body: { name: 'Any Name' },
    }

    const response: HttpResponse = await controller.handle(missingEmailRequest)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect(response.body.message as Error).toEqual('Missing params: email')
  })

  it('Should return status code 400 when request is missing name and email', async () => {
    const missingNameAndEmailRequest: HttpRequest = {
      body: {},
    }

    const response: HttpResponse = await controller.handle(
      missingNameAndEmailRequest
    )

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect(response.body.message as Error).toEqual('Missing params: name,email')
  })

  it('should return status code 500 when server raises', async () => {
    const request: HttpRequest = {
      body: {
        name: 'Any Name',
        email: 'any@email.com',
      },
    }

    const controller = new RegisterUserController(errorThrowingUseCaseStub)
    const response: HttpResponse = await controller.handle(request)

    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
