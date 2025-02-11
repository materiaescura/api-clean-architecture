import app from '@/main/config/app'
import request from 'supertest'

describe('CORS middleware', () => {
  it('should enable cors', async () => {
    app.post('/test_cors', (req, res) => {
      res.send()
    })

    await request(app)
      .get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-headers', '*')
      .expect('access-control-allow-methods', '*')
  })
})
