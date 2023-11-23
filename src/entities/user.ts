import { Either, Right, left, right } from '../shared/either'
import { Email } from './email'
import { InvalidEmailError } from './errors/invalid-email-error'
import { UserData } from './user-data'

export class User {
  private readonly name: string
  private readonly email: string

  constructor({ name, email }: UserData) {
    this.name = name
    this.email = email
  }
  static create(userData: UserData): Either<InvalidEmailError, User> {
    const emailOrError = Email.create(userData.email)

    if (emailOrError.isLeft()) return left(new InvalidEmailError())

    return right(new User(userData))
  }
}
