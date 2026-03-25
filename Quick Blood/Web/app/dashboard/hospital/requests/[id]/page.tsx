"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ChevronLeft, MapPin, Zap, CheckCircle2, Timer, Phone,
  MessageSquare, Star, AlertCircle, Users, Clock, Calendar,
  Share2, Edit3, XCircle,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_REQUESTS: Record<string, {
  id: number; group: string; units: number; patientName: string
  ward: string; bedNumber: string; doctorName: string
  urgency: string; status: string; postedAt: string; notes: string
  crossmatch: boolean
}> = {
  "1": {
    id: 1, group: "B+", units: 2, patientName: "Rahul M.",
    ward: "ICU", bedNumber: "12B", doctorName: "Dr. Anita Sharma",
    urgency: "urgent", status: "searching",
    postedAt: "25 Mar 2026, 9:40 AM", notes: "Post-operative. Stable condition.",
    crossmatch: true,
  },
  "2": {
    id: 2, group: "O-", units: 1, patientName: "Sneha K.",
    ward: "General", bedNumber: "5A", doctorName: "Dr. Rohan Patel",
    urgency: "urgent", status: "matched",
    postedAt: "25 Mar 2026, 9:20 AM", notes: "",
    crossmatch: false,
  },
}

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

const DONOR_POOL = [
  { id: "d1", name: "Arjun S.",   bloodGroup: "B+",  distanceKm: 1.2, available: true,  score: 80, responseStatus: "responded", lastDonated: null },
  { id: "d2", name: "Meera K.",   bloodGroup: "O-",  distanceKm: 2.1, available: true,  score: 60, responseStatus: "responded", lastDonated: null },
  { id: "d3", name: "Vikram P.",  bloodGroup: "B-",  distanceKm: 3.8, available: true,  score: 40, responseStatus: "notified",  lastDonated: "2025-12-01" },
  { id: "d4", name: "Pooja R.",   bloodGroup: "B+",  distanceKm: 4.5, available: true,  score: 20, responseStatus: "notified",  lastDonated: null },
  { id: "d5", name: "Suresh N.",  bloodGroup: "O+",  distanceKm: 6.2, available: true,  score: 60, responseStatus: "notified",  lastDonated: null },
]

function getCompatibleDonors(neededGroup: string) {
  return DONOR_POOL.filter(d => BLOOD_COMPAT[d.bloodGroup]?.includes(neededGroup))
}

type ResponseStatus = "notified" | "responded" | "confirmed" | "declined"

const RESP_CONFIG: Record<ResponseStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  notified:  { label: "Notified",         color: "text-gray-500",  bg: "bg-gray-100",  icon: Clock        },
  responded: { label: "Willing to donate",color: "text-blue-600",  bg: "bg-blue-50",  icon: CheckCircle2 },
  confirmed: { label: "Confirmed",        color: "text-green-600", bg: "bg-green-50", icon: Star         },
  declined:  { label: "Declined",         color: "text-red-400",   bg: "bg-red-50",   icon: AlertCircle  },
}

const URGENCY_COLOR: Record<string, string> = {
  urgent: "text-red-600 bg-red-50", scheduled: "text-blue-600 bg-blue-50", regular: "text-purple-600 bg-purple-50",
}
const STATUS_CONF: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  searching: { label: "Finding donors", color: "text-blue-600",  bg: "bg-blue-50",  icon: Timer        },
  matched:   { label: "Donor matched",  color: "text-amber-600", bg: "bg-amber-50", icon: Zap          },
  fulfilled: { label: "Fulfilled",      color: "text-green-600", bg: "bg-green-50", icon: CheckCircle2 },
}

function ScoreDots({ score }: { score: number }) {
  const filled = Math.round(score / 20)
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`w-2 h-2 rounded-full ${i < filled ? "bg-amber-400" : "bg-gray-200"}`} />
      ))}
    </div>
  )
}

