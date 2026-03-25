"use client"

import { useState } from "react"
import Link from "next/link"
import { Building, CheckCircle2, XCircle, Clock, ChevronRight, Search, Filter } from "lucide-react"

type VerifStatus = "pending" | "verified" | "rejected"
type TabType     = "pending" | "all"

const ALL_HOSPITALS = [
  { id: "h1", name: "Sunrise Medical Centre",  city: "Pune",    type: "Private",   submitted: "2 hrs ago",   status: "pending"  as VerifStatus, regNo: "MH-2022-HOS-1234" },
  { id: "h2", name: "Green Valley Hospital",   city: "Nashik",  type: "Government",submitted: "5 hrs ago",   status: "pending"  as VerifStatus, regNo: "MH-2018-HOS-9901" },
  { id: "h3", name: "Care & Cure Hospital",    city: "Mumbai",  type: "NGO",       submitted: "1 day ago",   status: "pending"  as VerifStatus, regNo: "MH-2020-HOS-5517" },
  { id: "h4", name: "Apollo Hospital",         city: "Mumbai",  type: "Private",   submitted: "5 days ago",  status: "verified" as VerifStatus, regNo: "MH-2019-HOS-4421" },
  { id: "h5", name: "KEM Hospital",            city: "Mumbai",  type: "Government",submitted: "10 days ago", status: "verified" as VerifStatus, regNo: "MH-1957-HOS-0001" },
  { id: "h6", name: "Lilavati Hospital",       city: "Mumbai",  type: "Private",   submitted: "12 days ago", status: "verified" as VerifStatus, regNo: "MH-1978-HOS-0230" },
  { id: "h7", name: "Shiv Sena Arogya Kendra", city: "Thane", type: "NGO",        submitted: "3 days ago",  status: "rejected" as VerifStatus, regNo: "MH-2024-HOS-8899" },
]

const STATUS_CONFIG: Record<VerifStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending:  { label: "Pending",  color: "text-amber-600", bg: "bg-amber-50",  icon: Clock        },
  verified: { label: "Verified", color: "text-green-600", bg: "bg-green-50",  icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "text-red-500",   bg: "bg-red-50",    icon: XCircle      },
}

export default function AdminHospitals() {
  const [tab, setTab]       = useState<TabType>("pending")
  const [search, setSearch] = useState("")

  const filtered = ALL_HOSPITALS.filter(h => {
    const matchTab = tab === "pending" ? h.status === "pending" : true
    const matchSearch = !search.trim() ||
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Hospital Verification</h1>
        <p className="text-sm text-gray-500 mt-0.5">Review and approve hospital registrations</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        {(["pending","all"] as TabType[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors capitalize
              ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
            {t === "pending"
              ? `Pending (${ALL_HOSPITALS.filter(h => h.status === "pending").length})`
              : `All (${ALL_HOSPITALS.length})`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input type="text" placeholder="Search hospitals…" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-sm text-gray-500">No hospitals found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(h => {
            const cfg    = STATUS_CONFIG[h.status]
            const Icon   = cfg.icon
            return (
              <Link key={h.id} href={`/admin/hospitals/${h.id}`}
                className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 hover:border-indigo-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Building className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{h.name}</p>
                  <p className="text-xs text-gray-400">{h.type} · {h.city} · {h.regNo}</p>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${cfg.bg} justify-end`}>
                    <Icon className={`h-3 w-3 ${cfg.color}`} />
                    <span className={`text-[10px] font-bold ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <p className="text-[10px] text-gray-400">{h.submitted}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
