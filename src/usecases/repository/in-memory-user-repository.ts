import { UserRepository } from '../ports/user-data'
import { UserData } from '../user-data'

export class InMemoryUserRepository implements UserRepository {
    constructor(private repository: UserData[]) {
        this.repository = repository
    }

    public async add (user: UserData): Promise<void> {
        throw new Error('Method not implemented.')
    }

    public async findUserByEmail (email: string): Promise<UserData  | null> {
        return null
    }

    public async findAllUsers (): Promise<UserData[]> {
        throw new Error('Method not implemented.')
    }
    
    public async exists (user: UserData): Promise<boolean> {
        throw new Error('Method not implemented.')
    }
  
}