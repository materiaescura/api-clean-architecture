import { Either, left, right } from '@/shared'
import { MailServiceError } from '@/usecases/errors/mail-service-error'
import {
  EmailBodyTo,
  EmailConfig,
  EmailService,
} from '@/usecases/send-email/ports'
import * as nodemailer from 'nodemailer'

export class NodemailerEmailService implements EmailService {
  public async send(
    emailConfig: EmailConfig,
    emailBody: EmailBodyTo
  ): Promise<Either<MailServiceError, EmailBodyTo>> {
    try {
      const { host, port, username, password } = emailConfig
      const { from, to, subject, text, html, attachments } = emailBody

      const transporter = nodemailer.createTransport({
        host,
        port,
        auth: {
          user: username,
          pass: password,
        },
      })

      await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
        attachments,
      })
    } catch (error) {
      return left(new MailServiceError())
    }
    return right(emailBody)
  }
}
