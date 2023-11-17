import { UserData } from "../user-data"
import { InMemoryUserRepository } from "./in-memory-user-repository"

describe('In memory user repository', () => {
  it('should return null if user is not found', async () => {
    const users: UserData[] = []
    const userRepository = new InMemoryUserRepository(users)
    const user = await userRepository.findUserByEmail('any@email.com')
    expect(user).toBeNull()
  })
})