import { User, UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'
import { UseCase } from '@/usecases/ports'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { MissingParamError } from '@/web-controllers/errors'
import { HttpRequest, HttpResponse } from '@/web-controllers/ports/'
import { RegisterAndSendEmailController } from '@/web-controllers/register-and-send-email-controller'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import { SendEmail } from '@/usecases/send-email/send-email'
import {
  EmailBody,
  EmailBodyTo,
  EmailConfig,
  EmailService,
} from '@/usecases/send-email/ports'
import { Either, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors/mail-service-error'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email/register-and-send-email'

const attachmentPath = '../resources/attachment.txt'
const fromName = 'from_name'
const fromEmail = 'from@mail.com'
const toName = 'to_name'
const toEmail = 'to@mail.com'
const subject = 'Email test'
const emailBody = 'Hello World'
const emailBodyHtml = '<b>Hello World</b>'
const attachement = [
  {
    filename: attachmentPath,
    'content-type': 'text/plan',
  },
]

const dataEmail: EmailBody = {
  from: fromName + ' ' + fromEmail,
  to: toName + '<' + toEmail + '>',
  subject,
  text: emailBody,
  html: emailBodyHtml,
  attachments: attachement,
}

const emailConfig: EmailConfig = {
  host: 'test',
  port: 867,
  username: 'test',
  password: 'test',
}

class MailServiceStub implements EmailService {
  async send(
    emailConfig: EmailConfig,
    emailBody: EmailBodyTo
  ): Promise<Either<MailServiceError, EmailBodyTo>> {
    return right(emailBody)
  }
}

describe('Register user web controller', () => {
  const users: UserData[] = []
  const repo: UserRepository = new InMemoryUserRepository(users)
  const registerUserOnMailingList: RegisterUserOnMailingList =
    new RegisterUserOnMailingList(repo)

  const mailServiceStub = new MailServiceStub()
  const sendEmail: SendEmail = new SendEmail(
    emailConfig,
    dataEmail,
    mailServiceStub
  )

  const registerAndSendEmail = new RegisterAndSendEmail(
    registerUserOnMailingList,
    sendEmail
  )
  const controller: RegisterAndSendEmailController =
    new RegisterAndSendEmailController(registerAndSendEmail)

  class ErrorThrowingUseCaseStub implements UseCase {
    perform(request: any): Promise<any> {
      throw Error()
    }
  }

  const errorThrowingUseCaseStub: ErrorThrowingUseCaseStub =
    new ErrorThrowingUseCaseStub()

  it('Should return status code 201 when request cotains valid user data', async () => {
    const request: HttpRequest = {
      body: {
        name: 'Any name',
        email: 'any@email.com',
      },
    }

    const response: HttpResponse = await controller.handle(request)

    const user = response.body as User
    expect(response.statusCode).toEqual(201)
    expect(user.name.value).toEqual(request.body.name)
    expect(user.email.value).toEqual(request.body.email)
  })

  it('Should return status code 400 when request cotains invalid name', async () => {
    const requestWithInvalidName: HttpRequest = {
      body: {
        name: 'A',
        email: 'any@email.com',
      },
    }

    const response: HttpResponse = await controller.handle(
      requestWithInvalidName
    )

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidNameError)
  })

  it('Should return status code 400 when request cotains invalid name', async () => {
    const requestWithInvalidEmail: HttpRequest = {
      body: {
        name: 'Any Name',
        email: 'anyemailcom',
      },
    }
    const response: HttpResponse = await controller.handle(
      requestWithInvalidEmail
    )

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(InvalidEmailError)
  })

  it('Should return status code 400 when request is missing user name', async () => {
    const missingNameRequest: HttpRequest = {
      body: { email: 'any@email.com' },
    }

    const response: HttpResponse = await controller.handle(missingNameRequest)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect(response.body.message as Error).toEqual('Missing params: name')
  })

  it('Should return status code 400 when request is missing user email', async () => {
    const missingEmailRequest: HttpRequest = {
      body: { name: 'Any Name' },
    }

    const response: HttpResponse = await controller.handle(missingEmailRequest)

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect(response.body.message as Error).toEqual('Missing params: email')
  })

  it('Should return status code 400 when request is missing name and email', async () => {
    const missingNameAndEmailRequest: HttpRequest = {
      body: {},
    }

    const response: HttpResponse = await controller.handle(
      missingNameAndEmailRequest
    )

    expect(response.statusCode).toEqual(400)
    expect(response.body).toBeInstanceOf(MissingParamError)
    expect(response.body.message as Error).toEqual('Missing params: name,email')
  })

  it('should return status code 500 when server raises', async () => {
    const request: HttpRequest = {
      body: {
        name: 'Any Name',
        email: 'any@email.com',
      },
    }

    const controller = new RegisterAndSendEmailController(
      errorThrowingUseCaseStub
    )
    const response: HttpResponse = await controller.handle(request)

    expect(response.statusCode).toEqual(500)
    expect(response.body).toBeInstanceOf(Error)
  })
})
