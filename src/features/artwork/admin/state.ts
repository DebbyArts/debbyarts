type ArtworkActionState = {
  message: string
  status: "idle" | "success" | "error" | "warning"
}

const INITIAL_ARTWORK_ACTION_STATE: ArtworkActionState = {
  message: "",
  status: "idle",
}

export { INITIAL_ARTWORK_ACTION_STATE, type ArtworkActionState }
