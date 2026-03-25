"use client"

import { useEffect, useState } from "react"
import {
  Droplets, MapPin, CheckCircle2, Clock, Timer, XCircle,
  Heart, TrendingUp, Award, RefreshCw, ChevronRight, Zap,
} from "lucide-react"
import Link from "next/link"
import type { QBSession } from "../../layout"

// ── Types ─────────────────────────────────────────────────────────────────────

type DonationStatus = "responded" | "confirmed" | "fulfilled" | "declined" | "expired"

interface DonationRecord {
  id: string
  group: string
  units: number
  hospital: string
  area: string
  urgency: string
  status: DonationStatus
  respondedAt: string
  fulfilledAt: string | null
  requestId: string
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_DONATIONS: DonationRecord[] = [
  {
    id: "r1", group: "B+", units: 2,
    hospital: "Apollo Hospital", area: "Andheri, Mumbai",
    urgency: "urgent", status: "confirmed",
    respondedAt: "25 Mar 2026", fulfilledAt: null,
    requestId: "1",
  },
  {
    id: "r2", group: "B+", units: 1,
    hospital: "KEM Hospital", area: "Parel, Mumbai",
    urgency: "urgent", status: "fulfilled",
    respondedAt: "10 Jan 2026", fulfilledAt: "10 Jan 2026",
    requestId: "10",
  },
  {
    id: "r3", group: "O-", units: 1,
    hospital: "Hinduja Hospital", area: "Mahim, Mumbai",
    urgency: "scheduled", status: "fulfilled",
    respondedAt: "4 Oct 2025", fulfilledAt: "5 Oct 2025",
    requestId: "8",
  },
  {
    id: "r4", group: "B+", units: 2,
    hospital: "Nanavati Hospital", area: "Vile Parle, Mumbai",
    urgency: "urgent", status: "fulfilled",
    respondedAt: "12 Jul 2025", fulfilledAt: "12 Jul 2025",
    requestId: "5",
  },
  {
    id: "r5", group: "AB+", units: 1,
    hospital: "Breach Candy Hospital", area: "Breach Candy, Mumbai",
    urgency: "regular", status: "declined",
    respondedAt: "2 Apr 2025", fulfilledAt: null,
    requestId: "3",
  },
  {
    id: "r6", group: "B+", units: 1,
    hospital: "Lilavati Hospital", area: "Bandra, Mumbai",
    urgency: "urgent", status: "expired",
    respondedAt: "15 Jan 2025", fulfilledAt: null,
    requestId: "2",
  },
]

// Last confirmed donation date (for cooldown calculation)
const LAST_DONATION_DATE = new Date("2026-01-10")
const COOLDOWN_DAYS = 90

// ── Helpers ───────────────────────────────────────────────────────────────────

function addDays(d: Date, n: number) {
  const r = new Date(d); r.setDate(r.getDate() + n); return r
}
function daysBetween(a: Date, b: Date) {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}
function formatDate(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

const STATUS_CONFIG: Record<DonationStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  responded: { label: "Response sent",    color: "text-blue-600",  bg: "bg-blue-50",  icon: Timer        },
  confirmed: { label: "You're confirmed", color: "text-amber-600", bg: "bg-amber-50", icon: Zap          },
  fulfilled: { label: "Donation done",    color: "text-green-600", bg: "bg-green-50", icon: CheckCircle2 },
  declined:  { label: "Declined",         color: "text-gray-400",  bg: "bg-gray-100", icon: XCircle      },
  expired:   { label: "Request expired",  color: "text-gray-400",  bg: "bg-gray-100", icon: Clock        },
}

const URGENCY_COLOR: Record<string, string> = {
  urgent:    "text-red-600 bg-red-50",
  scheduled: "text-blue-600 bg-blue-50",
  regular:   "text-purple-600 bg-purple-50",
}
const URGENCY_LABEL: Record<string, string> = {
  urgent: "Urgent", scheduled: "Scheduled", regular: "Regular",
}

// ── Reliability score ─────────────────────────────────────────────────────────

function computeScore(donations: DonationRecord[]) {
  const fulfilled = donations.filter(d => d.status === "fulfilled").length
  // Simple scoring: 20 pts per donation, capped at 100
  return Math.min(fulfilled * 20, 100)
}

function scoreTier(score: number): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: "Gold donor",   color: "text-amber-600", bg: "bg-amber-50"  }
  if (score >= 40) return { label: "Silver donor", color: "text-gray-500",  bg: "bg-gray-100"  }
  return              { label: "New donor",     color: "text-blue-600",  bg: "bg-blue-50"   }
}

// ── Component ─────────────────────────────────────────────────────────────────

type TabType = "active" | "history"

const ACTIVE_STATUSES:  DonationStatus[] = ["responded", "confirmed"]
const HISTORY_STATUSES: DonationStatus[] = ["fulfilled", "declined", "expired"]

