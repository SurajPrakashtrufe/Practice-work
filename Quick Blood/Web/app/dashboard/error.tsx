"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center p-4">
      <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
        <AlertTriangle className="h-7 w-7 text-amber-500" />
      </div>
      <div>
        <p className="text-base font-bold text-gray-900">Failed to load this page</p>
        <p className="text-sm text-gray-500 mt-1">Check your connection and try again.</p>
      </div>
      <button
        onClick={reset}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm"
      >
        <RefreshCw className="h-4 w-4" /> Retry
      </button>
    </div>
  )
}
