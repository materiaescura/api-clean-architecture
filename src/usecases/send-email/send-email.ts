import { Either, left, right } from '@/shared'
import { UseCase } from '../ports'
import {
  EmailBody,
  EmailConfig,
  EmailService,
  HTML,
} from './ports/email-service'
import { User, UserData } from '@/entities'
import { InvalidEmailError, InvalidNameError } from '@/entities/errors'

export class SendEmail implements UseCase {
  private readonly emailConfig: EmailConfig
  private readonly emailBody: EmailBody
  private readonly emailService: EmailService

  constructor(
    emailConfig: EmailConfig,
    emailBody: EmailBody,
    emailService: EmailService
  ) {
    ;(this.emailConfig = emailConfig), (this.emailBody = emailBody)
    this.emailService = emailService
  }

  async perform(userData: UserData): Promise<any> {
    const userOrError: Either<InvalidNameError | InvalidEmailError, User> =
      User.create(userData)

    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }

    const html = this.renderHtml(userData)
    const to = `${userData.name} <${userData.email}>`
    const emailBodyTo = { ...this.emailBody, ...html, to }
    return await this.emailService.send(this.emailConfig, emailBodyTo)
  }

  private renderHtml(userData: UserData): HTML {
    const greetings = `E ai <b> ${userData.name} </b>, beleza?`
    return {
      html: `${greetings} <br><br> ${this.emailBody.html}`,
    }
  }
}
