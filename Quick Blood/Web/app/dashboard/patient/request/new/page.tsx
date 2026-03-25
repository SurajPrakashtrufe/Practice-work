"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft, ChevronRight, Droplets, MapPin, Zap, Calendar, RefreshCw,
  User, Phone, CheckCircle2, Loader2,
} from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

type Urgency = "urgent" | "scheduled" | "regular"

interface FormData {
  // Step 1 — Patient details
  patientName: string
  patientAge: string
  relationship: string
  altContact: string
  // Step 2 — Hospital details
  hospitalName: string
  area: string
  city: string
  doctorName: string
  // Step 3 — Blood requirement
  bloodGroup: string
  units: string
  urgency: Urgency
  scheduledDate: string
  notes: string
}

const INITIAL: FormData = {
  patientName: "", patientAge: "", relationship: "", altContact: "",
  hospitalName: "", area: "", city: "", doctorName: "",
  bloodGroup: "", units: "1", urgency: "urgent", scheduledDate: "", notes: "",
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const RELATIONSHIPS = ["Self", "Parent", "Spouse", "Child", "Sibling", "Relative", "Friend", "Other"]

// ── Sub-components ────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-gray-700 mb-1.5">{children}</p>
}

function TextInput({
  placeholder, value, onChange, type = "text", disabled,
}: {
  placeholder: string; value: string; onChange: (v: string) => void
  type?: string; disabled?: boolean
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
    />
  )
}

function NativeSelect({
  value, onChange, children, disabled,
}: {
  value: string; onChange: (v: string) => void
  children: React.ReactNode; disabled?: boolean
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 appearance-none"
    >
      {children}
    </select>
  )
}

// ── Steps ─────────────────────────────────────────────────────────────────────

