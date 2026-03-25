"use client"

import { useState } from "react"
import { Search, Zap, Calendar, RefreshCw, CheckCircle2, Timer, XCircle, MapPin, Droplets } from "lucide-react"

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_REQUESTS = [
  { id: "r1",  group: "B+",  units: 2, source: "Apollo Hospital",       sourceType: "hospital", area: "Andheri, Mumbai",     urgency: "urgent",    status: "searching", postedAt: "25 Mar 2026, 9:40 AM",  fulfilled: false },
  { id: "r2",  group: "O-",  units: 1, source: "Lilavati Hospital",     sourceType: "hospital", area: "Bandra, Mumbai",      urgency: "urgent",    status: "matched",   postedAt: "25 Mar 2026, 9:20 AM",  fulfilled: false },
  { id: "r3",  group: "A+",  units: 1, source: "Rahul Mehta (Patient)", sourceType: "patient",  area: "Andheri, Mumbai",     urgency: "scheduled", status: "searching", postedAt: "25 Mar 2026, 8:00 AM",  fulfilled: false },
  { id: "r4",  group: "AB+", units: 2, source: "KEM Hospital",          sourceType: "hospital", area: "Parel, Mumbai",       urgency: "urgent",    status: "fulfilled", postedAt: "24 Mar 2026, 4:00 PM",  fulfilled: true  },
  { id: "r5",  group: "B+",  units: 3, source: "Sneha Joshi (Patient)", sourceType: "patient",  area: "Dadar, Mumbai",       urgency: "regular",   status: "searching", postedAt: "24 Mar 2026, 2:30 PM",  fulfilled: false },
  { id: "r6",  group: "O+",  units: 1, source: "Nanavati Hospital",     sourceType: "hospital", area: "Vile Parle, Mumbai",  urgency: "scheduled", status: "fulfilled", postedAt: "23 Mar 2026, 11:00 AM", fulfilled: true  },
]

const URGENCY_ICON: Record<string, React.ElementType> = {
  urgent: Zap, scheduled: Calendar, regular: RefreshCw,
}
const URGENCY_COLOR: Record<string, string> = {
  urgent:    "text-red-600 bg-red-50",
  scheduled: "text-blue-600 bg-blue-50",
  regular:   "text-purple-600 bg-purple-50",
}
const URGENCY_LABEL: Record<string, string> = {
  urgent: "Urgent", scheduled: "Scheduled", regular: "Regular",
}
const STATUS_CONF: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  searching: { label: "Searching",    color: "text-blue-600",  bg: "bg-blue-50",  icon: Timer        },
  matched:   { label: "Matched",      color: "text-amber-600", bg: "bg-amber-50", icon: Zap          },
  fulfilled: { label: "Fulfilled",    color: "text-green-600", bg: "bg-green-50", icon: CheckCircle2 },
  cancelled: { label: "Cancelled",    color: "text-red-400",   bg: "bg-red-50",   icon: XCircle      },
}

type StatusFilter = "all" | "searching" | "matched" | "fulfilled"

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminRequests() {
  const [search,       setSearch]       = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  const filtered = MOCK_REQUESTS.filter(r => {
    const matchStatus = statusFilter === "all" || r.status === statusFilter
    const matchSearch = !search.trim() ||
      r.source.toLowerCase().includes(search.toLowerCase()) ||
      r.group.toLowerCase().includes(search.toLowerCase()) ||
      r.area.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const counts = {
    all:       MOCK_REQUESTS.length,
    searching: MOCK_REQUESTS.filter(r => r.status === "searching").length,
    matched:   MOCK_REQUESTS.filter(r => r.status === "matched").length,
    fulfilled: MOCK_REQUESTS.filter(r => r.status === "fulfilled").length,
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Blood Requests</h1>
        <p className="text-sm text-gray-500 mt-0.5">All requests across patients and hospitals.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total",     value: counts.all,       color: "text-gray-700",  bg: "bg-gray-50"   },
          { label: "Searching", value: counts.searching, color: "text-blue-600",  bg: "bg-blue-50"   },
          { label: "Matched",   value: counts.matched,   color: "text-amber-600", bg: "bg-amber-50"  },
          { label: "Fulfilled", value: counts.fulfilled, color: "text-green-700", bg: "bg-green-50"  },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-3 border border-gray-100`}>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
            <p className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-48 bg-white border border-gray-200 rounded-xl px-3 py-2">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search hospital, patient, blood group…"
            className="flex-1 text-sm focus:outline-none bg-transparent placeholder-gray-400"
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "searching", "matched", "fulfilled"] as StatusFilter[]).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors capitalize
                ${statusFilter === s ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">{filtered.length} request{filtered.length !== 1 ? "s" : ""}</p>

      {/* Request list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-sm text-gray-500">No requests match your search.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(r => {
            const UrgIcon   = URGENCY_ICON[r.urgency]
            const statusCfg = STATUS_CONF[r.status] ?? STATUS_CONF.searching
            const StatusIcon = statusCfg.icon

            return (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex items-start gap-3">
                  {/* Blood group badge */}
                  <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0 font-bold text-sm text-red-600 border border-red-100">
                    {r.group}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900 truncate">{r.source}</p>
                      <span className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${URGENCY_COLOR[r.urgency]}`}>
                        <UrgIcon className="h-2.5 w-2.5" />
                        {URGENCY_LABEL[r.urgency]}
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        r.sourceType === "hospital" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-600"
                      }`}>
                        {r.sourceType === "hospital" ? "Hospital" : "Patient"}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 flex items-center gap-0.5">
                      <MapPin className="h-3 w-3" />{r.area}
                    </p>

                    <div className="flex items-center gap-3 pt-0.5">
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusCfg.bg} ${statusCfg.color}`}>
                        <StatusIcon className="h-2.5 w-2.5" />
                        {statusCfg.label}
                      </div>
                      <p className="text-[10px] text-gray-400">{r.units} unit{r.units > 1 ? "s" : ""}</p>
                      <p className="text-[10px] text-gray-400">{r.postedAt}</p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Droplets className={`h-5 w-5 ${r.fulfilled ? "text-green-500" : "text-gray-300"}`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
