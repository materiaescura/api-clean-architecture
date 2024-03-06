import { Email } from '@/entities'
import { Either, Right, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors/mail-service-error'
import {
  EmailBody,
  EmailBodyTo,
  EmailConfig,
  EmailService,
} from '@/usecases/send-email/ports'
import { SendEmail } from '@/usecases/send-email/send-email'

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

describe('Send email to user', () => {
  it('should send email with valid name and address', async () => {
    const mailServiceStub = new MailServiceStub()
    const useCase = new SendEmail(emailConfig, email, mailServiceStub)
    const response = await useCase.perform({ name: toName, email: toEmail })
    expect(response).toBeInstanceOf(Right)
  })
})
