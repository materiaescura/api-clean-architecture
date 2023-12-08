import { Either, left, right } from '@/shared'
import { Email, Name, UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'

type UserError = InvalidNameError | InvalidEmailError

export class User {
  public readonly name: Name
  public readonly email: Email

  constructor(name: Name, email: Email) {
    this.name = name
    this.email = email
  }
  static create(userData: UserData): Either<UserError, User> {
    const nameOrError = Name.create(userData.name)
    if (nameOrError.isLeft()) return left(nameOrError.value)

    const emailOrError = Email.create(userData.email)
    if (emailOrError.isLeft()) return left(emailOrError.value)

    const name = nameOrError.value as Name
    const email = emailOrError.value as Email

    return right(new User(name, email))
  }
}
