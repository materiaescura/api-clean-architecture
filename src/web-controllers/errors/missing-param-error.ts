export class MissingParamError extends Error {
  constructor(message: string) {
    super(`Missing params: ${message}`)
  }
}
