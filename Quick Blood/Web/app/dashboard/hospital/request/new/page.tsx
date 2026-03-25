"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft, ChevronRight, Droplets, User, Zap, Calendar, RefreshCw,
  CheckCircle2, Loader2, Bed,
} from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

type Urgency = "urgent" | "scheduled" | "regular"

interface FormData {
  // Step 1 — Patient info
  patientName: string
  patientAge: string
  ward: string
  bedNumber: string
  doctorName: string
  // Step 2 — Blood requirement
  bloodGroup: string
  units: string
  urgency: Urgency
  scheduledDate: string
  crossmatch: boolean
  notes: string
}

const INITIAL: FormData = {
  patientName: "", patientAge: "", ward: "", bedNumber: "", doctorName: "",
  bloodGroup: "", units: "1", urgency: "urgent", scheduledDate: "",
  crossmatch: false, notes: "",
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

// ── Sub-components ────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-gray-700 mb-1.5">{children}</p>
}

function TextInput({
  placeholder, value, onChange, type = "text",
}: {
  placeholder: string; value: string; onChange: (v: string) => void; type?: string
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
    />
  )
}

// ── Steps ─────────────────────────────────────────────────────────────────────

function Step1({ data, set }: { data: FormData; set: (k: keyof FormData, v: string | boolean) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Patient full name *</FieldLabel>
        <TextInput placeholder="e.g. Rahul Mehta" value={data.patientName} onChange={v => set("patientName", v)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Age *</FieldLabel>
          <TextInput placeholder="e.g. 45" type="number" value={data.patientAge} onChange={v => set("patientAge", v)} />
        </div>
        <div>
          <FieldLabel>Ward / department</FieldLabel>
          <TextInput placeholder="e.g. ICU, Oncology" value={data.ward} onChange={v => set("ward", v)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Bed number</FieldLabel>
          <div className="relative">
            <Bed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="e.g. 12B"
              value={data.bedNumber}
              onChange={e => set("bedNumber", e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>
        <div>
          <FieldLabel>Doctor name *</FieldLabel>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Dr. Sharma"
              value={data.doctorName}
              onChange={e => set("doctorName", e.target.value)}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function Step2({ data, set }: { data: FormData; set: (k: keyof FormData, v: string | boolean) => void }) {
  return (
    <div className="space-y-5">
      {/* Blood group */}
      <div>
        <FieldLabel>Blood group required *</FieldLabel>
        <div className="grid grid-cols-4 gap-2">
          {BLOOD_GROUPS.map(g => (
            <button
              key={g}
              type="button"
              onClick={() => set("bloodGroup", g)}
              className={`py-3 rounded-xl text-sm font-bold border-2 transition-colors
                ${data.bloodGroup === g
                  ? "border-green-700 bg-green-700 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-green-400"}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Units */}
      <div>
        <FieldLabel>Units required *</FieldLabel>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => set("units", String(Math.max(1, Number(data.units) - 1)))}
            className="w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-700 text-lg font-bold hover:bg-gray-50 flex items-center justify-center"
          >
            −
          </button>
          <span className="text-2xl font-bold text-gray-900 w-8 text-center">{data.units}</span>
          <button
            type="button"
            onClick={() => set("units", String(Math.min(20, Number(data.units) + 1)))}
            className="w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-700 text-lg font-bold hover:bg-gray-50 flex items-center justify-center"
          >
            +
          </button>
          <span className="text-sm text-gray-400 ml-1">unit{Number(data.units) > 1 ? "s" : ""} (450 ml each)</span>
        </div>
      </div>

      {/* Urgency */}
      <div>
        <FieldLabel>Urgency *</FieldLabel>
        <div className="space-y-2">
          {([
            {
              key: "urgent" as Urgency,
              icon: Zap,
              label: "Urgent",
              sub: "Needed within hours — notifies donors immediately",
              color: "text-red-600",
              activeBorder: "border-red-500 bg-red-50",
            },
            {
              key: "scheduled" as Urgency,
              icon: Calendar,
              label: "Scheduled",
              sub: "Surgery or transfusion planned on a specific date",
              color: "text-blue-600",
              activeBorder: "border-blue-500 bg-blue-50",
            },
            {
              key: "regular" as Urgency,
              icon: RefreshCw,
              label: "Regular / Recurring",
              sub: "Ongoing need for chronic conditions",
              color: "text-purple-600",
              activeBorder: "border-purple-500 bg-purple-50",
            },
          ]).map(({ key, icon: Icon, label, sub, color, activeBorder }) => (
            <button
              key={key}
              type="button"
              onClick={() => set("urgency", key)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-colors
                ${data.urgency === key ? activeBorder : "border-gray-200 bg-white hover:bg-gray-50"}`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${data.urgency === key ? color : "text-gray-400"}`} />
              <div>
                <p className={`text-sm font-semibold ${data.urgency === key ? color : "text-gray-700"}`}>{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            </button>
          ))}
        </div>

        {data.urgency === "scheduled" && (
          <div className="mt-3">
            <FieldLabel>Required by date *</FieldLabel>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={data.scheduledDate}
                onChange={e => set("scheduledDate", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Crossmatch */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={data.crossmatch}
          onChange={e => set("crossmatch", e.target.checked)}
          className="sr-only"
        />
        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors
          ${data.crossmatch ? "bg-green-700 border-green-700" : "bg-white border-gray-300"}`}>
          {data.crossmatch && (
            <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span className="text-sm text-gray-700">Crossmatch / compatibility testing required</span>
      </label>

      {/* Notes */}
      <div>
        <FieldLabel>Clinical notes <span className="font-normal text-gray-400">(optional)</span></FieldLabel>
        <textarea
          placeholder="Diagnosis, special requirements, transfusion history…"
          value={data.notes}
          onChange={e => set("notes", e.target.value)}
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
        />
      </div>
    </div>
  )
}

function ReviewScreen({ data, onSubmit, submitting }: { data: FormData; onSubmit: () => void; submitting: boolean }) {
  const urgencyLabel: Record<Urgency, string> = { urgent: "Urgent", scheduled: "Scheduled", regular: "Regular / Recurring" }
  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-3">
        <p className="text-xs font-bold text-green-800 uppercase tracking-wide">Request Summary</p>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Patient</p>
            <p className="font-semibold text-gray-900">{data.patientName}, {data.patientAge} yrs</p>
            {data.ward && <p className="text-xs text-gray-500">{data.ward}{data.bedNumber ? ` · Bed ${data.bedNumber}` : ""}</p>}
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Blood needed</p>
            <p className="font-bold text-2xl text-green-700">{data.bloodGroup}</p>
            <p className="text-xs text-gray-500">{data.units} unit{Number(data.units) > 1 ? "s" : ""}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Doctor</p>
            <p className="font-semibold text-gray-900">{data.doctorName || "—"}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Urgency</p>
            <p className="font-semibold text-gray-900">{urgencyLabel[data.urgency]}</p>
            {data.urgency === "scheduled" && data.scheduledDate && (
              <p className="text-xs text-gray-500">
                {new Date(data.scheduledDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            )}
          </div>
        </div>

        {(data.crossmatch || data.notes) && (
          <div className="border-t border-green-200 pt-3 space-y-1.5">
            {data.crossmatch && (
              <p className="text-xs text-gray-700 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                Crossmatch required
              </p>
            )}
            {data.notes && <p className="text-xs text-gray-600">{data.notes}</p>}
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <p className="text-xs text-amber-700">
          Compatible donors near your hospital will be notified. This request will also appear on your hospital dashboard.
        </p>
      </div>

      <button
        onClick={onSubmit}
        disabled={submitting}
        className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2"
      >
        {submitting ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Posting request…</>
        ) : (
          "Confirm & post request"
        )}
      </button>
    </div>
  )
}

function SuccessScreen({ data, onDone }: { data: FormData; onDone: () => void }) {
  return (
    <div className="flex flex-col items-center text-center gap-5 py-8">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900">Request posted!</h2>
        <p className="text-sm text-gray-500 mt-1.5 max-w-xs">
          Notifying compatible <strong>{data.bloodGroup}</strong> donors near your hospital. Donor responses will appear on your dashboard.
        </p>
      </div>
      <div className="w-full bg-green-50 border border-green-200 rounded-2xl p-4 text-left space-y-1.5">
        <p className="text-xs font-bold text-green-800">What happens next?</p>
        <p className="text-xs text-gray-600">1. Compatible donors in the area are notified instantly.</p>
        <p className="text-xs text-gray-600">2. Responding donors appear on your active request page.</p>
        <p className="text-xs text-gray-600">3. Confirm the donor and coordinate at the blood bank.</p>
        <p className="text-xs text-gray-600">4. Mark fulfilled and update inventory accordingly.</p>
      </div>
      <button
        onClick={onDone}
        className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-2xl text-sm transition-colors"
      >
        Back to dashboard
      </button>
    </div>
  )
}

// ── Validation ────────────────────────────────────────────────────────────────

function validate(step: number, data: FormData): string | null {
  if (step === 0) {
    if (!data.patientName.trim()) return "Enter the patient's name."
    if (!data.patientAge.trim() || Number(data.patientAge) < 1) return "Enter a valid patient age."
    if (!data.doctorName.trim()) return "Enter the doctor's name."
  }
  if (step === 1) {
    if (!data.bloodGroup) return "Select the required blood group."
    if (!data.units || Number(data.units) < 1) return "Enter the number of units needed."
    if (data.urgency === "scheduled" && !data.scheduledDate) return "Pick a required-by date for scheduled requests."
  }
  return null
}

const STEPS = ["Patient info", "Blood need", "Review"]

// ── Main ──────────────────────────────────────────────────────────────────────

export default function NewHospitalRequest() {
  const router = useRouter()
  const [step, setStep]             = useState(0)
  const [data, setData]             = useState<FormData>(INITIAL)
  const [error, setError]           = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]             = useState(false)

  function set(k: keyof FormData, v: string | boolean) {
    setData(d => ({ ...d, [k]: v }))
    setError(null)
  }

  function next() {
    const err = validate(step, data)
    if (err) { setError(err); return }
    setError(null)
    setStep(s => s + 1)
  }

  function back() {
    setError(null)
    if (step === 0) { router.back(); return }
    setStep(s => s - 1)
  }

  function submit() {
    setSubmitting(true)
    // TODO: real API call
    setTimeout(() => {
      setSubmitting(false)
      setDone(true)
    }, 1200)
  }

  const isReview = step === STEPS.length - 1

  return (
    <div className="max-w-lg mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={back}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">New Donor Request</h1>
          {!done && (
            <p className="text-xs text-gray-400">
              Step {step + 1} of {STEPS.length} — {STEPS[step]}
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {!done && (
        <div className="flex gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-green-700" : "bg-gray-200"}`}
            />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 mb-4">
          <Zap className="h-4 w-4 text-red-500 shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Content */}
      {done ? (
        <SuccessScreen data={data} onDone={() => router.push("/dashboard/hospital")} />
      ) : isReview ? (
        <ReviewScreen data={data} onSubmit={submit} submitting={submitting} />
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              {step === 0 && <User className="h-5 w-5 text-green-700" />}
              {step === 1 && <Droplets className="h-5 w-5 text-green-700" />}
              <h2 className="text-sm font-bold text-gray-900">{STEPS[step]}</h2>
            </div>
            {step === 0 && <Step1 data={data} set={set} />}
            {step === 1 && <Step2 data={data} set={set} />}
          </div>

          <button
            onClick={next}
            className="mt-4 w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            Continue
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

    </div>
  )
}
