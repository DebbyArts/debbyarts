import { LoadingState } from "@/components/shared/loading-state"

function AdminLoading() {
  return (
    <main className="min-h-screen px-5 py-12 sm:px-8 lg:px-16">
      <LoadingState
        label="Loading owner workspace"
      />
    </main>
  )
}

export default AdminLoading
