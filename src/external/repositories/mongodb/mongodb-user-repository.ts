import { User, UserData } from '@/entities'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { MongoHelper } from './helper/mongo-helper'
import { FindCursor, WithId } from 'mongodb'

interface MongodbUser extends WithId<Document> {
  name: string
  email: string
}

interface MongodbUsers extends Array<MongodbUser> {}

export class MongodbUserRepository implements UserRepository {
  public async add(user: UserData): Promise<void> {
    const userColletion = await MongoHelper.getCollection('users')
    const result = await this.exists(user)
    if (!result) await userColletion.insertOne(user)
  }

  public async findUserByEmail(email: string): Promise<UserData | null> {
    const userCollection = await MongoHelper.getCollection('users')
    const user = await userCollection.findOne<UserData>({ email: email })
    return user
  }

  public async findAllUsers(): Promise<UserData[]> {
    const userCollection = await MongoHelper.getCollection('users')
    const users = await userCollection.find<UserData>({}).toArray()
    return users
  }

  public async exists(user: UserData): Promise<boolean> {
    const userResult = await this.findUserByEmail(user.email)
    return userResult ? true : false
  }
}
