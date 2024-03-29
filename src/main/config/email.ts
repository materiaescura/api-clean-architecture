import {
  EmailConfig,
  EmailBodyTo,
  EmailBody,
} from '@/usecases/send-email/ports'

export function getEmailConfig(): EmailConfig {
  return {
    host: process.env.EMAIL_HOST as string,
    port: Number.parseInt(process.env.EMAIL_PORT as string),
    username: process.env.EMAIL_USERNAME as string,
    password: process.env.EMAIL_PASSWORD as string,
  }
}

export function getEmailBody(): EmailBody {
  return {
    from: 'diego.bug@gmail.com',
    html: '<b>Oi<b/>',
    text: 'Oi',
    attachments: [{ path: 'texto.txt' }],
    subject: 'teste',
  }
}
