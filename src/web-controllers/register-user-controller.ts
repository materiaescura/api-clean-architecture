import { UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/usecases'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { badRequest, created } from './util'

export class RegisterUserController {
  constructor(private useCase: RegisterUserOnMailingList) {
    this.useCase = useCase
  }

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    const userData: UserData = request.body as UserData
    const response = await this.useCase.registerUserOnMailingList(userData)

    if (response.isLeft()) {
      return badRequest(response.value)
    }

    return created(response.value)
  }
}
