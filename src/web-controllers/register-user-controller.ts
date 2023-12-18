import { UserData } from '@/entities'
import { RegisterUserOnMailingList } from '@/usecases'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports'
import { created } from './util'

export class RegisterUserController {
  constructor(private useCase: RegisterUserOnMailingList) {
    this.useCase = useCase
  }

  public async handle(request: HttpRequest): Promise<HttpResponse | void> {
    const userData: UserData = request.body as UserData
    const response = await this.useCase.registerUserOnMailingList(userData)

    if (response.isRight()) {
      return created(response.value)
    }
  }
}
