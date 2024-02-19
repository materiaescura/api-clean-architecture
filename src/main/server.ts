import 'module-alias/register'
import app from '@/main/config/app'

app.listen(3333, () => {
  console.log('Server running at http://localhost/3333')
})
