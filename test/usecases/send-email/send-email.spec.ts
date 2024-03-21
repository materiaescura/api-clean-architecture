import { Email, User } from '@/entities'
import { Either, Left, Right, left, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors/mail-service-error'
import {
  EmailBody,
  EmailBodyTo,
  EmailConfig,
  EmailService,
} from '@/usecases/send-email/ports'
import { SendEmail } from '@/usecases/send-email/send-email'
import exp from 'constants'

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

const email: EmailBody = {
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

class MailServiceStubError implements EmailService {
  async send(
    emailConfig: EmailConfig,
    emailBody: EmailBodyTo
  ): Promise<Either<MailServiceError, EmailBodyTo>> {
    return left(new MailServiceError())
  }
}

describe('Send email to user', () => {
  it('should send email with valid name and address', async () => {
    const mailServiceStub = new MailServiceStub()
    const user = User.create({ name: toName, email: toEmail }).value as User
    const useCase = new SendEmail(emailConfig, email, mailServiceStub)
    const response = await await useCase.perform(user)
    const emailBodyTo = response.value as EmailBodyTo
    expect(response).toBeInstanceOf(Right)
    expect(emailBodyTo.to).toEqual(toName + '<' + toEmail + '>')
  })

  it('should return an error when email service fails', async () => {
    const mailServiceStubError = new MailServiceStubError()
    const user = User.create({ name: toName, email: toEmail }).value as User
    const useCase = new SendEmail(emailConfig, email, mailServiceStubError)
    const response = await useCase.perform(user)
    expect(response.value).toBeInstanceOf(MailServiceError)
  })
})
