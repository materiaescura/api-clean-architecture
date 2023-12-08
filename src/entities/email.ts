import { Either, left, right } from '@/shared'
import { InvalidEmailError } from '@/entities/errors'

export class Email {
  public readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(email: string): Either<InvalidEmailError, Email> {
    if (!Email.validate(email)) return left(new InvalidEmailError(email))

    return right(new Email(email))
  }

  static validate(value: string | null): boolean {
    if (!value) return false

    if (value.length > 320) return false

    const emailRegex =
      /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/

    if (!emailRegex.test(value)) return false

    const [local, domain] = value.split('@')

    if (local.length > 64 || local.length === 0) return false

    if (domain.length > 255 || domain.length === 0) return false

    const domainParts = domain.split('.')

    if (domainParts.some((domain) => domain.length > 63)) return false

    return true
  }
}
