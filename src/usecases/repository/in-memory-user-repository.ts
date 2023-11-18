import { UserRepository } from '../ports/user-data'
import { UserData } from '../user-data'

export class InMemoryUserRepository implements UserRepository {
  constructor(private repository: UserData[]) {
    this.repository = repository
  }

  public async add(user: UserData): Promise<void> {
    const userExists = await this.exists(user)
    if (!userExists) this.repository.push(user)
  }

  public async findUserByEmail(email: string): Promise<UserData | null> {
    const users = this.repository.filter((user) => user.email === email)
    if (users.length > 0) return users[0]
    return null
  }

  public async findAllUsers(): Promise<UserData[]> {
    return this.repository
  }

  public async exists(user: UserData): Promise<boolean> {
    return this.repository.some((el) => el.email === user.email)
  }
}
