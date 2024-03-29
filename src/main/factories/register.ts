import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { RegisterAndSendEmailController } from '@/web-controllers/register-and-send-email-controller'
import { MongodbUserRepository } from '@/external/repositories/mongodb/mongodb-user-repository'
import { NodemailerEmailService } from '@/external/mail-services/nodemailer-email-service'
import { SendEmail } from '@/usecases/send-email/send-email'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email/register-and-send-email'
import { getEmailBody, getEmailConfig } from '../config/email'

export const makeUserRegisterUserController =
  (): RegisterAndSendEmailController => {
    const mongoDbUserRepository = new MongodbUserRepository()
    const registerUserOnMailingListUseCase = new RegisterUserOnMailingList(
      mongoDbUserRepository
    )
    const emailService = new NodemailerEmailService()
    const sendEmailUseCase = new SendEmail(
      getEmailConfig(),
      getEmailBody(),
      emailService
    )

    const registerAndSendEmailUseCase = new RegisterAndSendEmail(
      registerUserOnMailingListUseCase,
      sendEmailUseCase
    )
    const controller = new RegisterAndSendEmailController(
      registerAndSendEmailUseCase
    )

    return controller
  }
