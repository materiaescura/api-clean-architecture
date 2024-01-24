import { UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { badRequest, created, missingParams, serverError } from './util'
import { MissingParamError } from './errors'
import { UseCase } from '@/usecases/ports'

export class RegisterUserController {
  constructor(private useCase: UseCase) {
    this.useCase = useCase
  }

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const messageError = missingParams(['name', 'email'], request.body)
      if (messageError) {
        return badRequest(new MissingParamError(messageError))
      }

      const userData: UserData = request.body as UserData
      const response = await this.useCase.perform(userData)

      if (response.isLeft()) {
        return badRequest(response.value)
      }

      return created(response.value)
    } catch (error) {
      return serverError(error)
    }
  }
}
