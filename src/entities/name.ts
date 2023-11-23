import { Either, left, right } from '../shared/either'
import { InvalidEmailError } from './errors/invalid-email-error'
import { InvalidNameError } from './errors/invalid-name-error'

export class Name {
  private readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static validate(value: string): boolean {
    if (!value) return false

    if (value.trim().length < 2 || value.trim().length > 256) return false

    return true
  }

  public static create(value: string): Either<InvalidNameError, Name> {
    if (!Name.validate(value)) {
      return left(new InvalidEmailError())
    }

    return right(new Name(value))
  }
}
