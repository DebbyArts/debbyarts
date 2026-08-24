type ServiceActionState = {
  message: string
  status: "idle" | "success" | "error" | "warning"
}

const INITIAL_SERVICE_ACTION_STATE: ServiceActionState = {
  message: "",
  status: "idle",
}

export { INITIAL_SERVICE_ACTION_STATE, type ServiceActionState }
