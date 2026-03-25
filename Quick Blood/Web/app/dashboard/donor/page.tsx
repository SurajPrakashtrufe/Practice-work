"use client"

import { useEffect, useState } from "react"
import { Droplets, MapPin, Clock, Heart, ChevronRight, Zap, TrendingUp, BadgeCheck } from "lucide-react"
import { toast } from "sonner"
import type { QBSession } from "../layout"

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

function addDays(d: Date, n: number) {
  const r = new Date(d); r.setDate(r.getDate() + n); return r
}
function formatDate(d: Date) {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

// ── Mock nearby requests (will come from API) ─────────────────────────────────
const MOCK_REQUESTS = [
  { id: 1, group: "B+",  units: 2, hospital: "Apollo Hospital",  area: "Andheri, Mumbai",  urgency: "urgent",    time: "10 min ago" },
  { id: 2, group: "O-",  units: 1, hospital: "Lilavati Hospital", area: "Bandra, Mumbai",   urgency: "scheduled", time: "1 hr ago"   },
  { id: 3, group: "B+",  units: 3, hospital: "KEM Hospital",      area: "Parel, Mumbai",    urgency: "urgent",    time: "2 hrs ago"  },
]

export default function DonorHome() {
  const [session, setSession]           = useState<QBSession | null>(null)
  const [available, setAvailable]       = useState(true)
  const [toggling, setToggling]         = useState(false)
  const [lastDonation]                  = useState<Date | null>(null)   // null = never donated

  useEffect(() => {
    const raw = localStorage.getItem("qb_session")
    if (!raw) return
    const s = JSON.parse(raw) as QBSession
    setSession(s)
    setAvailable(s.isAvailable)
  }, [])

  function toggleAvailability() {
    if (toggling) return
    setToggling(true)
    setTimeout(() => {
      const next = !available
      setAvailable(next)
      const raw = localStorage.getItem("qb_session")
      if (raw) {
        const s = JSON.parse(raw) as QBSession
        localStorage.setItem("qb_session", JSON.stringify({ ...s, isAvailable: next }))
      }
      setToggling(false)
      toast.success(next ? "You're now available to donate" : "You've been marked unavailable")
    }, 600)
  }

  const nextEligible = lastDonation ? addDays(lastDonation, 90) : null
  const canDonate    = !nextEligible || new Date() >= nextEligible
  const compatible   = BLOOD_COMPAT[session?.bloodGroup ?? ""] ?? []

  // Filter mock requests to compatible blood groups
  const nearbyRequests = MOCK_REQUESTS.filter(r => compatible.includes(r.group))

  if (!session) return null

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* ── Greeting ── */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Hello, {session.name.split(" ")[0]} 👋</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {available && canDonate
            ? "You're available. Donors like you save lives every day."
            : !canDonate
              ? "You're in cooldown period. Rest up — you'll be eligible soon."
              : "You're currently unavailable. Toggle to help when you're ready."}
        </p>
      </div>

      {/* ── Availability toggle card ── */}
      <div className={`rounded-2xl p-5 transition-colors ${available && canDonate ? "bg-green-600" : "bg-gray-300"}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-white/80 text-xs font-semibold uppercase tracking-wide">
              Donation Status
            </p>
            <p className="text-white text-2xl font-bold">
              {available && canDonate ? "Available" : !canDonate ? "In Cooldown" : "Unavailable"}
            </p>
            <p className="text-white/70 text-xs">
              {available && canDonate
                ? "Visible to hospitals and patients near you"
                : !canDonate && nextEligible
                  ? `Eligible again on ${formatDate(nextEligible)}`
                  : "You won't receive blood request notifications"}
            </p>
          </div>

          {canDonate && (
            <button
              onClick={toggleAvailability}
              disabled={toggling}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none
                ${available ? "bg-white/30" : "bg-white/20"}`}
            >
              <span className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300
                ${available ? "left-7" : "left-1"}`} />
            </button>
          )}
        </div>

        {available && canDonate && (
          <div className="mt-4 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
            <BadgeCheck className="h-4 w-4 text-white/80 shrink-0" />
            <p className="text-white/90 text-xs">
              Your profile shows a <strong>green Available badge</strong> to nearby patients and hospitals.
            </p>
          </div>
        )}
      </div>

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            icon: Droplets,
            label: "Blood Group",
            value: session.bloodGroup,
            sub: `Donates to ${compatible.length} groups`,
            color: "text-red-600",
            bg: "bg-red-50",
          },
          {
            icon: Heart,
            label: "Donations",
            value: "0",
            sub: "Total confirmed",
            color: "text-pink-600",
            bg: "bg-pink-50",
          },
          {
            icon: Clock,
            label: "Next Eligible",
            value: canDonate ? "Now" : nextEligible ? formatDate(nextEligible) : "Now",
            sub: canDonate ? "Ready to donate" : "Days remaining",
            color: "text-blue-600",
            bg: "bg-blue-50",
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

      {/* ── Reliability score ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
          <TrendingUp className="h-6 w-6 text-amber-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">Reliability Score</p>
          <div className="mt-1.5 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-0 bg-amber-400 rounded-full" />
          </div>
          <p className="text-xs text-gray-400 mt-1">Donate to start building your score</p>
        </div>
        <span className="text-2xl font-bold text-amber-500">—</span>
      </div>

      {/* ── Nearby requests ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Nearby Blood Requests</h2>
          <button className="text-xs text-red-600 font-semibold flex items-center gap-0.5">
            See all <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {nearbyRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Droplets className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-600">No active requests near you</p>
            <p className="text-xs text-gray-400">
              You'll get notified as soon as a patient needs {session.bloodGroup} blood nearby.
            </p>
          </div>
        ) : (
          nearbyRequests.map(req => (
            <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm
                ${req.urgency === "urgent" ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"}`}>
                {req.group}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">{req.hospital}</p>
                  {req.urgency === "urgent" && (
                    <span className="shrink-0 flex items-center gap-0.5 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                      <Zap className="h-2.5 w-2.5" /> URGENT
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3" />{req.area}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gray-900">{req.units} unit{req.units > 1 ? "s" : ""}</p>
                <p className="text-[10px] text-gray-400">{req.time}</p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}
