import { UserData } from '../user-data'
import { InMemoryUserRepository } from './in-memory-user-repository'

describe('In memory user repository', () => {
  it('should return null if user is not found', async () => {
    const users: UserData[] = []
    const userRepository = new InMemoryUserRepository(users)
    const user = await userRepository.findUserByEmail('any@email.com')
    expect(user).toBeNull()
  })

  it('should return user if it is found in repository', async () => {
    const users: UserData[] = []
    const name = 'any_name'
    const email = 'any@email.com'
    const userRepository = new InMemoryUserRepository(users)
    await userRepository.add({name, email})
    const user = await userRepository.findUserByEmail(email)
    expect(user?.name).toBe(name)
  })
})