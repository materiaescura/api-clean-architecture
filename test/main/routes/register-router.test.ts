import app from '@/main/config/app'
import request from 'supertest'

describe('Register router', () => {
  it('should return an account on success', async () => {
    await request(app)
      .post('/api/register')
      .send({
        name: 'Any Name',
        email: 'any@mail.com',
      })
      .expect(201)
  })
})
