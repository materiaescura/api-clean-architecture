import { MongoHelper } from '@/external/repositories/mongodb/helper/mongo-helper'
import { MongodbUserRepository } from '@/external/repositories/mongodb/mongodb-user-repository'
import { MongoMemoryServer } from 'mongodb-memory-server'

describe('Mongodb user repository', () => {
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  }, 60000)

  beforeEach(async () => {
    MongoHelper.clearCollection('users')
  })

  it('whern user is added, it should exist', async () => {
    const userRepository = new MongodbUserRepository()
    const user = {
      name: 'any_name',
      email: 'any@mail.com',
    }
    await userRepository.add(user)

    expect(await userRepository.exists(user)).toBeTruthy()
  })
})
