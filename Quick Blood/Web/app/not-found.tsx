import Link from "next/link"
import { Droplets, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 rounded-3xl bg-red-100 flex items-center justify-center mb-6">
        <Droplets className="h-10 w-10 text-red-500" />
      </div>
      <h1 className="text-6xl font-black text-gray-900 mb-2">404</h1>
      <h2 className="text-xl font-bold text-gray-700 mb-2">Page not found</h2>
      <p className="text-gray-500 max-w-xs mb-8 text-sm leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-2xl transition-colors text-sm">
          <Home className="h-4 w-4" /> Go home
        </Link>
        <Link href="/dashboard"
          className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold px-5 py-2.5 rounded-2xl transition-colors text-sm">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
      </div>
    </div>
  )
}
