import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { User, UserData } from '@/entities'
import { Either, left, right } from '@/shared'
import type { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { UseCase } from '@/usecases/ports'

export class RegisterUserOnMailingList implements UseCase {
  private readonly userRepo: UserRepository

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo
  }

  public async perform(user: User): Promise<UserData> {
    const userData: UserData = {
      name: user.name.value,
      email: user.email.value,
    }

    if (!(await this.userRepo.exists(userData))) {
      await this.userRepo.add(userData)
    }

    return userData
  }
}
