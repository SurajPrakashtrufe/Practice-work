"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  Home, Droplets, ClipboardList, User, PlusCircle,
  Layers, Bell, LogOut, Menu, X, Hospital,
} from "lucide-react"

export interface QBSession {
  name: string
  email: string
  role: "donor" | "patient" | "hospital"
  bloodGroup: string
  isAvailable: boolean
}

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV: Record<string, { href: string; icon: React.ElementType; label: string }[]> = {
  donor: [
    { href: "/dashboard/donor",           icon: Home,          label: "Home"      },
    { href: "/dashboard/donor/requests",  icon: Droplets,      label: "Requests"  },
    { href: "/dashboard/donor/donations", icon: ClipboardList, label: "Donations" },
    { href: "/dashboard/donor/profile",   icon: User,          label: "Profile"   },
  ],
  patient: [
    { href: "/dashboard/patient",              icon: Home,          label: "Home"     },
    { href: "/dashboard/sos",                  icon: Bell,          label: "SOS"      },
    { href: "/dashboard/patient/requests",     icon: ClipboardList, label: "Requests" },
    { href: "/dashboard/patient/profile",      icon: User,          label: "Profile"  },
  ],
  hospital: [
    { href: "/dashboard/hospital",             icon: Home,          label: "Home"      },
    { href: "/dashboard/hospital/requests",    icon: ClipboardList, label: "Requests"  },
    { href: "/dashboard/hospital/inventory",   icon: Layers,        label: "Inventory" },
    { href: "/dashboard/hospital/profile",     icon: User,          label: "Profile"   },
  ],
}

const ROLE_COLOR: Record<string, string> = {
  donor:    "bg-red-600",
  patient:  "bg-blue-600",
  hospital: "bg-green-700",
}

const ROLE_LABEL: Record<string, string> = {
  donor:    "Donor",
  patient:  "Patient",
  hospital: "Hospital",
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [session, setSession]       = useState<QBSession | null>(null)
  const [sidebarOpen, setSidebar]   = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem("qb_session")
    if (!raw) { router.replace("/auth/login"); return }
    setSession(JSON.parse(raw) as QBSession)
  }, [router])

  function logout() {
    localStorage.removeItem("qb_session")
    router.push("/auth/login")
  }

  if (!session) return null   // waiting for session check

  const navItems = NAV[session.role] ?? []
  const accentBg = ROLE_COLOR[session.role]

  function NavItem({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
    const active = pathname === href || (href !== `/dashboard/${session!.role}` && pathname.startsWith(href))
    return (
      <Link
        href={href}
        onClick={() => setSidebar(false)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
          ${active
            ? `${accentBg} text-white shadow-sm`
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {label}
      </Link>
    )
  }

  const initials = session.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 bg-white border-r border-gray-100 fixed inset-y-0 left-0 z-30">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-4 h-16 border-b border-gray-100">
          <div className={`w-8 h-8 rounded-lg ${accentBg} flex items-center justify-center`}>
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M12 2C12 2 4 10.5 4 15a8 8 0 0016 0C20 10.5 12 2 12 2z" />
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-base">Quick Blood</span>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full ${accentBg} flex items-center justify-center text-white text-sm font-bold`}>
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{session.name}</p>
              <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white ${accentBg}`}>
                {ROLE_LABEL[session.role]}
              </span>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => <NavItem key={item.href} {...item} />)}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-gray-100 space-y-1">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebar(false)} />
          <aside className="relative w-64 bg-white h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg ${accentBg} flex items-center justify-center`}>
                  <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
                    <path d="M12 2C12 2 4 10.5 4 15a8 8 0 0016 0C20 10.5 12 2 12 2z" />
                  </svg>
                </div>
                <span className="font-bold text-gray-900">Quick Blood</span>
              </div>
              <button onClick={() => setSidebar(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${accentBg} flex items-center justify-center text-white text-xs font-bold`}>
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{session.name}</p>
                  <p className="text-xs text-gray-400">{session.email}</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map(item => <NavItem key={item.href} {...item} />)}
            </nav>

            <div className="px-3 py-4 border-t border-gray-100">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col md:ml-60 min-h-screen">

        {/* Top header */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 h-14 flex items-center px-4 gap-3">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            onClick={() => setSidebar(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Mobile brand */}
          <div className="md:hidden flex items-center gap-2 flex-1">
            <div className={`w-6 h-6 rounded-md ${accentBg} flex items-center justify-center`}>
              <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                <path d="M12 2C12 2 4 10.5 4 15a8 8 0 0016 0C20 10.5 12 2 12 2z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-sm">Quick Blood</span>
          </div>

          <div className="flex-1 hidden md:block" />

          {/* Right side: bell + avatar */}
          <Link href="/dashboard/notifications" className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </Link>
          <div className={`w-8 h-8 rounded-full ${accentBg} flex items-center justify-center text-white text-xs font-bold cursor-pointer`}>
            {initials}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-white border-t border-gray-100 flex">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== `/dashboard/${session.role}` && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors
                ${active ? `${session.role === "donor" ? "text-red-600" : session.role === "patient" ? "text-blue-600" : "text-green-700"}` : "text-gray-400"}`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          )
        })}
      </nav>

    </div>
  )
}