export default function DonorDonations() {
  const [session, setSession] = useState<QBSession | null>(null)
  const [tab, setTab]         = useState<TabType>("active")

  useEffect(() => {
    const raw = localStorage.getItem("qb_session")
    if (!raw) return
    setSession(JSON.parse(raw) as QBSession)
  }, [])

  if (!session) return null

  const today         = new Date()
  const nextEligible  = addDays(LAST_DONATION_DATE, COOLDOWN_DAYS)
  const canDonate     = today >= nextEligible
  const daysLeft      = canDonate ? 0 : daysBetween(today, nextEligible)
  const cooldownPct   = canDonate ? 100 : Math.round((daysBetween(LAST_DONATION_DATE, today) / COOLDOWN_DAYS) * 100)

  const totalFulfilled = MOCK_DONATIONS.filter(d => d.status === "fulfilled").length
  const score          = computeScore(MOCK_DONATIONS)
  const tier           = scoreTier(score)

  const visible = MOCK_DONATIONS.filter(d =>
    tab === "active" ? ACTIVE_STATUSES.includes(d.status) : HISTORY_STATUSES.includes(d.status)
  )

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Donations</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your donation history and active responses</p>
      </div>

      {/* Cooldown / eligibility card */}
      <div className={`rounded-2xl p-4 space-y-3 ${canDonate ? "bg-green-600" : "bg-gray-800"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wide">Donation eligibility</p>
            <p className="text-white text-xl font-bold mt-0.5">
              {canDonate ? "Ready to donate" : `${daysLeft} days left`}
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              {canDonate
                ? "You're eligible — respond to a nearby request."
                : `Eligible again on ${formatDate(nextEligible)}`}
            </p>
          </div>
          <div className="w-14 h-14 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="white" strokeWidth="3"
                strokeDasharray={`${cooldownPct} 100`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${cooldownPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <p className="text-[10px] text-white/50">Last: {formatDate(LAST_DONATION_DATE)}</p>
            <p className="text-[10px] text-white/50">{cooldownPct}% complete</p>
          </div>
        </div>

        {canDonate && (
          <Link
            href="/dashboard/donor/requests"
            className="flex items-center justify-center gap-2 w-full bg-white/20 hover:bg-white/30 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
          >
            <Droplets className="h-4 w-4" />
            Find a request to respond to
          </Link>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            icon: Heart,
            label: "Donations",
            value: String(totalFulfilled),
            sub: "Confirmed & done",
            color: "text-red-600",
            bg: "bg-red-50",
          },
          {
            icon: TrendingUp,
            label: "Score",
            value: score > 0 ? String(score) : "—",
            sub: tier.label,
            color: tier.color,
            bg: tier.bg,
          },
          {
            icon: Award,
            label: "Lives helped",
            value: totalFulfilled > 0 ? `${totalFulfilled * 3}+` : "0",
            sub: "Est. from donations",
            color: "text-purple-600",
            bg: "bg-purple-50",
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

      {/* Reliability score bar */}
      {score > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">Reliability Score</p>
            <span className={`text-sm font-bold ${tier.color}`}>{score}/100</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                score >= 80 ? "bg-amber-400" : score >= 40 ? "bg-gray-400" : "bg-blue-400"
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">
            {score < 100
              ? `${Math.ceil((100 - score) / 20)} more donation${Math.ceil((100 - score) / 20) !== 1 ? "s" : ""} to reach Gold`
              : "You've reached the top tier. Thank you!"}
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        {(["active", "history"] as TabType[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors capitalize
              ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t === "active"
              ? `Active (${MOCK_DONATIONS.filter(d => ACTIVE_STATUSES.includes(d.status)).length})`
              : `History (${MOCK_DONATIONS.filter(d => HISTORY_STATUSES.includes(d.status)).length})`}
          </button>
        ))}
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
            {tab === "active" ? <Timer className="h-6 w-6 text-gray-400" /> : <Clock className="h-6 w-6 text-gray-400" />}
          </div>
          <p className="text-sm font-semibold text-gray-600">
            {tab === "active" ? "No active responses" : "No donation history yet"}
          </p>
          {tab === "active" && (
            <Link href="/dashboard/donor/requests" className="text-sm font-semibold text-red-600 hover:underline flex items-center gap-1">
              <Droplets className="h-3.5 w-3.5" /> Find a request to respond to
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map(d => {
            const cfg      = STATUS_CONFIG[d.status]
            const StatusIcon = cfg.icon

            return (
              <div key={d.id} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
                {/* Top */}
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm
                    ${d.status === "fulfilled" ? "bg-green-100 text-green-600"
                    : d.status === "confirmed" ? "bg-amber-100 text-amber-600"
                    : "bg-gray-100 text-gray-500"}`}>
                    {d.group}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900 truncate">{d.hospital}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${URGENCY_COLOR[d.urgency]}`}>
                        {URGENCY_LABEL[d.urgency]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5">
                      <MapPin className="h-3 w-3" />{d.area}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">{d.units} unit{d.units > 1 ? "s" : ""}</p>
                    <p className="text-[10px] text-gray-400">{d.respondedAt}</p>
                  </div>
                </div>

                {/* Status */}
                <div className={`flex items-center gap-2 ${cfg.bg} rounded-xl px-3 py-2`}>
                  <StatusIcon className={`h-4 w-4 ${cfg.color} shrink-0`} />
                  <span className={`text-xs font-semibold ${cfg.color} flex-1`}>{cfg.label}</span>
                  {d.status === "confirmed" && (
                    <Link
                      href={`/dashboard/donor/requests`}
                      className={`text-xs font-bold ${cfg.color} flex items-center gap-0.5`}
                    >
                      View details <ChevronRight className="h-3 w-3" />
                    </Link>
                  )}
                  {d.status === "fulfilled" && d.fulfilledAt && (
                    <span className="text-xs text-green-500">{d.fulfilledAt}</span>
                  )}
                </div>

                {/* Confirmed action CTA */}
                {d.status === "confirmed" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                    <p className="text-xs text-amber-700 font-medium">
                      Head to <strong>{d.hospital}</strong> and visit the blood bank. Show this request to the in-charge.
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Next donation CTA for history tab */}
      {tab === "history" && canDonate && (
        <Link
          href="/dashboard/donor/requests"
          className="flex items-center justify-center gap-2 w-full border-2 border-red-200 hover:border-red-400 text-red-600 font-semibold text-sm rounded-2xl py-3.5 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Donate again — find a request
        </Link>
      )}

    </div>
  )
}
