"use client"

import { useEffect, useState } from "react"
import {
  Droplets, PlusCircle, ChevronRight, Zap, CheckCircle2,
  AlertTriangle, Users, Activity, Timer,
} from "lucide-react"
import Link from "next/link"
import type { QBSession } from "../layout"

// ── Mock data ──────────────────────────────────────────────────────────────────

const MOCK_INVENTORY: Record<string, number> = {
  "O-": 4, "O+": 12, "A-": 2, "A+": 8,
  "B-": 1, "B+": 6, "AB-": 0, "AB+": 3,
}

const BLOOD_GROUPS = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"]

const LOW_THRESHOLD  = 3
const CRIT_THRESHOLD = 1

const MOCK_ACTIVE_REQUESTS = [
  { id: 1, group: "B+",  units: 2, patientName: "Rahul M.",    urgency: "urgent",    respondents: 4, postedAt: "5 min ago"  },
  { id: 2, group: "O-",  units: 1, patientName: "Sneha K.",    urgency: "urgent",    respondents: 1, postedAt: "20 min ago" },
  { id: 3, group: "AB+", units: 3, patientName: "Vikram P.",   urgency: "scheduled", respondents: 0, postedAt: "1 hr ago"   },
]

const MOCK_FULFILLED_TODAY = 5

function inventoryStatus(units: number): "critical" | "low" | "ok" {
  if (units <= CRIT_THRESHOLD) return "critical"
  if (units <= LOW_THRESHOLD)  return "low"
  return "ok"
}

const INV_COLOR: Record<string, string> = {
  critical: "text-red-600",
  low:      "text-amber-600",
  ok:       "text-green-600",
}

const INV_BG: Record<string, string> = {
  critical: "bg-red-50 border-red-200",
  low:      "bg-amber-50 border-amber-200",
  ok:       "bg-green-50 border-green-200",
}

export default function HospitalHome() {
  const [session, setSession] = useState<QBSession | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem("qb_session")
    if (!raw) return
    setSession(JSON.parse(raw) as QBSession)
  }, [])

  if (!session) return null

  const criticalGroups = BLOOD_GROUPS.filter(g => inventoryStatus(MOCK_INVENTORY[g]) === "critical")
  const lowGroups      = BLOOD_GROUPS.filter(g => inventoryStatus(MOCK_INVENTORY[g]) === "low")
  const totalUnits     = Object.values(MOCK_INVENTORY).reduce((a, b) => a + b, 0)

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* ── Greeting ── */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Hello, {session.name.split(" ")[0]} 👋</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {criticalGroups.length > 0
            ? `Critical stock alert: ${criticalGroups.join(", ")} — post a request now.`
            : "Blood bank status looks healthy. Keep it updated."}
        </p>
      </div>

      {/* ── Critical alert banner ── */}
      {criticalGroups.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-red-700">Critical stock: {criticalGroups.join(", ")}</p>
            <p className="text-xs text-red-500 mt-0.5">
              {criticalGroups.length === 1 ? "This group is" : "These groups are"} at or below 1 unit. Post a donor request immediately.
            </p>
          </div>
          <Link
            href="/dashboard/hospital/request/new"
            className="shrink-0 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-red-700 transition-colors"
          >
            Post now
          </Link>
        </div>
      )}

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-2 gap-3">
        {[
          {
            icon: Droplets,
            label: "Total Blood Units",
            value: String(totalUnits),
            sub: `Across ${BLOOD_GROUPS.length} groups`,
            color: "text-green-700",
            bg: "bg-green-50",
          },
          {
            icon: Activity,
            label: "Active Requests",
            value: String(MOCK_ACTIVE_REQUESTS.length),
            sub: "Finding donors",
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            icon: CheckCircle2,
            label: "Fulfilled Today",
            value: String(MOCK_FULFILLED_TODAY),
            sub: "Requests completed",
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            icon: Users,
            label: "Low Stock",
            value: String(criticalGroups.length + lowGroups.length),
            sub: "Groups need attention",
            color: criticalGroups.length > 0 ? "text-red-600" : "text-amber-600",
            bg:    criticalGroups.length > 0 ? "bg-red-50"    : "bg-amber-50",
          },
        ].map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 space-y-2">
            <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-[10px] text-gray-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Blood inventory grid ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Blood Inventory</h2>
          <Link href="/dashboard/hospital/inventory" className="text-xs text-green-700 font-semibold flex items-center gap-0.5">
            Manage <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {BLOOD_GROUPS.map(group => {
            const units  = MOCK_INVENTORY[group]
            const status = inventoryStatus(units)
            return (
              <div
                key={group}
                className={`rounded-2xl border p-3 flex flex-col items-center gap-1 ${INV_BG[status]}`}
              >
                <p className={`text-sm font-bold ${INV_COLOR[status]}`}>{group}</p>
                <p className={`text-xl font-black ${INV_COLOR[status]}`}>{units}</p>
                <p className="text-[9px] text-gray-400 font-medium">units</p>
              </div>
            )
          })}
        </div>

        <p className="text-[10px] text-gray-400 text-center">
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Critical (≤1)</span>
          {"  "}
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Low (≤3)</span>
          {"  "}
          <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> OK (&gt;3)</span>
        </p>
      </div>

      {/* ── Active requests ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Active Donor Requests</h2>
          <Link href="/dashboard/hospital/requests" className="text-xs text-green-700 font-semibold flex items-center gap-0.5">
            See all <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {MOCK_ACTIVE_REQUESTS.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Droplets className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-600">No active requests</p>
            <p className="text-xs text-gray-400">Post a donor request when you need blood.</p>
          </div>
        ) : (
          MOCK_ACTIVE_REQUESTS.map(req => (
            <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm
                ${req.urgency === "urgent" ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"}`}>
                {req.group}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">Patient: {req.patientName}</p>
                  {req.urgency === "urgent" && (
                    <span className="shrink-0 flex items-center gap-0.5 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                      <Zap className="h-2.5 w-2.5" /> URGENT
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400">{req.postedAt}</span>
                  {req.respondents > 0 ? (
                    <span className="text-xs font-semibold text-blue-600 flex items-center gap-0.5">
                      <Users className="h-3 w-3" /> {req.respondents} responding
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 flex items-center gap-0.5">
                      <Timer className="h-3 w-3" /> Searching…
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gray-900">{req.units} unit{req.units > 1 ? "s" : ""}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── New request CTA ── */}
      <Link
        href="/dashboard/hospital/request/new"
        className="flex items-center justify-center gap-2 w-full bg-green-700 hover:bg-green-800 text-white font-semibold text-sm rounded-2xl py-3.5 transition-colors"
      >
        <PlusCircle className="h-4 w-4" />
        Post new donor request
      </Link>

    </div>
  )
}
