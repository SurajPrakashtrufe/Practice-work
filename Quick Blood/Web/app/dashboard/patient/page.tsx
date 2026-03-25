"use client"

import { useEffect, useState } from "react"
import { Droplets, MapPin, Clock, PlusCircle, ChevronRight, Zap, AlertCircle, CheckCircle2, Timer } from "lucide-react"
import Link from "next/link"
import type { QBSession } from "../layout"

// ── Mock active requests for the patient ──────────────────────────────────────
const MOCK_ACTIVE_REQUESTS = [
  {
    id: 1,
    group: "B+",
    units: 2,
    hospital: "Apollo Hospital",
    area: "Andheri, Mumbai",
    urgency: "urgent",
    status: "searching",
    respondents: 3,
    postedAt: "10 min ago",
  },
]

const MOCK_PAST_REQUESTS = [
  {
    id: 101,
    group: "B+",
    units: 1,
    hospital: "Lilavati Hospital",
    area: "Bandra, Mumbai",
    urgency: "scheduled",
    status: "fulfilled",
    fulfilledAt: "12 Mar 2025",
  },
]

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  searching:  { label: "Finding donors",  color: "text-blue-600",  bg: "bg-blue-50",  icon: Timer       },
  matched:    { label: "Donor matched",   color: "text-amber-600", bg: "bg-amber-50", icon: Zap         },
  fulfilled:  { label: "Fulfilled",       color: "text-green-600", bg: "bg-green-50", icon: CheckCircle2 },
  cancelled:  { label: "Cancelled",       color: "text-gray-500",  bg: "bg-gray-100", icon: AlertCircle },
}

const URGENCY_LABEL: Record<string, string> = {
  urgent:    "Urgent",
  scheduled: "Scheduled",
  regular:   "Regular",
}

function formatGroup(g: string) { return g }

export default function PatientHome() {
  const [session, setSession] = useState<QBSession | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem("qb_session")
    if (!raw) return
    setSession(JSON.parse(raw) as QBSession)
  }, [])

  if (!session) return null

  const firstName = session.name.split(" ")[0]
  const hasActive = MOCK_ACTIVE_REQUESTS.length > 0

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* ── Greeting ── */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Hello, {firstName} 👋</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {hasActive
            ? "You have an active blood request. We're finding donors near you."
            : "No active requests. Create one when you need blood."}
        </p>
      </div>

      {/* ── New request CTA (when no active request) ── */}
      {!hasActive && (
        <Link
          href="/dashboard/patient/request/new"
          className="flex items-center gap-4 bg-blue-600 rounded-2xl p-5 text-white hover:bg-blue-700 transition-colors"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <PlusCircle className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-base">Request Blood</p>
            <p className="text-white/70 text-xs mt-0.5">Find compatible donors near your hospital</p>
          </div>
          <ChevronRight className="h-5 w-5 text-white/60 shrink-0" />
        </Link>
      )}

      {/* ── Active requests ── */}
      {hasActive && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">Active Requests</h2>
            <Link href="/dashboard/patient/requests" className="text-xs text-blue-600 font-semibold flex items-center gap-0.5">
              See all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {MOCK_ACTIVE_REQUESTS.map(req => {
            const cfg = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.searching
            const StatusIcon = cfg.icon
            return (
              <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 font-bold text-sm text-blue-600">
                      {formatGroup(req.group)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{req.hospital}</p>
                        {req.urgency === "urgent" && (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                            <Zap className="h-2.5 w-2.5" /> URGENT
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />{req.area}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">{req.units} unit{req.units > 1 ? "s" : ""}</p>
                    <p className="text-[10px] text-gray-400">{req.postedAt}</p>
                  </div>
                </div>

                {/* Status bar */}
                <div className={`flex items-center gap-2 ${cfg.bg} rounded-xl px-3 py-2`}>
                  <StatusIcon className={`h-4 w-4 ${cfg.color} shrink-0`} />
                  <p className={`text-xs font-semibold ${cfg.color} flex-1`}>{cfg.label}</p>
                  {req.respondents > 0 && (
                    <span className={`text-xs font-bold ${cfg.color}`}>{req.respondents} responding</span>
                  )}
                </div>

                {/* Action */}
                <Link
                  href={`/dashboard/patient/requests/${req.id}`}
                  className="block text-center text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl py-2 transition-colors"
                >
                  View details & donor responses
                </Link>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            icon: Droplets,
            label: "Blood Group",
            value: session.bloodGroup,
            sub: "Your blood type",
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            icon: PlusCircle,
            label: "Requests",
            value: String(MOCK_ACTIVE_REQUESTS.length + MOCK_PAST_REQUESTS.length),
            sub: "Total raised",
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            icon: CheckCircle2,
            label: "Fulfilled",
            value: String(MOCK_PAST_REQUESTS.filter(r => r.status === "fulfilled").length),
            sub: "Successfully met",
            color: "text-green-600",
            bg: "bg-green-50",
          },
        ].map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-3 border border-gray-100 space-y-2">
            <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{label}</p>
              <p className={`text-base font-bold ${color}`}>{value}</p>
              <p className="text-[10px] text-gray-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Past requests ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Past Requests</h2>
          <Link href="/dashboard/patient/requests" className="text-xs text-blue-600 font-semibold flex items-center gap-0.5">
            See all <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {MOCK_PAST_REQUESTS.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-600">No past requests</p>
            <p className="text-xs text-gray-400">Your request history will appear here.</p>
          </div>
        ) : (
          MOCK_PAST_REQUESTS.map(req => {
            const cfg = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.fulfilled
            return (
              <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 font-bold text-sm text-gray-600">
                  {req.group}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">{req.hospital}</p>
                    <span className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" />{req.area}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">{req.units} unit{req.units > 1 ? "s" : ""}</p>
                  <p className="text-[10px] text-gray-400">{req.fulfilledAt}</p>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ── New request CTA (always visible at bottom) ── */}
      <Link
        href="/dashboard/patient/request/new"
        className="flex items-center justify-center gap-2 w-full bg-white border-2 border-blue-200 hover:border-blue-400 text-blue-600 font-semibold text-sm rounded-2xl py-3.5 transition-colors"
      >
        <PlusCircle className="h-4 w-4" />
        Create new blood request
      </Link>

    </div>
  )
}
