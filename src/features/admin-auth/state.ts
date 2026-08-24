type LoginActionState = {
  message: string
  status: "idle" | "sent" | "error"
}

const INITIAL_LOGIN_STATE: LoginActionState = {
  message: "",
  status: "idle",
}

export { INITIAL_LOGIN_STATE, type LoginActionState }
