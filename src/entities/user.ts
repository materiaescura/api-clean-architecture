import { Either, Right, left, right } from '../shared/either'
import { Email } from './email'
import { InvalidEmailError } from './errors/invalid-email-error'
import { InvalidNameError } from './errors/invalid-name-error'
import { Name } from './name'
import { UserData } from './user-data'

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
    if (nameOrError.isLeft()) return left(new InvalidNameError())

    const emailOrError = Email.create(userData.email)
    if (emailOrError.isLeft()) return left(new InvalidEmailError())

    const name = nameOrError.value as Name
    const email = emailOrError.value as Email

    return right(new User(name, email))
  }
}
