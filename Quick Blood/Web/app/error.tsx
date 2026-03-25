"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function GlobalError({
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center mb-6">
        <AlertTriangle className="h-10 w-10 text-amber-500" />
      </div>
      <h1 className="text-2xl font-black text-gray-900 mb-2">Something went wrong</h1>
      <p className="text-gray-500 max-w-xs mb-8 text-sm leading-relaxed">
        An unexpected error occurred. If this keeps happening, please refresh or return home.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-2xl transition-colors text-sm"
        >
          <RefreshCw className="h-4 w-4" /> Try again
        </button>
        <Link href="/"
          className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold px-5 py-2.5 rounded-2xl transition-colors text-sm">
          <Home className="h-4 w-4" /> Go home
        </Link>
      </div>
      {error.digest && (
        <p className="mt-6 text-[10px] text-gray-300 font-mono">Error ID: {error.digest}</p>
      )}
    </div>
  )
}
