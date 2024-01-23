import { UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/usecases'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { badRequest, created, missingParams } from './util'
import { MissingParamError } from './errors'

export class RegisterUserController {
  constructor(private useCase: RegisterUserOnMailingList) {
    this.useCase = useCase
  }

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    const userData: UserData = request.body as UserData
    const response = await this.useCase.registerUserOnMailingList(userData)

    const messageError = missingParams(['name', 'email'], request.body)
    if (messageError) {
      return badRequest(new MissingParamError(messageError))
    }

    if (response.isLeft()) {
      return badRequest(response.value)
    }

    return created(response.value)
  }
}