function Step1({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Patient full name *</FieldLabel>
        <TextInput placeholder="e.g. Rahul Mehta" value={data.patientName} onChange={v => set("patientName", v)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Age *</FieldLabel>
          <TextInput placeholder="e.g. 42" type="number" value={data.patientAge} onChange={v => set("patientAge", v)} />
        </div>
        <div>
          <FieldLabel>Your relationship *</FieldLabel>
          <NativeSelect value={data.relationship} onChange={v => set("relationship", v)}>
            <option value="">Select</option>
            {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
          </NativeSelect>
        </div>
      </div>
      <div>
        <FieldLabel>Alternate contact number</FieldLabel>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="tel"
            placeholder="+91 98765 43210"
            value={data.altContact}
            onChange={e => set("altContact", e.target.value)}
            className="w-full border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}

function Step2({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Hospital name *</FieldLabel>
        <TextInput placeholder="e.g. Apollo Hospital" value={data.hospitalName} onChange={v => set("hospitalName", v)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Area / locality *</FieldLabel>
          <TextInput placeholder="e.g. Andheri" value={data.area} onChange={v => set("area", v)} />
        </div>
        <div>
          <FieldLabel>City *</FieldLabel>
          <TextInput placeholder="e.g. Mumbai" value={data.city} onChange={v => set("city", v)} />
        </div>
      </div>
      <div>
        <FieldLabel>Doctor / in-charge name</FieldLabel>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Dr. Sharma"
            value={data.doctorName}
            onChange={e => set("doctorName", e.target.value)}
            className="w-full border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
}

function Step3({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-5">
      {/* Blood group */}
      <div>
        <FieldLabel>Blood group needed *</FieldLabel>
        <div className="grid grid-cols-4 gap-2">
          {BLOOD_GROUPS.map(g => (
            <button
              key={g}
              type="button"
              onClick={() => set("bloodGroup", g)}
              className={`py-3 rounded-xl text-sm font-bold border-2 transition-colors
                ${data.bloodGroup === g
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"}`}
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
            onClick={() => set("units", String(Math.min(10, Number(data.units) + 1)))}
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
              sub: "Planned surgery or transfusion on a specific date",
              color: "text-blue-600",
              activeBorder: "border-blue-500 bg-blue-50",
            },
            {
              key: "regular" as Urgency,
              icon: RefreshCw,
              label: "Regular / Recurring",
              sub: "Ongoing need (e.g. thalassemia, dialysis)",
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
                className="w-full border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <FieldLabel>Additional notes <span className="font-normal text-gray-400">(optional)</span></FieldLabel>
        <textarea
          placeholder="Any special requirements, diagnosis, or instructions for the donor…"
          value={data.notes}
          onChange={e => set("notes", e.target.value)}
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
    </div>
  )
}

function ReviewScreen({ data, onSubmit, submitting }: { data: FormData; onSubmit: () => void; submitting: boolean }) {
  const urgencyLabel: Record<Urgency, string> = { urgent: "Urgent", scheduled: "Scheduled", regular: "Regular / Recurring" }
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
        <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Request Summary</p>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Patient</p>
            <p className="font-semibold text-gray-900">{data.patientName}, {data.patientAge} yrs</p>
            <p className="text-xs text-gray-500">{data.relationship}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Blood needed</p>
            <p className="font-bold text-2xl text-blue-600">{data.bloodGroup}</p>
            <p className="text-xs text-gray-500">{data.units} unit{Number(data.units) > 1 ? "s" : ""}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Hospital</p>
            <p className="font-semibold text-gray-900">{data.hospitalName}</p>
            <p className="text-xs text-gray-500 flex items-center gap-0.5">
              <MapPin className="h-3 w-3" />{data.area}, {data.city}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Urgency</p>
            <p className="font-semibold text-gray-900">{urgencyLabel[data.urgency]}</p>
            {data.urgency === "scheduled" && data.scheduledDate && (
              <p className="text-xs text-gray-500">{new Date(data.scheduledDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
            )}
          </div>
        </div>

        {data.notes && (
          <div className="border-t border-blue-200 pt-3">
            <p className="text-[10px] text-gray-400 uppercase mb-1">Notes</p>
            <p className="text-xs text-gray-700">{data.notes}</p>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <p className="text-xs text-amber-700">
          By submitting, compatible donors near <strong>{data.city}</strong> will be notified. You can cancel or update the request anytime.
        </p>
      </div>

      <button
        onClick={onSubmit}
        disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2"
      >
        {submitting ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Posting request…</>
        ) : (
          <>Confirm &amp; post request</>
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
          We're notifying compatible <strong>{data.bloodGroup}</strong> donors near <strong>{data.city}</strong>. You'll be alerted as soon as someone responds.
        </p>
      </div>
      <div className="w-full bg-blue-50 border border-blue-200 rounded-2xl p-4 text-left space-y-1.5">
        <p className="text-xs font-bold text-blue-700">What happens next?</p>
        <p className="text-xs text-gray-600">1. Nearby donors receive an instant notification.</p>
        <p className="text-xs text-gray-600">2. Donors who accept appear in your request details.</p>
        <p className="text-xs text-gray-600">3. You contact the donor and coordinate at the hospital.</p>
        <p className="text-xs text-gray-600">4. Mark the request fulfilled once done.</p>
      </div>
      <button
        onClick={onDone}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl text-sm transition-colors"
      >
        Go to my requests
      </button>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

const STEPS = ["Patient", "Hospital", "Blood need", "Review"]

function validate(step: number, data: FormData): string | null {
  if (step === 0) {
    if (!data.patientName.trim()) return "Enter the patient's name."
    if (!data.patientAge.trim() || Number(data.patientAge) < 1) return "Enter a valid age."
    if (!data.relationship) return "Select your relationship to the patient."
  }
  if (step === 1) {
    if (!data.hospitalName.trim()) return "Enter the hospital name."
    if (!data.area.trim()) return "Enter the area / locality."
    if (!data.city.trim()) return "Enter the city."
  }
  if (step === 2) {
    if (!data.bloodGroup) return "Select the required blood group."
    if (!data.units || Number(data.units) < 1) return "Enter the number of units needed."
    if (data.urgency === "scheduled" && !data.scheduledDate) return "Pick a required-by date for scheduled requests."
  }
  return null
}

export default function NewPatientRequest() {
  const router   = useRouter()
  const [step, setStep]       = useState(0)
  const [data, setData]       = useState<FormData>(INITIAL)
  const [error, setError]     = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]       = useState(false)

  function set(k: keyof FormData, v: string) {
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
          <h1 className="text-lg font-bold text-gray-900">New Blood Request</h1>
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
              className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-blue-600" : "bg-gray-200"}`}
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

      {/* Step content */}
      {done ? (
        <SuccessScreen data={data} onDone={() => router.push("/dashboard/patient/requests")} />
      ) : isReview ? (
        <ReviewScreen data={data} onSubmit={submit} submitting={submitting} />
      ) : (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              {step === 0 && <User className="h-5 w-5 text-blue-600" />}
              {step === 1 && <MapPin className="h-5 w-5 text-blue-600" />}
              {step === 2 && <Droplets className="h-5 w-5 text-blue-600" />}
              <h2 className="text-sm font-bold text-gray-900">{STEPS[step]}</h2>
            </div>
            {step === 0 && <Step1 data={data} set={set} />}
            {step === 1 && <Step2 data={data} set={set} />}
            {step === 2 && <Step3 data={data} set={set} />}
          </div>

          <button
            onClick={next}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            {isReview ? "Review" : "Continue"}
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

    </div>
  )
}
