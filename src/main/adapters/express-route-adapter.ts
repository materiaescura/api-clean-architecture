import { HttpRequest } from '@/web-controllers/ports'
import { RegisterAndSendEmailController } from '@/web-controllers/register-and-send-email-controller'
import { Request, Response } from 'express'

export const adaptRoute = (controller: RegisterAndSendEmailController) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
    }
    const httpResponse = await controller.handle(httpRequest)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
