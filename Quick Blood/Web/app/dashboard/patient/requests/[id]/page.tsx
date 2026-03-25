"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ChevronLeft, MapPin, Zap, Calendar, RefreshCw,
  CheckCircle2, Timer, Phone, MessageSquare, Star,
  AlertCircle, Users, Clock,
} from "lucide-react"
import { toast } from "sonner"

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_REQUESTS: Record<string, {
  id: number; group: string; units: number; hospital: string; area: string; city: string
  urgency: string; status: string; postedAt: string; patientName: string; doctorName: string
  notes: string
}> = {
  "1": {
    id: 1, group: "B+", units: 2,
    hospital: "Apollo Hospital", area: "Andheri", city: "Mumbai",
    urgency: "urgent", status: "searching",
    postedAt: "25 Mar 2026, 9:40 AM",
    patientName: "Rahul Mehta", doctorName: "Dr. Anita Sharma",
    notes: "Post-operative transfusion needed. Patient is stable.",
  },
  "2": {
    id: 2, group: "A+", units: 1,
    hospital: "Lilavati Hospital", area: "Bandra", city: "Mumbai",
    urgency: "scheduled", status: "matched",
    postedAt: "25 Mar 2026, 8:00 AM",
    patientName: "Sneha Mehta", doctorName: "Dr. Rohan Patel",
    notes: "",
  },
}

// Matching engine: mock donor pool filtered by blood compatibility
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

// Donors who can donate to a given group = those whose blood is in BLOOD_COMPAT[donorGroup] ∋ neededGroup
function getCompatibleDonors(neededGroup: string) {
  return DONOR_POOL.filter(d => BLOOD_COMPAT[d.bloodGroup]?.includes(neededGroup))
}

const DONOR_POOL = [
  { id: "d1", name: "Arjun S.",    bloodGroup: "B+",  distanceKm: 1.2, lastDonated: null,           available: true,  responseStatus: "responded" },
  { id: "d2", name: "Meera K.",    bloodGroup: "O-",  distanceKm: 2.1, lastDonated: null,           available: true,  responseStatus: "responded" },
  { id: "d3", name: "Vikram P.",   bloodGroup: "B-",  distanceKm: 3.8, lastDonated: "2025-12-01",   available: true,  responseStatus: "notified"  },
  { id: "d4", name: "Pooja R.",    bloodGroup: "B+",  distanceKm: 4.5, lastDonated: null,           available: true,  responseStatus: "notified"  },
  { id: "d5", name: "Suresh N.",   bloodGroup: "O+",  distanceKm: 6.2, lastDonated: "2026-01-10",   available: true,  responseStatus: "notified"  },
]

// ── Donor card ────────────────────────────────────────────────────────────────

type ResponseStatus = "notified" | "responded" | "confirmed" | "declined"
type LocalResponses = Record<string, ResponseStatus>

const RESP_CONFIG: Record<ResponseStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  notified:  { label: "Notified",      color: "text-gray-500",  bg: "bg-gray-100",  icon: Clock        },
  responded: { label: "Willing to donate", color: "text-blue-600",  bg: "bg-blue-50",  icon: CheckCircle2 },
  confirmed: { label: "Confirmed",     color: "text-green-600", bg: "bg-green-50", icon: Star         },
  declined:  { label: "Declined",      color: "text-red-400",   bg: "bg-red-50",   icon: AlertCircle  },
}

