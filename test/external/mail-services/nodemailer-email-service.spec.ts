import { NodemailerEmailService } from '@/external/mail-services/nodemailer-email-service'
import { MailServiceError } from '@/usecases/errors/mail-service-error'
import {
  EmailBody,
  EmailBodyTo,
  EmailConfig,
} from '@/usecases/send-email/ports'

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

const dataEmail: EmailBodyTo = {
  from: fromName + ' ' + fromEmail,
  to: toName + '<' + toEmail + '>',
  subject,
  text: emailBody,
  html: emailBodyHtml,
  attachments: [],
}

const emailConfig: EmailConfig = {
  host: 'test',
  port: 867,
  username: 'test',
  password: 'test',
}

const nodemailer = require('nodemailer')
jest.mock('nodemailer')
const sendMailMock = jest.fn().mockResolvedValueOnce('ok')
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })

describe('Nodemailer mail service adapter', () => {
  beforeEach(() => {
    sendMailMock.mockClear()
    nodemailer.createTransport.mockClear()
  })

  it('should return ok if email is sent', async () => {
    const nodemailer = new NodemailerEmailService()
    const result = await nodemailer.send(emailConfig, dataEmail)
    expect(result.value).toEqual(dataEmail)
  })

  it('should retunr error if email is not sent', async () => {
    const nodemailer = new NodemailerEmailService()
    sendMailMock.mockImplementationOnce(() => {
      throw new Error()
    })
    const result = await nodemailer.send(emailConfig, dataEmail)
    expect(result.value).toBeInstanceOf(MailServiceError)
  })
})
