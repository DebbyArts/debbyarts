class SeedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "SeedError"
  }
}

export { SeedError }
