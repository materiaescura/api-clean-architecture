import { UserData } from '@/entities'
import { Either } from '@/shared'
import { MailServiceError } from '@/usecases/errors/mail-service-error'

export interface EmailConfig {
  readonly host: string
  readonly port: number
  readonly username: string
  readonly password: string
}

export interface EmailBody {
  readonly from: string
  readonly subject: string
  readonly to?: string
  readonly text: string
  readonly html: string
  readonly attachments: Object[]
}

export type EmailBodyTo = Partial<EmailBody> &
  Required<{
    to: string
  }>

export type HTML = {
  html: string
}

export interface EmailService {
  send(
    emailConfig: EmailConfig,
    emailBody: EmailBodyTo
  ): Promise<Either<MailServiceError, EmailBodyTo>>
}
