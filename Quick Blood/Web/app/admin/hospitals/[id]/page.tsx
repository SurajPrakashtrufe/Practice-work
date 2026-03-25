"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ChevronLeft, Building, CheckCircle2, XCircle, Clock,
  Phone, Mail, Globe, MapPin, FileText, AlertTriangle, BadgeCheck,
} from "lucide-react"

const HOSPITALS: Record<string, {
  id: string; name: string; type: string; city: string; regNo: string
  address: string; phone: string; email: string; website: string
  managerName: string; managerPhone: string; managerEmail: string
  nabh: boolean; beds: number; hasBloodBank: boolean; status: string
  submitted: string; docUrl: string
}> = {
  h1: {
    id: "h1", name: "Sunrise Medical Centre", type: "Private", city: "Pune",
    regNo: "MH-2022-HOS-1234", address: "Plot 7, Baner Road, Pune, Maharashtra 411045",
    phone: "+91 20 4567 8900", email: "admin@sunrisemc.com", website: "www.sunrisemc.com",
    managerName: "Dr. Suresh Joshi", managerPhone: "+91 98201 45678", managerEmail: "suresh@sunrisemc.com",
    nabh: false, beds: 120, hasBloodBank: true, status: "pending",
    submitted: "2 hrs ago", docUrl: "#",
  },
  h2: {
    id: "h2", name: "Green Valley Hospital", type: "Government", city: "Nashik",
    regNo: "MH-2018-HOS-9901", address: "Near Civil Court, Nashik, Maharashtra 422001",
    phone: "+91 253 2234 5678", email: "gvh@nashik.gov.in", website: "",
    managerName: "Dr. Kavita Patil", managerPhone: "+91 97700 12345", managerEmail: "kvpatil@nashik.gov.in",
    nabh: true, beds: 350, hasBloodBank: true, status: "pending",
    submitted: "5 hrs ago", docUrl: "#",
  },
  h3: {
    id: "h3", name: "Care & Cure Hospital", type: "NGO", city: "Mumbai",
    regNo: "MH-2020-HOS-5517", address: "14, Linking Road, Santacruz West, Mumbai 400054",
    phone: "+91 22 2660 1234", email: "info@carecure.org", website: "carecure.org",
    managerName: "Mr. Ravi Nair", managerPhone: "+91 90001 23456", managerEmail: "ravi@carecure.org",
    nabh: false, beds: 60, hasBloodBank: false, status: "pending",
    submitted: "1 day ago", docUrl: "#",
  },
}

type Decision = "approved" | "rejected" | null

export default function HospitalVerification() {
  const router = useRouter()
  const params = useParams()
  const id     = String(params.id)
  const h      = HOSPITALS[id]

  const [decision, setDecision]   = useState<Decision>(null)
  const [reason, setReason]       = useState("")
  const [confirming, setConfirming] = useState<"approve" | "reject" | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!h) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <p className="text-gray-500">Hospital not found.</p>
        <button onClick={() => router.back()} className="mt-4 text-indigo-600 text-sm font-semibold">Go back</button>
      </div>
    )
  }

  function confirmAction(type: "approve" | "reject") {
    if (type === "reject" && !reason.trim()) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setDecision(type === "approve" ? "approved" : "rejected")
      setConfirming(null)
    }, 1000)
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Hospital Review</h1>
          <p className="text-xs text-gray-400">Submitted {h.submitted}</p>
        </div>
      </div>

      {/* Decision banner */}
      {decision === "approved" && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-300 rounded-2xl px-4 py-3">
          <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-bold text-green-800">Hospital approved & verified!</p>
            <p className="text-xs text-green-600">{h.name} will receive their Verified badge and can start posting requests.</p>
          </div>
        </div>
      )}
      {decision === "rejected" && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
          <XCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm font-semibold text-red-700">Application rejected. Hospital has been notified.</p>
        </div>
      )}

      {/* Hospital info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
            <Building className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-base font-bold text-gray-900">{h.name}</p>
              {h.nabh && <BadgeCheck className="h-4 w-4 text-blue-600" title="NABH" />}
            </div>
            <p className="text-sm text-gray-500">{h.type} · {h.city}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {h.hasBloodBank && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">Blood Bank</span>}
              <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">{h.beds} beds</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full shrink-0">
            <Clock className="h-3 w-3 text-amber-600" />
            <span className="text-[10px] font-bold text-amber-600">Pending</span>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-gray-100 text-sm">
          {[
            { icon: FileText, label: "Reg. number",  value: h.regNo    },
            { icon: MapPin,   label: "Address",       value: h.address   },
            { icon: Phone,    label: "Phone",          value: h.phone     },
            { icon: Mail,     label: "Email",          value: h.email     },
            ...(h.website ? [{ icon: Globe, label: "Website", value: h.website }] : []),
          ].map(r => (
            <div key={r.label} className="flex items-start gap-2">
              <r.icon className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-xs text-gray-400">{r.label}: </span>
                <span className="text-xs font-medium text-gray-700">{r.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manager */}
      <div className="bg-white rounded-2xl border border-gray-100 px-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide pt-4 pb-2">Account manager</p>
        <div className="space-y-2 pb-4">
          {[
            { label: "Name",  value: h.managerName  },
            { label: "Phone", value: h.managerPhone },
            { label: "Email", value: h.managerEmail },
          ].map(r => (
            <div key={r.label} className="flex gap-2 text-sm">
              <span className="text-gray-400 w-12 shrink-0">{r.label}</span>
              <span className="font-medium text-gray-800">{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Document */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">Hospital Registration Document</p>
          <p className="text-xs text-gray-400">PDF / JPG uploaded at registration</p>
        </div>
        <a href={h.docUrl} className="text-xs font-bold text-blue-600 hover:underline">View</a>
      </div>

      {/* Actions */}
      {!decision && (
        <div className="space-y-3">
          {/* Reject: reason input */}
          {confirming === "reject" && (
            <div className="bg-white rounded-2xl border border-red-200 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                <p className="text-sm font-bold text-red-700">Reason for rejection *</p>
              </div>
              <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)}
                placeholder="e.g. Registration number could not be verified. Document unclear."
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400" />
              <div className="flex gap-2">
                <button onClick={() => setConfirming(null)}
                  className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button
                  onClick={() => confirmAction("reject")}
                  disabled={!reason.trim() || submitting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-bold transition-colors">
                  {submitting ? "Rejecting…" : "Confirm rejection"}
                </button>
              </div>
            </div>
          )}

          {confirming === "approve" && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-3">
              <p className="text-sm font-bold text-green-800">Approve <strong>{h.name}</strong>?</p>
              <p className="text-xs text-green-700">They will receive a Verified badge and be able to post blood requests immediately.</p>
              <div className="flex gap-2">
                <button onClick={() => setConfirming(null)}
                  className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50">Cancel</button>
                <button
                  onClick={() => confirmAction("approve")}
                  disabled={submitting}
                  className="flex-1 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-bold transition-colors">
                  {submitting ? "Approving…" : "Approve hospital"}
                </button>
              </div>
            </div>
          )}

          {!confirming && (
            <div className="flex gap-3">
              <button
                onClick={() => setConfirming("reject")}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-red-200 hover:border-red-400 text-red-600 font-semibold text-sm rounded-2xl py-3 transition-colors"
              >
                <XCircle className="h-4 w-4" /> Reject
              </button>
              <button
                onClick={() => setConfirming("approve")}
                className="flex-1 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold text-sm rounded-2xl py-3 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" /> Approve
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
