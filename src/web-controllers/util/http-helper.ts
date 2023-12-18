import { HttpResponse } from '@/web-controllers/ports'

export const created = (data: unknown): HttpResponse => {
  return {
    statusCode: 201,
    body: data,
  }
}
