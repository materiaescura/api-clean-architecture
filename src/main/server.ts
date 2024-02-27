import 'module-alias/register'
import app from '@/main/config/app'
import { MongoHelper } from '@/external/repositories/mongodb/helper/mongo-helper'

MongoHelper.connect('mongodb://0.0.0.0')
  .then(async () => {
    app.listen(3333, () => {
      console.log('Server running at http://localhost/3333')
    })
  })
  .catch(console.error)
