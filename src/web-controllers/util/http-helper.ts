import { HttpResponse } from '@/web-controllers/ports'

export const created = (data: unknown): HttpResponse => {
  return {
    statusCode: 201,
    body: data,
  }
}

export const badRequest = (data: unknown): HttpResponse => {
  return {
    statusCode: 400,
    body: data,
  }
}
