"use client"

import { useState } from "react"
import {
  MapPin, Zap, Calendar, RefreshCw, CheckCircle2,
  Timer, AlertCircle, PlusCircle, ChevronRight, Users,
} from "lucide-react"
import Link from "next/link"

// ── Mock data ─────────────────────────────────────────────────────────────────

const ALL_REQUESTS = [
  {
    id: 1, group: "B+", units: 2, patientName: "Rahul M.",
    urgency: "urgent", status: "searching", respondents: 4,
    postedAt: "5 min ago", fulfilledAt: null,
  },
  {
    id: 2, group: "O-", units: 1, patientName: "Sneha K.",
    urgency: "urgent", status: "matched", respondents: 1,
    postedAt: "20 min ago", fulfilledAt: null,
  },
  {
    id: 3, group: "AB+", units: 3, patientName: "Vikram P.",
    urgency: "scheduled", status: "searching", respondents: 0,
    postedAt: "1 hr ago", fulfilledAt: null,
  },
  {
    id: 101, group: "A+", units: 1, patientName: "Priya T.",
    urgency: "urgent", status: "fulfilled", respondents: 0,
    postedAt: "12 Mar 2026", fulfilledAt: "12 Mar 2026",
  },
  {
    id: 102, group: "B-", units: 2, patientName: "Mohan R.",
    urgency: "scheduled", status: "fulfilled", respondents: 0,
    postedAt: "2 Feb 2026", fulfilledAt: "3 Feb 2026",
  },
  {
    id: 103, group: "O+", units: 1, patientName: "Kavya S.",
    urgency: "regular", status: "cancelled", respondents: 0,
    postedAt: "10 Jan 2026", fulfilledAt: null,
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
  urgent:    "text-red-600 bg-red-50",
  scheduled: "text-blue-600 bg-blue-50",
  regular:   "text-purple-600 bg-purple-50",
}

const ACTIVE_STATUSES  = ["searching", "matched"]
const PAST_STATUSES    = ["fulfilled", "cancelled"]

export default function HospitalRequests() {
  const [tab, setTab] = useState<TabType>("active")

  const visible = ALL_REQUESTS.filter(r =>
    tab === "active" ? ACTIVE_STATUSES.includes(r.status) : PAST_STATUSES.includes(r.status)
  )

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Donor Requests</h1>
          <p className="text-sm text-gray-500 mt-0.5">All blood requests posted by your hospital</p>
        </div>
        <Link
          href="/dashboard/hospital/request/new"
          className="flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors shrink-0"
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
            <Link href="/dashboard/hospital/request/new" className="text-sm font-semibold text-green-700 hover:underline">
              Post your first request
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map(req => {
            const cfg        = STATUS_CONFIG[req.status]
            const StatusIcon = cfg.icon
            const UrgIcon    = URGENCY_ICON[req.urgency]
            const isActive   = ACTIVE_STATUSES.includes(req.status)

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 hover:border-green-200 transition-colors"
              >
                {/* Top */}
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm
                    ${req.urgency === "urgent" && isActive ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}>
                    {req.group}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900">Patient: {req.patientName}</p>
                      <span className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${URGENCY_COLOR[req.urgency]}`}>
                        <UrgIcon className="h-2.5 w-2.5" />
                        {URGENCY_LABEL[req.urgency]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{req.postedAt}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">{req.units} unit{req.units > 1 ? "s" : ""}</p>
                    <p className="text-[10px] text-gray-400">{req.group}</p>
                  </div>
                </div>

                {/* Status */}
                <div className={`flex items-center gap-2 ${cfg.bg} rounded-xl px-3 py-2`}>
                  <StatusIcon className={`h-4 w-4 ${cfg.color} shrink-0`} />
                  <span className={`text-xs font-semibold ${cfg.color} flex-1`}>{cfg.label}</span>
                  {isActive && req.respondents > 0 && (
                    <span className={`text-xs font-bold ${cfg.color} flex items-center gap-1`}>
                      <Users className="h-3 w-3" /> {req.respondents} responding
                    </span>
                  )}
                  {req.status === "fulfilled" && req.fulfilledAt && (
                    <span className="text-xs text-green-500">{req.fulfilledAt}</span>
                  )}
                </div>

                {/* View detail link for active requests with respondents */}
                {isActive && req.respondents > 0 && (
                  <Link
                    href={`/dashboard/hospital/requests/${req.id}`}
                    className="flex items-center justify-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-xl py-2 transition-colors"
                  >
                    View donor responses <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                )}

                {/* MapPin for location */}
                {req.status === "fulfilled" && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <MapPin className="h-3 w-3" />
                    Fulfilled on {req.fulfilledAt}
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
