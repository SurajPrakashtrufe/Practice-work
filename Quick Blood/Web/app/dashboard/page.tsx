"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function DashboardRoot() {
  const router = useRouter()

  useEffect(() => {
    const raw = localStorage.getItem("qb_session")
    if (!raw) { router.replace("/auth/login"); return }
    const { role } = JSON.parse(raw) as { role: string }
    router.replace(`/dashboard/${role}`)
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="h-6 w-6 animate-spin text-red-500" />
    </div>
  )
}
