import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { UseCase } from '../ports'
import { RegisterUserOnMailingList } from '../register-user-on-mailing-list'
import { SendEmail } from '../send-email/send-email'
import { User, UserData } from '@/entities'
import { Either, left, right } from '@/shared'
import { MailServiceError } from '../errors/mail-service-error'

export class RegisterAndSendEmail implements UseCase {
  private registerUser: RegisterUserOnMailingList
  private sendEmail: SendEmail

  constructor(registerUser: RegisterUserOnMailingList, sendEmail: SendEmail) {
    this.registerUser = registerUser
    this.sendEmail = sendEmail
  }

  async perform(
    request: UserData
  ): Promise<
    Either<InvalidNameError | InvalidEmailError | MailServiceError, User>
  > {
    const userOrError: Either<InvalidNameError | InvalidEmailError, User> =
      User.create(request)

    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }

    const user: User = userOrError.value

    await this.registerUser.perform(user)
    const result = await this.sendEmail.perform(user)

    if (result.isLeft()) {
      return left(result.value)
    }

    return right(user)
  }
}
