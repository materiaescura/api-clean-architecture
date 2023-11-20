export class Email {
  static validate(email: string | null): boolean {
    if (!email) return false

    const [local, domain] = email.split('@')
    if (local.length > 64) return false

    return true
  }
}