function DonorCard({
  donor,
  localStatus,
  onConfirm,
}: {
  donor: typeof DONOR_POOL[0]
  localStatus?: ResponseStatus
  onConfirm: (id: string) => void
}) {
  const status = (localStatus ?? donor.responseStatus) as ResponseStatus
  const cfg    = RESP_CONFIG[status]
  const Icon   = cfg.icon
  const initials = donor.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()

  // Cooldown check: last donated within 90 days?
  const inCooldown = donor.lastDonated
    ? (Date.now() - new Date(donor.lastDonated).getTime()) < 90 * 24 * 60 * 60 * 1000
    : false

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-sm font-bold
          ${status === "confirmed" ? "bg-green-600 text-white" : "bg-blue-100 text-blue-600"}`}>
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">{donor.name}</p>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">{donor.bloodGroup}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
            <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{donor.distanceKm} km away</span>
            {inCooldown && (
              <span className="text-amber-600 font-medium">• In cooldown</span>
            )}
          </div>
        </div>

        {/* Status badge */}
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${cfg.bg}`}>
          <Icon className={`h-3 w-3 ${cfg.color} shrink-0`} />
          <span className={`text-[10px] font-semibold ${cfg.color}`}>{cfg.label}</span>
        </div>
      </div>

      {/* Actions — only for responded donors */}
      {status === "responded" && !inCooldown && (
        <div className="flex gap-2">
          <button
            onClick={() => onConfirm(donor.id)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Confirm donor
          </button>
          <a
            href={`tel:+91${Math.floor(Math.random() * 9000000000) + 1000000000}`}
            className="flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold py-2 px-3 rounded-xl transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
            Call
          </a>
          <a
            href="#"
            className="flex items-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold py-2 px-3 rounded-xl transition-colors"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Chat
          </a>
        </div>
      )}

      {status === "confirmed" && (
        <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2">
          <Star className="h-4 w-4 text-green-600 shrink-0" />
          <p className="text-xs text-green-700 font-medium">Donor confirmed — coordinate at the hospital blood bank.</p>
        </div>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

const URGENCY_ICON: Record<string, React.ElementType> = {
  urgent: Zap, scheduled: Calendar, regular: RefreshCw,
}
const URGENCY_COLOR: Record<string, string> = {
  urgent: "text-red-600 bg-red-50",
  scheduled: "text-blue-600 bg-blue-50",
  regular: "text-purple-600 bg-purple-50",
}
const URGENCY_LABEL: Record<string, string> = {
  urgent: "Urgent", scheduled: "Scheduled", regular: "Regular",
}
const STATUS_CONF: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  searching: { label: "Finding donors",  color: "text-blue-600",  bg: "bg-blue-50",  icon: Timer        },
  matched:   { label: "Donor matched",   color: "text-amber-600", bg: "bg-amber-50", icon: Zap          },
  fulfilled: { label: "Fulfilled",       color: "text-green-600", bg: "bg-green-50", icon: CheckCircle2 },
}

export default function PatientRequestDetail() {
  const router   = useRouter()
  const params   = useParams()
  const id       = String(params.id)
  const request  = MOCK_REQUESTS[id]

  const [localResponses, setLocalResponses] = useState<LocalResponses>({})
  const [fulfilling, setFulfilling]         = useState(false)
  const [fulfilled, setFulfilled]           = useState(false)

  if (!request) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <p className="text-gray-500">Request not found.</p>
        <button onClick={() => router.back()} className="mt-4 text-blue-600 text-sm font-semibold">Go back</button>
      </div>
    )
  }

  const UrgIcon    = URGENCY_ICON[request.urgency]
  const statusCfg  = STATUS_CONF[request.status] ?? STATUS_CONF.searching
  const StatusIcon = statusCfg.icon

  const matchedDonors  = getCompatibleDonors(request.group)
  const respondedCount = matchedDonors.filter(d =>
    (localResponses[d.id] ?? d.responseStatus) === "responded" ||
    (localResponses[d.id] ?? d.responseStatus) === "confirmed"
  ).length

  function confirmDonor(donorId: string) {
    setLocalResponses(prev => ({ ...prev, [donorId]: "confirmed" }))
    toast.success("Donor confirmed! Please coordinate at the blood bank.")
  }

  function markFulfilled() {
    setFulfilling(true)
    setTimeout(() => {
      setFulfilling(false)
      setFulfilled(true)
      toast.success("Request marked as fulfilled. Thank you!")
    }, 1000)
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Request Details</h1>
          <p className="text-xs text-gray-400">{request.postedAt}</p>
        </div>
      </div>

      {/* Fulfilled banner */}
      {fulfilled && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-300 rounded-2xl px-4 py-3">
          <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-bold text-green-800">Request marked as fulfilled!</p>
            <p className="text-xs text-green-600">Thank you. The donor's cooldown has been started.</p>
          </div>
        </div>
      )}

      {/* Request card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 font-bold text-blue-600">
            {request.group}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-gray-900">{request.hospital}</p>
              <span className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${URGENCY_COLOR[request.urgency]}`}>
                <UrgIcon className="h-2.5 w-2.5" />
                {URGENCY_LABEL[request.urgency]}
              </span>
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5">
              <MapPin className="h-3 w-3" />{request.area}, {request.city}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-bold text-gray-900">{request.units} unit{request.units > 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
          <div>
            <p className="text-gray-400">Patient</p>
            <p className="font-semibold text-gray-800">{request.patientName}</p>
          </div>
          <div>
            <p className="text-gray-400">Doctor</p>
            <p className="font-semibold text-gray-800">{request.doctorName}</p>
          </div>
        </div>

        {request.notes && (
          <p className="text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">{request.notes}</p>
        )}

        {/* Status */}
        <div className={`flex items-center gap-2 ${statusCfg.bg} rounded-xl px-3 py-2`}>
          <StatusIcon className={`h-4 w-4 ${statusCfg.color} shrink-0`} />
          <span className={`text-xs font-semibold ${statusCfg.color} flex-1`}>{statusCfg.label}</span>
          <span className={`text-xs font-bold ${statusCfg.color}`}>{respondedCount} responding</span>
        </div>
      </div>

      {/* Matched donors */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <h2 className="text-sm font-bold text-gray-900">Matched Donors</h2>
          <span className="text-xs text-gray-400 font-medium">({matchedDonors.length} compatible)</span>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          <p className="text-xs text-amber-700">
            Donors are sorted by distance. <strong>Confirm</strong> one to proceed — they'll coordinate at the blood bank.
          </p>
        </div>

        {matchedDonors.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <p className="text-sm text-gray-500">No compatible donors found yet. We'll keep searching.</p>
          </div>
        ) : (
          matchedDonors
            .sort((a, b) => a.distanceKm - b.distanceKm)
            .map(donor => (
              <DonorCard
                key={donor.id}
                donor={donor}
                localStatus={localResponses[donor.id]}
                onConfirm={confirmDonor}
              />
            ))
        )}
      </div>

      {/* Mark fulfilled */}
      {!fulfilled && request.status !== "fulfilled" && (
        <button
          onClick={markFulfilled}
          disabled={fulfilling}
          className="w-full border-2 border-green-300 hover:border-green-500 hover:bg-green-50 text-green-700 font-semibold text-sm rounded-2xl py-3 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {fulfilling ? (
            <><Timer className="h-4 w-4 animate-spin" /> Marking as fulfilled…</>
          ) : (
            <><CheckCircle2 className="h-4 w-4" /> Mark request as fulfilled</>
          )}
        </button>
      )}

    </div>
  )
}
