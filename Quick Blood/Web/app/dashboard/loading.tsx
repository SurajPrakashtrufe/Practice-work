import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-red-500" />
        <p className="text-sm text-gray-400 font-medium">Loading…</p>
      </div>
    </div>
  )
}
