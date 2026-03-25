"use client"

import { useState } from "react"
import { Search, Users, Droplets, Heart, Building, BadgeCheck, Ban, ChevronRight } from "lucide-react"

// ── Mock data ─────────────────────────────────────────────────────────────────

type Role = "donor" | "patient" | "hospital"

const MOCK_USERS = [
  { id: "u1", name: "Arjun Sharma",    email: "arjun@example.com",   role: "donor"    as Role, bloodGroup: "B+",  city: "Mumbai",  status: "active",   joined: "12 Jan 2026", donations: 3  },
  { id: "u2", name: "Meera Kapoor",    email: "meera@example.com",   role: "donor"    as Role, bloodGroup: "O-",  city: "Mumbai",  status: "active",   joined: "5 Feb 2026",  donations: 1  },
  { id: "u3", name: "Rahul Mehta",     email: "rahul@example.com",   role: "patient"  as Role, bloodGroup: "A+",  city: "Pune",    status: "active",   joined: "20 Feb 2026", donations: 0  },
  { id: "u4", name: "Sneha Joshi",     email: "sneha@example.com",   role: "patient"  as Role, bloodGroup: "AB+", city: "Mumbai",  status: "active",   joined: "1 Mar 2026",  donations: 0  },
  { id: "u5", name: "Apollo Hospital", email: "admin@apollo.com",    role: "hospital" as Role, bloodGroup: "—",   city: "Mumbai",  status: "verified", joined: "3 Jan 2026",  donations: 0  },
  { id: "u6", name: "Vikram Patil",    email: "vikram@example.com",  role: "donor"    as Role, bloodGroup: "B-",  city: "Nashik",  status: "active",   joined: "15 Mar 2026", donations: 0  },
  { id: "u7", name: "Pooja Reddy",     email: "pooja@example.com",   role: "donor"    as Role, bloodGroup: "B+",  city: "Nagpur",  status: "suspended",joined: "10 Jan 2026", donations: 2  },
  { id: "u8", name: "KEM Hospital",    email: "admin@kem.gov.in",    role: "hospital" as Role, bloodGroup: "—",   city: "Mumbai",  status: "verified", joined: "5 Dec 2025",  donations: 0  },
]

const ROLE_STYLE: Record<Role, { color: string; bg: string; icon: React.ElementType; label: string }> = {
  donor:    { color: "text-red-600",   bg: "bg-red-50",   icon: Droplets,  label: "Donor"    },
  patient:  { color: "text-blue-600",  bg: "bg-blue-50",  icon: Heart,     label: "Patient"  },
  hospital: { color: "text-green-700", bg: "bg-green-50", icon: Building,  label: "Hospital" },
}

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  active:    { color: "text-green-700", bg: "bg-green-50"  },
  verified:  { color: "text-indigo-600",bg: "bg-indigo-50" },
  suspended: { color: "text-red-500",   bg: "bg-red-50"    },
}

type RoleFilter = "all" | Role

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminUsers() {
  const [search,     setSearch]     = useState("")
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all")
  const [expanded,   setExpanded]   = useState<string | null>(null)
  const [suspended,  setSuspended]  = useState<Set<string>>(new Set())

  const filtered = MOCK_USERS.filter(u => {
    const matchRole   = roleFilter === "all" || u.role === roleFilter
    const matchSearch = !search.trim() ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  function toggleSuspend(id: string) {
    setSuspended(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const totalDonors    = MOCK_USERS.filter(u => u.role === "donor").length
  const totalPatients  = MOCK_USERS.filter(u => u.role === "patient").length
  const totalHospitals = MOCK_USERS.filter(u => u.role === "hospital").length

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage all registered users across roles.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Droplets,  label: "Donors",    value: totalDonors,    color: "text-red-600",   bg: "bg-red-50"   },
          { icon: Heart,     label: "Patients",  value: totalPatients,  color: "text-blue-600",  bg: "bg-blue-50"  },
          { icon: Building,  label: "Hospitals", value: totalHospitals, color: "text-green-700", bg: "bg-green-50" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-48 bg-white border border-gray-200 rounded-xl px-3 py-2">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email or city…"
            className="flex-1 text-sm focus:outline-none bg-transparent placeholder-gray-400"
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "donor", "patient", "hospital"] as RoleFilter[]).map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors capitalize
                ${roleFilter === r ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              {r === "all" ? "All" : ROLE_STYLE[r as Role].label + "s"}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-gray-400">{filtered.length} user{filtered.length !== 1 ? "s" : ""}</p>

      {/* User list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-sm text-gray-500">No users match your search.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(u => {
            const roleCfg   = ROLE_STYLE[u.role]
            const RoleIcon  = roleCfg.icon
            const isSuspended = suspended.has(u.id) || u.status === "suspended"
            const statusKey   = isSuspended ? "suspended" : u.status
            const statusSty   = STATUS_STYLE[statusKey] ?? STATUS_STYLE.active
            const isExpanded  = expanded === u.id
            const initials    = u.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()

            return (
              <div key={u.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setExpanded(isExpanded ? null : u.id)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${roleCfg.bg} ${roleCfg.color}`}>
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{u.name}</p>
                      {u.role === "hospital" && u.status === "verified" && (
                        <BadgeCheck className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{u.email} · {u.city}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${roleCfg.bg} ${roleCfg.color}`}>
                      <RoleIcon className="h-2.5 w-2.5" /> {roleCfg.label}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${statusSty.bg} ${statusSty.color} capitalize`}>
                      {statusKey}
                    </span>
                    <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-gray-400">Joined</p>
                        <p className="font-semibold text-gray-800">{u.joined}</p>
                      </div>
                      {u.role !== "hospital" && (
                        <div>
                          <p className="text-gray-400">Blood Group</p>
                          <p className="font-semibold text-red-600">{u.bloodGroup}</p>
                        </div>
                      )}
                      {u.role === "donor" && (
                        <div>
                          <p className="text-gray-400">Total Donations</p>
                          <p className="font-semibold text-gray-800">{u.donations}</p>
                        </div>
                      )}
                    </div>

                    {u.role !== "hospital" && (
                      <button
                        onClick={() => toggleSuspend(u.id)}
                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold border transition-colors
                          ${isSuspended
                            ? "border-green-300 text-green-700 hover:bg-green-50"
                            : "border-red-200 text-red-600 hover:bg-red-50"}`}
                      >
                        <Ban className="h-3.5 w-3.5" />
                        {isSuspended ? "Reinstate user" : "Suspend user"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
