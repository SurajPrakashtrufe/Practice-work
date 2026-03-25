"use client"

import { useEffect, useState } from "react"
import { MapPin, Zap, Calendar, RefreshCw, CheckCircle2, Clock, Filter } from "lucide-react"
import { toast } from "sonner"
import type { QBSession } from "../../layout"

// ── Blood compatibility map ───────────────────────────────────────────────────
const BLOOD_COMPAT: Record<string, string[]> = {
  "O-":  ["O-","O+","A-","A+","B-","B+","AB-","AB+"],
  "O+":  ["O+","A+","B+","AB+"],
  "A-":  ["A-","A+","AB-","AB+"],
  "A+":  ["A+","AB+"],
  "B-":  ["B-","B+","AB-","AB+"],
  "B+":  ["B+","AB+"],
  "AB-": ["AB-","AB+"],
  "AB+": ["AB+"],
}

// ── Mock request pool ─────────────────────────────────────────────────────────
const ALL_REQUESTS = [
  { id: 1,  group: "B+",  units: 2, source: "Apollo Hospital",      area: "Andheri, Mumbai",    urgency: "urgent",    distanceKm: 1.2, postedAt: "5 min ago",   status: "open" },
  { id: 2,  group: "O-",  units: 1, source: "Lilavati Hospital",    area: "Bandra, Mumbai",     urgency: "urgent",    distanceKm: 3.4, postedAt: "20 min ago",  status: "open" },
  { id: 3,  group: "B+",  units: 3, source: "KEM Hospital",         area: "Parel, Mumbai",      urgency: "urgent",    distanceKm: 5.1, postedAt: "1 hr ago",    status: "open" },
  { id: 4,  group: "A+",  units: 1, source: "Kokilaben Hospital",   area: "Versova, Mumbai",    urgency: "scheduled", distanceKm: 6.8, postedAt: "2 hrs ago",   status: "open" },
  { id: 5,  group: "AB+", units: 2, source: "Nanavati Hospital",    area: "Vile Parle, Mumbai", urgency: "scheduled", distanceKm: 8.3, postedAt: "3 hrs ago",   status: "open" },
  { id: 6,  group: "O+",  units: 1, source: "Hinduja Hospital",     area: "Mahim, Mumbai",      urgency: "regular",   distanceKm: 4.0, postedAt: "5 hrs ago",   status: "open" },
  { id: 7,  group: "A-",  units: 2, source: "Breach Candy Hospital",area: "Breach Candy, Mumbai",urgency: "urgent",   distanceKm: 9.2, postedAt: "6 hrs ago",   status: "open" },
]

type FilterType = "all" | "urgent" | "nearby"
type DonorStatus = "none" | "pending" | "accepted"

const URGENCY_ICON: Record<string, React.ElementType> = {
  urgent:    Zap,
  scheduled: Calendar,
  regular:   RefreshCw,
}
const URGENCY_COLOR: Record<string, string> = {
  urgent:    "text-red-600 bg-red-50",
  scheduled: "text-blue-600 bg-blue-50",
  regular:   "text-purple-600 bg-purple-50",
}
const URGENCY_LABEL: Record<string, string> = {
  urgent:    "Urgent",
  scheduled: "Scheduled",
  regular:   "Regular",
}

export default function DonorRequests() {
  const [session, setSession]   = useState<QBSession | null>(null)
  const [filter, setFilter]     = useState<FilterType>("all")
  const [responses, setResponses] = useState<Record<number, DonorStatus>>({})

  useEffect(() => {
    const raw = localStorage.getItem("qb_session")
    if (!raw) return
    setSession(JSON.parse(raw) as QBSession)
  }, [])

  if (!session) return null

  const compatible = BLOOD_COMPAT[session.bloodGroup] ?? []

  const matched = ALL_REQUESTS.filter(r => compatible.includes(r.group))

  const filtered = matched.filter(r => {
    if (filter === "urgent")  return r.urgency === "urgent"
    if (filter === "nearby")  return r.distanceKm <= 5
    return true
  })

  function respond(id: number) {
    setResponses(prev => ({ ...prev, [id]: "pending" }))
    setTimeout(() => {
      setResponses(prev => ({ ...prev, [id]: "accepted" }))
      toast.success("Response sent! The hospital will confirm your donation.")
    }, 800)
  }

  const urgentCount = matched.filter(r => r.urgency === "urgent").length

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Blood Requests</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Showing requests compatible with your blood group <strong className="text-red-600">{session.bloodGroup}</strong>
        </p>
      </div>

      {/* Urgent alert */}
      {urgentCount > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
          <Zap className="h-5 w-5 text-red-600 shrink-0" />
          <p className="text-sm font-semibold text-red-700">
            {urgentCount} urgent request{urgentCount > 1 ? "s" : ""} near you — donors like you save lives.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400 shrink-0" />
        {(["all", "urgent", "nearby"] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors capitalize
              ${filter === f ? "bg-red-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            {f === "nearby" ? "Nearby (≤5 km)" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400">{filtered.length} request{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Request list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Clock className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-600">No requests match this filter</p>
          <p className="text-xs text-gray-400">Try switching to "All" or check back soon.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(req => {
            const UrgIcon    = URGENCY_ICON[req.urgency]
            const status     = responses[req.id] ?? "none"
            const accepted   = status === "accepted"
            const pending    = status === "pending"

            return (
              <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">

                {/* Top row */}
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm
                    ${req.urgency === "urgent" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}>
                    {req.group}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900 truncate">{req.source}</p>
                      <span className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${URGENCY_COLOR[req.urgency]}`}>
                        <UrgIcon className="h-2.5 w-2.5" />
                        {URGENCY_LABEL[req.urgency]}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                      <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{req.area}</span>
                      <span>{req.distanceKm} km away</span>
                      <span>{req.postedAt}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">{req.units} unit{req.units > 1 ? "s" : ""}</p>
                    <p className="text-[10px] text-gray-400">needed</p>
                  </div>
                </div>

                {/* Compatibility badge */}
                <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                  <p className="text-xs text-green-700 font-medium">
                    Your <strong>{session.bloodGroup}</strong> blood is compatible with this request
                  </p>
                </div>

                {/* Action */}
                {accepted ? (
                  <div className="flex items-center justify-center gap-2 bg-green-600 rounded-xl py-2.5">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                    <span className="text-sm font-bold text-white">Response sent — thank you!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => respond(req.id)}
                    disabled={pending}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-colors
                      ${req.urgency === "urgent"
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-gray-900 hover:bg-gray-800 text-white"}
                      disabled:opacity-60`}
                  >
                    {pending ? "Sending response…" : "I can donate — respond"}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
