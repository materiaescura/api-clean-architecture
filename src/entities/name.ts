import { Either, left, right } from '@/shared'
import { InvalidNameError } from '@/entities/errors'

export class Name {
  public readonly value: string

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
      return left(new InvalidNameError(value))
    }

    return right(new Name(value))
  }
}
