class RequestContextUnavailableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "RequestContextUnavailableError"
  }
}

export { RequestContextUnavailableError }
