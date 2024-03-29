import { MongoHelper } from '@/external/repositories/mongodb/helper/mongo-helper'
import app from '@/main/config/app'
import request from 'supertest'

describe('Register router', () => {
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  }, 60000)

  beforeEach(async () => {
    MongoHelper.clearCollection('users')
  })

  it('should return an account on success', async () => {
    await request(app)
      .post('/api/register')
      .send({
        name: 'diego',
        email: 'diego.bug@gmail.com',
      })
      .expect(201)
  })
})
