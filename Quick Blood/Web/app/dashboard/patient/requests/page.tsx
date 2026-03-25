"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Zap, Calendar, RefreshCw, CheckCircle2, Timer, AlertCircle, PlusCircle, ChevronRight } from "lucide-react"

// ── Mock data ─────────────────────────────────────────────────────────────────

const ALL_REQUESTS = [
  {
    id: 1,
    group: "B+", units: 2,
    hospital: "Apollo Hospital", area: "Andheri, Mumbai",
    urgency: "urgent", status: "searching",
    respondents: 3, postedAt: "10 min ago", fulfilledAt: null,
  },
  {
    id: 2,
    group: "A+", units: 1,
    hospital: "Lilavati Hospital", area: "Bandra, Mumbai",
    urgency: "scheduled", status: "matched",
    respondents: 1, postedAt: "2 hrs ago", fulfilledAt: null,
  },
  {
    id: 101,
    group: "B+", units: 1,
    hospital: "Hinduja Hospital", area: "Mahim, Mumbai",
    urgency: "urgent", status: "fulfilled",
    respondents: 0, postedAt: "12 Mar 2025", fulfilledAt: "12 Mar 2025",
  },
  {
    id: 102,
    group: "O+", units: 2,
    hospital: "KEM Hospital", area: "Parel, Mumbai",
    urgency: "regular", status: "cancelled",
    respondents: 0, postedAt: "5 Feb 2025", fulfilledAt: null,
  },
]

type TabType = "active" | "past"

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  searching: { label: "Finding donors",  color: "text-blue-600",  bg: "bg-blue-50",  icon: Timer        },
  matched:   { label: "Donor matched",   color: "text-amber-600", bg: "bg-amber-50", icon: Zap          },
  fulfilled: { label: "Fulfilled",       color: "text-green-600", bg: "bg-green-50", icon: CheckCircle2 },
  cancelled: { label: "Cancelled",       color: "text-gray-400",  bg: "bg-gray-100", icon: AlertCircle  },
}

const URGENCY_ICON: Record<string, React.ElementType> = {
  urgent: Zap, scheduled: Calendar, regular: RefreshCw,
}
const URGENCY_LABEL: Record<string, string> = {
  urgent: "Urgent", scheduled: "Scheduled", regular: "Regular",
}
const URGENCY_COLOR: Record<string, string> = {
  urgent: "text-red-600 bg-red-50",
  scheduled: "text-blue-600 bg-blue-50",
  regular: "text-purple-600 bg-purple-50",
}

const ACTIVE_STATUSES  = ["searching", "matched"]
const PAST_STATUSES    = ["fulfilled", "cancelled"]

export default function PatientRequests() {
  const [tab, setTab] = useState<TabType>("active")

  const visible = ALL_REQUESTS.filter(r =>
    tab === "active" ? ACTIVE_STATUSES.includes(r.status) : PAST_STATUSES.includes(r.status)
  )

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Requests</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track all your blood requests in one place</p>
        </div>
        <Link
          href="/dashboard/patient/request/new"
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors shrink-0"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          New
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        {(["active", "past"] as TabType[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors capitalize
              ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t} ({ALL_REQUESTS.filter(r =>
              t === "active" ? ACTIVE_STATUSES.includes(r.status) : PAST_STATUSES.includes(r.status)
            ).length})
          </button>
        ))}
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-600">
            {tab === "active" ? "No active requests" : "No past requests yet"}
          </p>
          {tab === "active" && (
            <Link href="/dashboard/patient/request/new" className="text-sm font-semibold text-blue-600 hover:underline">
              Create your first request
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map(req => {
            const cfg      = STATUS_CONFIG[req.status]
            const StatusIcon = cfg.icon
            const UrgIcon  = URGENCY_ICON[req.urgency]
            const isActive = ACTIVE_STATUSES.includes(req.status)

            return (
              <Link
                key={req.id}
                href={`/dashboard/patient/requests/${req.id}`}
                className="block bg-white rounded-2xl border border-gray-100 p-4 space-y-3 hover:border-blue-200 transition-colors"
              >
                {/* Top */}
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm
                    ${isActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                    {req.group}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900 truncate">{req.hospital}</p>
                      <span className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${URGENCY_COLOR[req.urgency]}`}>
                        <UrgIcon className="h-2.5 w-2.5" />
                        {URGENCY_LABEL[req.urgency]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5">
                      <MapPin className="h-3 w-3" />{req.area}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">{req.units}u</p>
                    <p className="text-[10px] text-gray-400">{req.postedAt}</p>
                  </div>
                </div>

                {/* Status row */}
                <div className={`flex items-center gap-2 ${cfg.bg} rounded-xl px-3 py-2`}>
                  <StatusIcon className={`h-4 w-4 ${cfg.color} shrink-0`} />
                  <span className={`text-xs font-semibold ${cfg.color} flex-1`}>{cfg.label}</span>
                  {isActive && req.respondents > 0 && (
                    <span className={`text-xs font-bold ${cfg.color}`}>{req.respondents} responding</span>
                  )}
                  {isActive && (
                    <ChevronRight className={`h-3.5 w-3.5 ${cfg.color}`} />
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
