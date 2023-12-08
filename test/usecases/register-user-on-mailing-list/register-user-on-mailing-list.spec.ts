import { User } from '../../../src/entities'
import type { UserData } from '../../../src/entities'
import { UserRepository } from '../../../src/usecases/ports'
import { RegisterUserOnMailingList } from '../../../src/usecases'
import { InMemoryUserRepository } from './repository'

describe('Register user on mailing list use case', () => {
  it('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(
      repo
    )
    const name = 'any_name'
    const email = 'any@email.com'
    const response = await usecase.registerUserOnMailingList({ email, name })
    const user = await repo.findUserByEmail(email)
    expect(user?.name).toBe(name)
    expect(response.value.name).toBe(name)
  })

  it('should not add user with invalid email to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(
      repo
    )
    const name = 'any_name'
    const invalidEmail = 'any_mail'
    const response = (
      await usecase.registerUserOnMailingList({
        email: invalidEmail,
        name,
      })
    ).value as Error
    const user = await repo.findUserByEmail(invalidEmail)
    expect(user).toBeNull()
    expect(response.name).toEqual('InvalidEmailError')
  })

  it('should not add user with invalid name to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const usecase: RegisterUserOnMailingList = new RegisterUserOnMailingList(
      repo
    )
    const invalidName = ''
    const email = 'any@email.com'
    const response = (
      await usecase.registerUserOnMailingList({
        email,
        name: invalidName,
      })
    ).value as Error
    const user = await repo.findUserByEmail(email)
    expect(user).toBeNull()
    expect(response.name).toEqual('InvalidNameError')
  })
})
