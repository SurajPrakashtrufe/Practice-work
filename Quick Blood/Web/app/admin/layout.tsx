"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard, Building, Users, ClipboardList,
  ShieldCheck, LogOut, Menu, X, AlertTriangle,
} from "lucide-react"

const NAV = [
  { href: "/admin",           icon: LayoutDashboard, label: "Overview"      },
  { href: "/admin/hospitals", icon: Building,        label: "Hospitals"     },
  { href: "/admin/users",     icon: Users,           label: "Users"         },
  { href: "/admin/requests",  icon: ClipboardList,   label: "Requests"      },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Simple admin gate — in production use real auth
    const raw = localStorage.getItem("qb_session")
    if (!raw) { router.replace("/auth/login"); return }
  }, [router])

  function logout() {
    localStorage.removeItem("qb_session")
    router.push("/auth/login")
  }

  function NavItem({ href, icon: Icon, label, badge }: { href: string; icon: React.ElementType; label: string; badge?: number }) {
    const active = pathname === href || (href !== "/admin" && pathname.startsWith(href))
    return (
      <Link href={href} onClick={() => setOpen(false)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
          ${active ? "bg-indigo-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
        <Icon className="h-4 w-4 shrink-0" />
        {label}
        {badge != null && badge > 0 && (
          <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full
            ${active ? "bg-white/20 text-white" : "bg-red-100 text-red-600"}`}>{badge}</span>
        )}
      </Link>
    )
  }

  const Sidebar = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-gray-100 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <ShieldCheck className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">Quick Blood</p>
          <p className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wide">Admin Panel</p>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NavItem href="/admin"           icon={LayoutDashboard} label="Overview"   />
        <NavItem href="/admin/hospitals" icon={Building}        label="Hospitals"  badge={3} />
        <NavItem href="/admin/users"     icon={Users}           label="Users"      />
        <NavItem href="/admin/requests"  icon={ClipboardList}   label="Requests"   />
      </nav>
      <div className="px-3 py-4 border-t border-gray-100">
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-white border-r border-gray-100 fixed inset-y-0 left-0 z-30">
        {Sidebar}
      </aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative w-56 bg-white h-full flex flex-col shadow-2xl">
            <div className="absolute top-3 right-3">
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            {Sidebar}
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col md:ml-56 min-h-screen">
        <header className="sticky top-0 z-20 bg-white border-b border-gray-100 h-14 flex items-center px-4 gap-3">
          <button className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 md:hidden">
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
            <span className="font-bold text-gray-900 text-sm">Admin</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            <AlertTriangle className="h-3 w-3" /> 3 pending verifications
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 pb-10">
          {children}
        </main>
      </div>
    </div>
  )
}
