import { UserData } from '@/entities'
import { Either, left, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors/mail-service-error'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email/register-and-send-email'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { UserRepository } from '@/usecases/register-user-on-mailing-list/ports'
import { InMemoryUserRepository } from '@/usecases/register-user-on-mailing-list/repository'
import {
  EmailBody,
  EmailBodyTo,
  EmailConfig,
  EmailService,
} from '@/usecases/send-email/ports'
import { SendEmail } from '@/usecases/send-email/send-email'
import { register } from 'module'

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

class MailServiceMock implements EmailService {
  public timesSendWasCalled = 0
  async send(
    emailConfig: EmailConfig,
    emailBody: EmailBodyTo
  ): Promise<Either<MailServiceError, EmailBodyTo>> {
    this.timesSendWasCalled++
    return right(emailBody)
  }
}

class MailServiceStubError implements EmailService {
  async send(
    emailConfig: EmailConfig,
    emailBody: EmailBodyTo
  ): Promise<Either<MailServiceError, EmailBodyTo>> {
    return left(new MailServiceError())
  }
}

describe('Register and send email', () => {
  it('should add user with complete data to mailing list', async () => {
    const users: UserData[] = []
    const repo: UserRepository = new InMemoryUserRepository(users)
    const registerUserUseCase: RegisterUserOnMailingList =
      new RegisterUserOnMailingList(repo)
    const mailServiceMock = new MailServiceMock()
    const sendEmailUseCase = new SendEmail(
      emailConfig,
      dataEmail,
      mailServiceMock
    )

    const registerAndSendEmailUseCase: RegisterAndSendEmail =
      new RegisterAndSendEmail(registerUserUseCase, sendEmailUseCase)

    const name = 'any_name'
    const email = 'any@email.com'
    const response = await registerAndSendEmailUseCase.perform({ email, name })
    const user = await repo.findUserByEmail(email)
    expect(user?.name).toBe(name)
    expect(response.value.name).toEqual({ value: name })
    expect(mailServiceMock.timesSendWasCalled).toEqual(1)
  })
})