function DonorCard({
  donor, localStatus, onConfirm, onDecline,
}: {
  donor: typeof DONOR_POOL[0]
  localStatus?: ResponseStatus
  onConfirm: (id: string) => void
  onDecline: (id: string) => void
}) {
  const status = (localStatus ?? donor.responseStatus) as ResponseStatus
  const cfg    = RESP_CONFIG[status]
  const Icon   = cfg.icon
  const initials = donor.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
  const inCooldown = donor.lastDonated
    ? (Date.now() - new Date(donor.lastDonated).getTime()) < 90 * 24 * 60 * 60 * 1000
    : false

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-sm font-bold
          ${status === "confirmed" ? "bg-green-600 text-white" : "bg-green-100 text-green-700"}`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-gray-900">{donor.name}</p>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">{donor.bloodGroup}</span>
            {inCooldown && <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">Cooldown</span>}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-gray-400 flex items-center gap-0.5"><MapPin className="h-3 w-3" />{donor.distanceKm} km</p>
            <ScoreDots score={donor.score} />
            <span className="text-[10px] text-gray-400">{donor.score}/100</span>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${cfg.bg} shrink-0`}>
          <Icon className={`h-3 w-3 ${cfg.color}`} />
          <span className={`text-[10px] font-semibold ${cfg.color}`}>{cfg.label}</span>
        </div>
      </div>

      {status === "responded" && !inCooldown && (
        <div className="flex gap-2">
          <button
            onClick={() => onConfirm(donor.id)}
            className="flex-1 bg-green-700 hover:bg-green-800 text-white text-xs font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Confirm donor
          </button>
          <a href={`tel:+91`} className="flex items-center gap-1 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold py-2 px-3 rounded-xl">
            <Phone className="h-3.5 w-3.5" />
          </a>
          <Link href={`/dashboard/chat/${donor.id}`} className="flex items-center gap-1 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold py-2 px-3 rounded-xl">
            <MessageSquare className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => onDecline(donor.id)}
            className="flex items-center gap-1 border border-red-100 hover:bg-red-50 text-red-400 text-xs font-semibold py-2 px-3 rounded-xl"
          >
            <XCircle className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {status === "confirmed" && (
        <div className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2">
          <Star className="h-4 w-4 text-green-600 shrink-0" />
          <p className="text-xs text-green-700 font-medium">Confirmed — direct donor to blood bank window.</p>
        </div>
      )}
    </div>
  )
}

// ── Fulfillment modal ─────────────────────────────────────────────────────────

function FulfillModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [units, setUnits] = useState("2")
  const [notes, setNotes] = useState("")
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-5 w-full max-w-sm space-y-4">
        <h3 className="text-base font-bold text-gray-900">Mark as Fulfilled</h3>
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-1.5">Units received</p>
          <input type="number" min={1} max={20} value={units} onChange={e => setUnits(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-1.5">Notes <span className="font-normal text-gray-400">(optional)</span></p>
          <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any remarks…"
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-600" />
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="flex-1 bg-green-700 hover:bg-green-800 text-white rounded-xl py-2.5 text-sm font-bold transition-colors">Confirm</button>
        </div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function HospitalRequestDetail() {
  const router = useRouter()
  const params = useParams()
  const id     = String(params.id)
  const request = MOCK_REQUESTS[id]

  const [localResponses, setLocalResponses] = useState<Record<string, ResponseStatus>>({})
  const [showFulfill, setShowFulfill]       = useState(false)
  const [fulfilled, setFulfilled]           = useState(false)
  const [showEdit, setShowEdit]             = useState(false)
  const [cancelled, setCancelled]           = useState(false)

  if (!request) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <p className="text-gray-500">Request not found.</p>
        <button onClick={() => router.back()} className="mt-4 text-green-700 text-sm font-semibold">Go back</button>
      </div>
    )
  }

  const statusCfg  = STATUS_CONF[request.status] ?? STATUS_CONF.searching
  const StatusIcon = statusCfg.icon
  const matchedDonors  = getCompatibleDonors(request.group)
  const respondedCount = matchedDonors.filter(d =>
    ["responded","confirmed"].includes(localResponses[d.id] ?? d.responseStatus)
  ).length

  function confirmDonor(id: string) {
    setLocalResponses(p => ({ ...p, [id]: "confirmed" }))
    toast.success("Donor confirmed — direct them to the blood bank window.")
  }
  function declineDonor(id: string) {
    setLocalResponses(p => ({ ...p, [id]: "declined" }))
    toast("Donor declined.")
  }

  function handleFulfill() {
    setShowFulfill(false)
    setFulfilled(true)
    toast.success("Request marked as fulfilled. Donor cooldown has started.")
  }

  const shareText = `Urgent: ${request.units} unit(s) of ${request.group} blood needed at our hospital. Please help! #QuickBlood`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {showFulfill && <FulfillModal onClose={() => setShowFulfill(false)} onConfirm={handleFulfill} />}

      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-900">Request Details</h1>
          <p className="text-xs text-gray-400">{request.postedAt}</p>
        </div>
        <a href={whatsappUrl} target="_blank" rel="noreferrer"
          className="p-2 rounded-xl hover:bg-green-50 text-green-600 transition-colors" title="Share on WhatsApp">
          <Share2 className="h-5 w-5" />
        </a>
      </div>

      {/* Status banners */}
      {fulfilled && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-300 rounded-2xl px-4 py-3">
          <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-bold text-green-800">Request fulfilled & closed!</p>
            <p className="text-xs text-green-600">Inventory will be updated. Donor cooldown started.</p>
          </div>
        </div>
      )}
      {cancelled && (
        <div className="flex items-center gap-3 bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3">
          <XCircle className="h-5 w-5 text-gray-500 shrink-0" />
          <p className="text-sm font-semibold text-gray-600">Request cancelled.</p>
        </div>
      )}

      {/* Request card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0 font-bold text-green-700">
            {request.group}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-gray-900">Patient: {request.patientName}</p>
              <span className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${URGENCY_COLOR[request.urgency]}`}>
                {request.urgency === "urgent" ? <Zap className="h-2.5 w-2.5" /> : <Calendar className="h-2.5 w-2.5" />}
                {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
              </span>
            </div>
          </div>
          <p className="text-sm font-bold text-gray-900 shrink-0">{request.units} unit{request.units > 1 ? "s" : ""}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
          <div><p className="text-gray-400">Ward / Bed</p><p className="font-semibold text-gray-800">{request.ward} · {request.bedNumber}</p></div>
          <div><p className="text-gray-400">Doctor</p><p className="font-semibold text-gray-800">{request.doctorName}</p></div>
          {request.crossmatch && (
            <div className="col-span-2">
              <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-2 py-1 font-medium">Crossmatch required before transfusion</p>
            </div>
          )}
        </div>

        {request.notes && (
          <p className="text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2">{request.notes}</p>
        )}

        <div className={`flex items-center gap-2 ${statusCfg.bg} rounded-xl px-3 py-2`}>
          <StatusIcon className={`h-4 w-4 ${statusCfg.color} shrink-0`} />
          <span className={`text-xs font-semibold ${statusCfg.color} flex-1`}>{statusCfg.label}</span>
          <span className={`text-xs font-bold ${statusCfg.color} flex items-center gap-1`}>
            <Users className="h-3 w-3" /> {respondedCount} responding
          </span>
        </div>

        {/* Edit / Cancel row */}
        {!fulfilled && !cancelled && (
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setShowEdit(true)}
              className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold py-2 rounded-xl transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit request
            </button>
            <button
              onClick={() => setCancelled(true)}
              className="flex-1 flex items-center justify-center gap-1.5 border border-red-100 hover:bg-red-50 text-red-500 text-xs font-semibold py-2 rounded-xl transition-colors"
            >
              <XCircle className="h-3.5 w-3.5" /> Cancel
            </button>
          </div>
        )}
      </div>

      {/* Matched donors */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <h2 className="text-sm font-bold text-gray-900">Matched Donors</h2>
          <span className="text-xs text-gray-400">({matchedDonors.length} compatible)</span>
          <span className="ml-auto text-xs text-gray-400">Sorted by distance</span>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          <p className="text-xs text-amber-700">Confirm a donor and direct them to the blood bank. <strong>Call or message</strong> to coordinate arrival time.</p>
        </div>

        {matchedDonors.sort((a, b) => a.distanceKm - b.distanceKm).map(donor => (
          <DonorCard
            key={donor.id}
            donor={donor}
            localStatus={localResponses[donor.id]}
            onConfirm={confirmDonor}
            onDecline={declineDonor}
          />
        ))}
      </div>

      {/* Mark fulfilled */}
      {!fulfilled && !cancelled && (
        <button
          onClick={() => setShowFulfill(true)}
          className="w-full border-2 border-green-300 hover:border-green-500 hover:bg-green-50 text-green-700 font-semibold text-sm rounded-2xl py-3 transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4" /> Mark as fulfilled
        </button>
      )}

      {/* Rate donor (post-fulfillment) */}
      {fulfilled && (
        <Link
          href={`/dashboard/feedback/donor`}
          className="flex items-center justify-center gap-2 w-full bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-700 font-semibold text-sm rounded-2xl py-3 transition-colors"
        >
          <Star className="h-4 w-4" /> Rate the donor
        </Link>
      )}
    </div>
  )
}
