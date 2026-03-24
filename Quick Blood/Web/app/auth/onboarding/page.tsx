"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  MapPin, Droplets, Activity, Syringe, User2, ChevronRight, ChevronLeft,
  Loader2, CheckCircle2, AlertCircle, Scale, Calendar, Pill, Phone,
  Locate, Heart, Hospital, Stethoscope, Clock, CalendarRange, RefreshCw,
  ShieldCheck, BadgeCheck, BadgeX,
  Building, FileText, Globe, CreditCard, Upload, Link, Users, Hash, Bed, Award,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// ─── Constants ────────────────────────────────────────────────────────────────

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 30 }, (_, i) => String(CURRENT_YEAR - i))

// ─── Shared helpers ───────────────────────────────────────────────────────────

function YesNo({
  value, onChange, disabled,
}: { value: boolean | null; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className="flex gap-3">
      {([true, false] as const).map((opt) => (
        <button key={String(opt)} type="button" disabled={disabled} onClick={() => onChange(opt)}
          className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all
            ${value === opt
              ? opt ? "border-red-500 bg-red-50 text-red-700" : "border-green-500 bg-green-50 text-green-700"
              : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
          {opt ? "Yes" : "No"}
        </button>
      ))}
    </div>
  )
}

function NativeSelect({ id, value, onChange, children, className = "" }: {
  id?: string; value: string; onChange: (v: string) => void; children: React.ReactNode; className?: string
}) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)}
      className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 ${className}`}>
      {children}
    </select>
  )
}

function SectionLabel({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-red-500" />
      <span className="text-sm font-semibold text-gray-700">{label}</span>
    </div>
  )
}

// ─── Done screen ──────────────────────────────────────────────────────────────

function DoneScreen() {
  return (
    <Card className="shadow-lg border-0">
      <CardContent className="flex flex-col items-center gap-4 py-12">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-gray-900">Profile Complete!</h2>
          <p className="text-sm text-gray-500">Your profile has been saved. Redirecting to login…</p>
        </div>
        <div className="flex gap-1">
          {[0,1,2].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-red-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// DONOR FLOW
// ══════════════════════════════════════════════════════════════════════════════

interface DonorData {
  // Step 1 – Availability
  isAvailable: boolean | null
  // Step 2 – Location
  city: string; district: string; state: string; country: string
  latitude: string; longitude: string
  // Step 3 – Blood health
  hasBloodCondition: boolean | null; bloodConditionDetails: string
  // Step 4 – Diabetes
  hasDiabetes: boolean | null; diabetesType: "diabetic" | "prediabetic" | ""
  fastingSugar: string; postMealSugar: string
  // Step 5 – Donation history
  hasDonatedBefore: boolean | null; lastDonationMonth: string; lastDonationYear: string
  // Step 6 – Additional
  weightKg: string; lastCheckupYear: string; currentMedications: string
  knownAllergies: string; emergencyContactName: string; emergencyContactPhone: string
}

const DONOR_INITIAL: DonorData = {
  isAvailable: null,
  city: "", district: "", state: "", country: "India", latitude: "", longitude: "",
  hasBloodCondition: null, bloodConditionDetails: "",
  hasDiabetes: null, diabetesType: "", fastingSugar: "", postMealSugar: "",
  hasDonatedBefore: null, lastDonationMonth: "", lastDonationYear: "",
  weightKg: "", lastCheckupYear: "", currentMedications: "", knownAllergies: "",
  emergencyContactName: "", emergencyContactPhone: "",
}

const DONOR_STEPS = [
  { label: "Availability", icon: Heart },
  { label: "Location", icon: MapPin },
  { label: "Blood Health", icon: Droplets },
  { label: "Diabetes", icon: Activity },
  { label: "Donations", icon: Syringe },
  { label: "More", icon: User2 },
]

function DonorStepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0.5 mb-1 flex-wrap">
      {DONOR_STEPS.map((s, i) => {
        const Icon = s.icon
        const done = i + 1 < current
        const active = i + 1 === current
        return (
          <div key={s.label} className="flex items-center gap-0.5">
            <div className="flex flex-col items-center gap-0.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors
                ${active ? "bg-red-600 text-white" : done ? "bg-red-200 text-red-700" : "bg-gray-100 text-gray-400"}`}>
                {done ? <span className="text-[10px] font-bold">✓</span> : <Icon className="h-3 w-3" />}
              </div>
              <span className={`text-[9px] font-medium ${active ? "text-red-600" : "text-gray-400"}`}>
                {s.label}
              </span>
            </div>
            {i < DONOR_STEPS.length - 1 && (
              <div className={`w-4 h-0.5 mb-3 ${done ? "bg-red-300" : "bg-gray-200"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function DonorOnboarding({ locationAllowed, onDone }: { locationAllowed: boolean; onDone: () => void }) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<DonorData>(DONOR_INITIAL)
  const [error, setError] = useState<string | null>(null)
  const [locating, setLocating] = useState(false)

  function set<K extends keyof DonorData>(field: K, value: DonorData[K]) {
    setData((d) => ({ ...d, [field]: value }))
  }

  useEffect(() => {
    if (locationAllowed && navigator.geolocation) {
      setLocating(true)
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          set("latitude", String(pos.coords.latitude.toFixed(5)))
          set("longitude", String(pos.coords.longitude.toFixed(5)))
          setLocating(false)
        },
        () => setLocating(false),
        { timeout: 8000 }
      )
    }
  }, [locationAllowed])

  function validate(): string | null {
    if (step === 1 && data.isAvailable === null) return "Please select your availability."
    if (step === 2) {
      if (!data.city.trim()) return "Please enter your city."
      if (!data.state.trim()) return "Please enter your state."
    }
    if (step === 3) {
      if (data.hasBloodCondition === null) return "Please answer the question."
      if (data.hasBloodCondition && !data.bloodConditionDetails.trim()) return "Please describe the condition."
    }
    if (step === 4) {
      if (data.hasDiabetes === null) return "Please answer the question."
      if (data.hasDiabetes) {
        if (!data.diabetesType) return "Please select diabetic or pre-diabetic."
        if (!data.fastingSugar.trim()) return "Please enter your fasting sugar level."
        if (!data.postMealSugar.trim()) return "Please enter your post-meal sugar level."
      }
    }
    if (step === 5) {
      if (data.hasDonatedBefore === null) return "Please answer the question."
      if (data.hasDonatedBefore && (!data.lastDonationMonth || !data.lastDonationYear))
        return "Please select the donation month and year."
    }
    if (step === 6) {
      if (!data.weightKg.trim()) return "Please enter your weight."
      if (!data.emergencyContactName.trim()) return "Emergency contact name is required."
      const phone = data.emergencyContactPhone.replace(/\s|-/g, "")
      if (!phone || !/^\+?[0-9]{10,13}$/.test(phone)) return "Enter a valid emergency contact number."
    }
    return null
  }

  function next() {
    const err = validate()
    if (err) { setError(err); return }
    setError(null)
    if (step < DONOR_STEPS.length) setStep((s) => s + 1)
    else onDone()
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-3">
        <DonorStepIndicator current={step} />
        <CardTitle className="text-lg">{DONOR_STEPS[step - 1].label}</CardTitle>
        <CardDescription className="text-xs">
          Step {step} of {DONOR_STEPS.length} — Donor profile setup
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* ── Step 1: Availability ── */}
        {step === 1 && (
          <div className="space-y-4">
            <SectionLabel icon={Heart} label="Blood Donation Availability" />
            <p className="text-sm text-gray-600">
              Are you currently available to donate blood if someone needs it?
            </p>
            <p className="text-xs text-gray-400">
              Your availability badge will be shown publicly on your profile so patients can find eligible donors quickly.
            </p>

            <div className="flex gap-3">
              {([true, false] as const).map((opt) => (
                <button key={String(opt)} type="button" onClick={() => set("isAvailable", opt)}
                  className={`flex-1 py-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all
                    ${data.isAvailable === opt
                      ? opt ? "border-green-500 bg-green-50" : "border-gray-400 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"}`}>
                  {opt ? (
                    <>
                      <BadgeCheck className={`h-7 w-7 ${data.isAvailable === true ? "text-green-600" : "text-gray-300"}`} />
                      <span className={`text-sm font-bold ${data.isAvailable === true ? "text-green-700" : "text-gray-400"}`}>
                        Available
                      </span>
                      <span className="text-[10px] text-gray-400 text-center px-1">
                        Ready to donate when someone needs me
                      </span>
                    </>
                  ) : (
                    <>
                      <BadgeX className={`h-7 w-7 ${data.isAvailable === false ? "text-gray-500" : "text-gray-300"}`} />
                      <span className={`text-sm font-bold ${data.isAvailable === false ? "text-gray-700" : "text-gray-400"}`}>
                        Unavailable
                      </span>
                      <span className="text-[10px] text-gray-400 text-center px-1">
                        Not ready to donate right now
                      </span>
                    </>
                  )}
                </button>
              ))}
            </div>

            {data.isAvailable !== null && (
              <div className={`rounded-xl p-3 flex items-center gap-2 text-xs font-medium
                ${data.isAvailable ? "bg-green-50 border border-green-200 text-green-700" : "bg-gray-50 border border-gray-200 text-gray-600"}`}>
                <ShieldCheck className="h-4 w-4 shrink-0" />
                {data.isAvailable
                  ? "Your profile will show a green Available badge. You can change this anytime."
                  : "Your profile will show an Unavailable badge. You can switch to available anytime from settings."}
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Location ── */}
        {step === 2 && (
          <div className="space-y-4">
            <SectionLabel icon={MapPin} label="Your Current Location" />

            {locationAllowed ? (
              <div className="rounded-xl bg-green-50 border border-green-200 p-3 flex items-start gap-2 text-xs text-green-700">
                <Locate className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                {locating ? (
                  <span className="flex items-center gap-1.5"><Loader2 className="h-3 w-3 animate-spin" /> Detecting your location…</span>
                ) : data.latitude ? (
                  <span>GPS: <strong>{data.latitude}, {data.longitude}</strong>. Confirm your address below.</span>
                ) : (
                  <span>GPS detection failed. Please enter your address manually.</span>
                )}
              </div>
            ) : (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2 text-xs text-amber-700">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                Location access was denied. Please enter your address so we can match you with nearby patients.
              </div>
            )}

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="city">City / Town <span className="text-red-500">*</span></Label>
                <Input id="city" placeholder="e.g. Mumbai" value={data.city} onChange={(e) => set("city", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="district">District / Area</Label>
                <Input id="district" placeholder="e.g. Andheri" value={data.district} onChange={(e) => set("district", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                  <Input id="state" placeholder="e.g. Maharashtra" value={data.state} onChange={(e) => set("state", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={data.country} onChange={(e) => set("country", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Blood Health ── */}
        {step === 3 && (
          <div className="space-y-4">
            <SectionLabel icon={Droplets} label="Blood Health History" />
            <p className="text-sm text-gray-600">
              Do you have any blood disease, infection, or blood-related problem (past or present)?
            </p>
            <p className="text-xs text-gray-400">e.g. thalassemia, sickle cell, hepatitis B/C, HIV, malaria, dengue, etc.</p>
            <YesNo value={data.hasBloodCondition} onChange={(v) => set("hasBloodCondition", v)} />
            {data.hasBloodCondition === true && (
              <div className="space-y-1.5">
                <Label htmlFor="bloodDetails">Describe the condition <span className="text-red-500">*</span></Label>
                <textarea id="bloodDetails" rows={3}
                  placeholder="Describe the disease, infection, or issue and whether it is past or ongoing…"
                  value={data.bloodConditionDetails}
                  onChange={(e) => set("bloodConditionDetails", e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 resize-none" />
              </div>
            )}
            {data.hasBloodCondition === false && (
              <div className="rounded-xl bg-green-50 border border-green-100 p-3 text-xs text-green-700 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" /> No blood-related conditions reported.
              </div>
            )}
          </div>
        )}

        {/* ── Step 4: Diabetes ── */}
        {step === 4 && (
          <div className="space-y-4">
            <SectionLabel icon={Activity} label="Diabetes & Sugar Levels" />
            <p className="text-sm text-gray-600">Do you have diabetes or are you pre-diabetic?</p>
            <YesNo value={data.hasDiabetes} onChange={(v) => {
              set("hasDiabetes", v)
              if (!v) { set("diabetesType", ""); set("fastingSugar", ""); set("postMealSugar", "") }
            }} />
            {data.hasDiabetes === true && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Type <span className="text-red-500">*</span></Label>
                  <div className="flex gap-3">
                    {(["diabetic", "prediabetic"] as const).map((t) => (
                      <button key={t} type="button" onClick={() => set("diabetesType", t)}
                        className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all
                          ${data.diabetesType === t ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                        {t === "prediabetic" ? "Pre-diabetic" : "Diabetic"}
                      </button>
                    ))}
                  </div>
                </div>
                <Separator />
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Blood Sugar Levels (mg/dL)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="fasting">Fasting <span className="text-red-500">*</span> <span className="text-gray-400 font-normal text-[10px]">(before eating)</span></Label>
                    <Input id="fasting" type="number" placeholder="e.g. 110" value={data.fastingSugar} onChange={(e) => set("fastingSugar", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="postmeal">Post-meal <span className="text-red-500">*</span> <span className="text-gray-400 font-normal text-[10px]">(2 hrs after)</span></Label>
                    <Input id="postmeal" type="number" placeholder="e.g. 145" value={data.postMealSugar} onChange={(e) => set("postMealSugar", e.target.value)} />
                  </div>
                </div>
                <p className="text-xs text-gray-400">Normal fasting: &lt;100 · Pre-diabetic: 100–125 · Diabetic: ≥126 mg/dL</p>
              </div>
            )}
            {data.hasDiabetes === false && (
              <div className="rounded-xl bg-green-50 border border-green-100 p-3 text-xs text-green-700 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" /> No diabetes reported.
              </div>
            )}
          </div>
        )}

        {/* ── Step 5: Donation History ── */}
        {step === 5 && (
          <div className="space-y-4">
            <SectionLabel icon={Syringe} label="Blood Donation History" />
            <p className="text-sm text-gray-600">Have you ever donated blood before?</p>
            <YesNo value={data.hasDonatedBefore} onChange={(v) => {
              set("hasDonatedBefore", v)
              if (!v) { set("lastDonationMonth", ""); set("lastDonationYear", "") }
            }} />
            {data.hasDonatedBefore === true && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">When was your last donation?</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Month <span className="text-red-500">*</span></Label>
                    <NativeSelect value={data.lastDonationMonth} onChange={(v) => set("lastDonationMonth", v)}>
                      <option value="">Month</option>
                      {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </NativeSelect>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Year <span className="text-red-500">*</span></Label>
                    <NativeSelect value={data.lastDonationYear} onChange={(v) => set("lastDonationYear", v)}>
                      <option value="">Year</option>
                      {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                    </NativeSelect>
                  </div>
                </div>
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                  Donors must wait at least <strong>3 months</strong> between whole blood donations.
                </p>
              </div>
            )}
            {data.hasDonatedBefore === false && (
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-xs text-blue-700 flex items-center gap-2">
                <Heart className="h-4 w-4 shrink-0" /> First-time donor! Thank you for joining Quick Blood.
              </div>
            )}
          </div>
        )}

        {/* ── Step 6: Additional Details ── */}
        {step === 6 && (
          <div className="space-y-4">
            <SectionLabel icon={User2} label="Additional Health Details" />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="weight"><Scale className="h-3 w-3 inline mr-1" />Weight (kg) <span className="text-red-500">*</span></Label>
                <Input id="weight" type="number" placeholder="e.g. 65" value={data.weightKg} onChange={(e) => set("weightKg", e.target.value)} />
                <p className="text-[10px] text-gray-400">Min. 50 kg to donate</p>
              </div>
              <div className="space-y-1.5">
                <Label><Calendar className="h-3 w-3 inline mr-1" />Last Checkup Year</Label>
                <NativeSelect value={data.lastCheckupYear} onChange={(v) => set("lastCheckupYear", v)}>
                  <option value="">Not sure</option>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </NativeSelect>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label><Pill className="h-3 w-3 inline mr-1" />Current Medications</Label>
              <Input placeholder="e.g. Metformin, Aspirin — or 'None'" value={data.currentMedications} onChange={(e) => set("currentMedications", e.target.value)} />
              <p className="text-[10px] text-gray-400">Some medications affect donation eligibility.</p>
            </div>
            <div className="space-y-1.5">
              <Label><AlertCircle className="h-3 w-3 inline mr-1" />Known Allergies</Label>
              <Input placeholder="e.g. Penicillin, latex — or 'None'" value={data.knownAllergies} onChange={(e) => set("knownAllergies", e.target.value)} />
            </div>
            <Separator />
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
              <Phone className="h-3 w-3" /> Emergency Contact
            </p>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Contact Name <span className="text-red-500">*</span></Label>
                <Input placeholder="Full name" value={data.emergencyContactName} onChange={(e) => set("emergencyContactName", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Contact Phone <span className="text-red-500">*</span></Label>
                <Input type="tel" placeholder="+91 98765 43210" value={data.emergencyContactPhone} onChange={(e) => set("emergencyContactPhone", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-1">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={() => { setError(null); setStep((s) => s - 1) }} className="flex-1">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          )}
          <Button type="button" onClick={next} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
            {step === DONOR_STEPS.length
              ? <><CheckCircle2 className="h-4 w-4 mr-2" /> Complete Profile</>
              : <>Next <ChevronRight className="h-4 w-4 ml-1" /></>}
          </Button>
        </div>
        <p className="text-center text-xs text-gray-400">You can update these details anytime from your profile settings.</p>
      </CardContent>
    </Card>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// PATIENT FLOW
// ══════════════════════════════════════════════════════════════════════════════

type UrgencyType = "urgent" | "scheduled" | "regular" | ""

interface PatientData {
  // Step 1 – Patient Details
  userName: string        // auto-filled, read-only
  patientName: string
  patientAge: string
  relationship: string
  alternateContact: string
  // Step 2 – Hospital Details
  hospitalName: string
  hospitalArea: string
  hospitalCity: string
  hospitalDistrict: string
  hospitalState: string
  doctorName: string
  // Step 3 – Blood Requirement
  bloodGroupNeeded: string
  unitsNeeded: string
  urgencyType: UrgencyType
  scheduledFromDate: string
  scheduledToDate: string
  regularUnits: string
  regularPeriod: string
}

const PATIENT_INITIAL: PatientData = {
  userName: "",
  patientName: "", patientAge: "", relationship: "self", alternateContact: "",
  hospitalName: "", hospitalArea: "", hospitalCity: "", hospitalDistrict: "", hospitalState: "", doctorName: "",
  bloodGroupNeeded: "", unitsNeeded: "",
  urgencyType: "", scheduledFromDate: "", scheduledToDate: "", regularUnits: "", regularPeriod: "weekly",
}

const PATIENT_STEPS = [
  { label: "Patient", icon: User2 },
  { label: "Hospital", icon: Hospital },
  { label: "Blood Req.", icon: Droplets },
]

const RELATIONSHIPS = ["self", "spouse", "parent", "child", "sibling", "relative", "friend", "other"]

function PatientStepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-1">
      {PATIENT_STEPS.map((s, i) => {
        const Icon = s.icon
        const done = i + 1 < current
        const active = i + 1 === current
        return (
          <div key={s.label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-0.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors
                ${active ? "bg-red-600 text-white" : done ? "bg-red-200 text-red-700" : "bg-gray-100 text-gray-400"}`}>
                {done ? <span className="text-xs font-bold">✓</span> : <Icon className="h-3.5 w-3.5" />}
              </div>
              <span className={`text-[9px] font-medium ${active ? "text-red-600" : "text-gray-400"}`}>{s.label}</span>
            </div>
            {i < PATIENT_STEPS.length - 1 && (
              <div className={`w-8 h-0.5 mb-3 ${done ? "bg-red-300" : "bg-gray-200"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function PatientOnboarding({ userName, onDone }: { userName: string; onDone: () => void }) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<PatientData>({ ...PATIENT_INITIAL, userName, patientName: userName })
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof PatientData>(field: K, value: PatientData[K]) {
    setData((d) => ({ ...d, [field]: value }))
  }

  function validate(): string | null {
    if (step === 1) {
      if (!data.patientName.trim()) return "Patient name is required."
      const age = parseInt(data.patientAge)
      if (!data.patientAge || isNaN(age) || age < 1 || age > 120) return "Please enter a valid patient age."
      if (!data.relationship) return "Please select your relationship to the patient."
      if (data.alternateContact) {
        const ph = data.alternateContact.replace(/\s|-/g, "")
        if (!/^\+?[0-9]{10,13}$/.test(ph)) return "Enter a valid alternate contact number."
      }
    }
    if (step === 2) {
      if (!data.hospitalName.trim()) return "Hospital name is required."
      if (!data.hospitalCity.trim()) return "Hospital city is required."
      if (!data.hospitalDistrict.trim()) return "Hospital district is required."
      if (!data.hospitalState.trim()) return "Hospital state is required."
      if (!data.doctorName.trim()) return "Doctor / operating surgeon name is required."
    }
    if (step === 3) {
      if (!data.bloodGroupNeeded) return "Please select the required blood group."
      const units = parseInt(data.unitsNeeded)
      if (!data.unitsNeeded || isNaN(units) || units < 1) return "Please enter the number of units needed."
      if (!data.urgencyType) return "Please select urgency type."
      if (data.urgencyType === "scheduled") {
        if (!data.scheduledFromDate) return "Please enter the start date."
        if (!data.scheduledToDate) return "Please enter the end date."
      }
      if (data.urgencyType === "regular") {
        const ru = parseInt(data.regularUnits)
        if (!data.regularUnits || isNaN(ru) || ru < 1) return "Please enter the number of units per period."
      }
    }
    return null
  }

  function next() {
    const err = validate()
    if (err) { setError(err); return }
    setError(null)
    if (step < PATIENT_STEPS.length) setStep((s) => s + 1)
    else onDone()
  }

  const urgencyOptions: { key: UrgencyType; icon: React.ElementType; label: string; desc: string; color: string }[] = [
    { key: "urgent", icon: Clock, label: "Urgent", desc: "Need blood ASAP (within 24–48 hrs)", color: "border-red-500 bg-red-50 text-red-700" },
    { key: "scheduled", icon: CalendarRange, label: "Scheduled", desc: "Planned surgery / procedure on specific dates", color: "border-orange-400 bg-orange-50 text-orange-700" },
    { key: "regular", icon: RefreshCw, label: "Regular", desc: "Recurring need (e.g. thalassemia, dialysis)", color: "border-blue-500 bg-blue-50 text-blue-700" },
  ]

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-3">
        <PatientStepIndicator current={step} />
        <CardTitle className="text-lg">{PATIENT_STEPS[step - 1].label}</CardTitle>
        <CardDescription className="text-xs">
          Step {step} of {PATIENT_STEPS.length} — Blood request setup
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* ── Step 1: Patient Details ── */}
        {step === 1 && (
          <div className="space-y-4">
            <SectionLabel icon={User2} label="Patient Details" />

            {/* Requester name – read only */}
            <div className="space-y-1.5">
              <Label>Your Name <Badge variant="secondary" className="ml-1 text-[10px]">auto-filled</Badge></Label>
              <Input value={data.userName} disabled className="bg-gray-50 text-gray-500" />
            </div>

            <Separator />

            <div className="space-y-1.5">
              <Label>Patient Name <span className="text-red-500">*</span></Label>
              <Input placeholder="Full name of the patient"
                value={data.patientName} onChange={(e) => set("patientName", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Patient Age <span className="text-red-500">*</span></Label>
                <Input type="number" placeholder="e.g. 35" min={1} max={120}
                  value={data.patientAge} onChange={(e) => set("patientAge", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Your Relationship <span className="text-red-500">*</span></Label>
                <NativeSelect value={data.relationship} onChange={(v) => set("relationship", v)}>
                  {RELATIONSHIPS.map((r) => (
                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                  ))}
                </NativeSelect>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>
                Alternate Contact{" "}
                <span className="text-gray-400 font-normal text-xs">(optional)</span>
              </Label>
              <Input type="tel" placeholder="+91 98765 43210"
                value={data.alternateContact} onChange={(e) => set("alternateContact", e.target.value)} />
              <p className="text-[10px] text-gray-400">Additional number donors can reach you on.</p>
            </div>
          </div>
        )}

        {/* ── Step 2: Hospital Details ── */}
        {step === 2 && (
          <div className="space-y-4">
            <SectionLabel icon={Hospital} label="Hospital Details" />

            <div className="space-y-1.5">
              <Label>Hospital Name <span className="text-red-500">*</span></Label>
              <Input placeholder="e.g. Apollo Hospitals, Lilavati Hospital"
                value={data.hospitalName} onChange={(e) => set("hospitalName", e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label>Area / Street Address</Label>
              <Input placeholder="e.g. Bandra West, Near Carter Road"
                value={data.hospitalArea} onChange={(e) => set("hospitalArea", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>City <span className="text-red-500">*</span></Label>
                <Input placeholder="e.g. Mumbai"
                  value={data.hospitalCity} onChange={(e) => set("hospitalCity", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>District <span className="text-red-500">*</span></Label>
                <Input placeholder="e.g. Mumbai Suburban"
                  value={data.hospitalDistrict} onChange={(e) => set("hospitalDistrict", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>State <span className="text-red-500">*</span></Label>
                <Input placeholder="e.g. Maharashtra"
                  value={data.hospitalState} onChange={(e) => set("hospitalState", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Country</Label>
                <Input value="India" disabled className="bg-gray-50 text-gray-500" />
              </div>
            </div>

            <Separator />

            <SectionLabel icon={Stethoscope} label="Doctor / Surgeon" />
            <div className="space-y-1.5">
              <Label>Doctor / Operating Surgeon Name <span className="text-red-500">*</span></Label>
              <Input placeholder="e.g. Dr. Rajesh Kumar"
                value={data.doctorName} onChange={(e) => set("doctorName", e.target.value)} />
            </div>
          </div>
        )}

        {/* ── Step 3: Blood Requirement ── */}
        {step === 3 && (
          <div className="space-y-5">
            <SectionLabel icon={Droplets} label="Blood Requirement" />

            {/* Blood Group */}
            <div className="space-y-2">
              <Label>Blood Group Needed <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUPS.map((bg) => (
                  <button key={bg} type="button" onClick={() => set("bloodGroupNeeded", bg)}
                    className={`py-2.5 rounded-xl border-2 text-sm font-bold transition-all
                      ${data.bloodGroupNeeded === bg
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-200 text-gray-600 hover:border-red-200"}`}>
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Units needed */}
            <div className="space-y-1.5">
              <Label>Units Needed <span className="text-red-500">*</span></Label>
              <div className="flex items-center gap-3">
                <Input type="number" min={1} max={20} placeholder="e.g. 2"
                  value={data.unitsNeeded} onChange={(e) => set("unitsNeeded", e.target.value)}
                  className="w-28" />
                <span className="text-sm text-gray-500">unit(s) · 1 unit ≈ 450 mL whole blood</span>
              </div>
            </div>

            <Separator />

            {/* Urgency type */}
            <div className="space-y-2">
              <Label>Urgency Type <span className="text-red-500">*</span></Label>
              <div className="space-y-2">
                {urgencyOptions.map((opt) => {
                  const Icon = opt.icon
                  return (
                    <button key={opt.key} type="button" onClick={() => set("urgencyType", opt.key)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all
                        ${data.urgencyType === opt.key ? opt.color + " border-2" : "border-gray-200 hover:border-gray-300"}`}>
                      <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${data.urgencyType === opt.key ? "" : "text-gray-400"}`} />
                      <div>
                        <p className="text-sm font-semibold">{opt.label}</p>
                        <p className={`text-xs ${data.urgencyType === opt.key ? "opacity-80" : "text-gray-400"}`}>{opt.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Scheduled date range */}
            {data.urgencyType === "scheduled" && (
              <div className="space-y-3 rounded-xl bg-orange-50 border border-orange-100 p-4">
                <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Schedule Window</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>From Date <span className="text-red-500">*</span></Label>
                    <Input type="date" value={data.scheduledFromDate}
                      onChange={(e) => set("scheduledFromDate", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>To Date <span className="text-red-500">*</span></Label>
                    <Input type="date" value={data.scheduledToDate}
                      onChange={(e) => set("scheduledToDate", e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* Regular basis */}
            {data.urgencyType === "regular" && (
              <div className="space-y-3 rounded-xl bg-blue-50 border border-blue-100 p-4">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Recurring Requirement</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Units per period <span className="text-red-500">*</span></Label>
                    <Input type="number" min={1} placeholder="e.g. 2"
                      value={data.regularUnits} onChange={(e) => set("regularUnits", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Period</Label>
                    <NativeSelect value={data.regularPeriod} onChange={(v) => set("regularPeriod", v)}>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </NativeSelect>
                  </div>
                </div>
                <p className="text-xs text-blue-600">
                  e.g. thalassemia patients typically need 2 units every 3–4 weeks.
                </p>
              </div>
            )}

            {data.urgencyType === "urgent" && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Your request will be marked <strong>URGENT</strong> and broadcasted to all nearby matching donors immediately.
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-1">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={() => { setError(null); setStep((s) => s - 1) }} className="flex-1">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          )}
          <Button type="button" onClick={next} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
            {step === PATIENT_STEPS.length
              ? <><CheckCircle2 className="h-4 w-4 mr-2" /> Submit Request</>
              : <>Next <ChevronRight className="h-4 w-4 ml-1" /></>}
          </Button>
        </div>
        <p className="text-center text-xs text-gray-400">You can edit your request details anytime from your profile.</p>
      </CardContent>
    </Card>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// HOSPITAL FLOW
// ══════════════════════════════════════════════════════════════════════════════

const HOSPITAL_TYPES = [
  { value: "government",   label: "Government" },
  { value: "private",      label: "Private" },
  { value: "blood_bank",   label: "Blood Bank" },
  { value: "ngo",          label: "NGO / Trust" },
  { value: "corporate",    label: "Corporate" },
  { value: "teaching",     label: "Teaching / Medical College" },
] as const

const HOSPITAL_STEPS = [
  { label: "Identity",  icon: ShieldCheck },
  { label: "Location",  icon: MapPin },
  { label: "Contact",   icon: Phone },
  { label: "Inventory", icon: Droplets },
  { label: "Admin",     icon: Users },
]

interface HospitalData {
  // Step 1 – Identity & Verification
  aadharNumber: string
  hospitalName: string
  hospitalType: string
  registrationNumber: string
  yearEstablished: string
  naabhAccredited: boolean | null
  // Step 2 – Address & Location
  fullAddress: string
  area: string
  city: string
  district: string
  state: string
  pinCode: string
  googleMapLink: string
  latitude: string
  longitude: string
  // Step 3 – Contact Details
  primaryContact: string
  emergencyContact: string
  email: string
  website: string
  bloodBankInChargeName: string
  bloodBankInChargePhone: string
  // Step 4 – Blood Inventory
  hasBloodBank: boolean | null
  storageCapacity: string
  available24x7: boolean | null
  bloodInventory: Partial<Record<string, string>>
  bedCapacity: string
  specializations: string
  runsDonationCamps: boolean | null
  // Step 5 – Manager / Admin
  managerName: string
  managerPhone: string
  managerEmail: string
  idProofFileName: string
  govtSchemes: string
  additionalNotes: string
}

const HOSPITAL_INITIAL: HospitalData = {
  aadharNumber: "", hospitalName: "", hospitalType: "", registrationNumber: "",
  yearEstablished: "", naabhAccredited: null,
  fullAddress: "", area: "", city: "", district: "", state: "", pinCode: "",
  googleMapLink: "", latitude: "", longitude: "",
  primaryContact: "", emergencyContact: "", email: "", website: "",
  bloodBankInChargeName: "", bloodBankInChargePhone: "",
  hasBloodBank: null, storageCapacity: "", available24x7: null,
  bloodInventory: {}, bedCapacity: "", specializations: "", runsDonationCamps: null,
  managerName: "", managerPhone: "", managerEmail: "", idProofFileName: "",
  govtSchemes: "", additionalNotes: "",
}

function HospitalStepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0.5 mb-1">
      {HOSPITAL_STEPS.map((s, i) => {
        const Icon = s.icon
        const done = i + 1 < current
        const active = i + 1 === current
        return (
          <div key={s.label} className="flex items-center gap-0.5">
            <div className="flex flex-col items-center gap-0.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors
                ${active ? "bg-red-600 text-white" : done ? "bg-red-200 text-red-700" : "bg-gray-100 text-gray-400"}`}>
                {done ? <span className="text-[10px] font-bold">✓</span> : <Icon className="h-3 w-3" />}
              </div>
              <span className={`text-[9px] font-medium ${active ? "text-red-600" : "text-gray-400"}`}>{s.label}</span>
            </div>
            {i < HOSPITAL_STEPS.length - 1 && (
              <div className={`w-4 h-0.5 mb-3 ${done ? "bg-red-300" : "bg-gray-200"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function HospitalOnboarding({ locationAllowed, onDone }: { locationAllowed: boolean; onDone: () => void }) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<HospitalData>(HOSPITAL_INITIAL)
  const [error, setError] = useState<string | null>(null)
  const [locating, setLocating] = useState(false)

  function set<K extends keyof HospitalData>(field: K, value: HospitalData[K]) {
    setData((d) => ({ ...d, [field]: value }))
  }

  useEffect(() => {
    if (locationAllowed && navigator.geolocation) {
      setLocating(true)
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          set("latitude", String(pos.coords.latitude.toFixed(5)))
          set("longitude", String(pos.coords.longitude.toFixed(5)))
          setLocating(false)
        },
        () => setLocating(false),
        { timeout: 8000 }
      )
    }
  }, [locationAllowed])

  function validate(): string | null {
    if (step === 1) {
      const aadhar = data.aadharNumber.replace(/\s|-/g, "")
      if (!aadhar || !/^\d{12}$/.test(aadhar)) return "Enter a valid 12-digit Aadhar number."
      if (!data.hospitalName.trim()) return "Hospital name is required."
      if (!data.hospitalType) return "Please select the hospital type."
      if (!data.registrationNumber.trim()) return "Registration / License number is required."
    }
    if (step === 2) {
      if (!data.fullAddress.trim()) return "Full address is required."
      if (!data.city.trim()) return "City is required."
      if (!data.district.trim()) return "District is required."
      if (!data.state.trim()) return "State is required."
      if (!data.pinCode.trim() || !/^\d{6}$/.test(data.pinCode)) return "Enter a valid 6-digit PIN code."
    }
    if (step === 3) {
      const ph = data.primaryContact.replace(/\s|-/g, "")
      if (!ph || !/^\+?[0-9]{10,13}$/.test(ph)) return "Enter a valid primary contact number."
      const eph = data.emergencyContact.replace(/\s|-/g, "")
      if (!eph || !/^\+?[0-9]{10,13}$/.test(eph)) return "Enter a valid emergency contact number."
      if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
        return "Enter a valid email address."
    }
    if (step === 4) {
      if (data.hasBloodBank === null) return "Please indicate whether the hospital has a blood bank."
      if (data.available24x7 === null) return "Please indicate 24×7 availability."
    }
    if (step === 5) {
      if (!data.managerName.trim()) return "Hospital manager name is required."
      const mph = data.managerPhone.replace(/\s|-/g, "")
      if (!mph || !/^\+?[0-9]{10,13}$/.test(mph)) return "Enter a valid manager phone number."
    }
    return null
  }

  function next() {
    const err = validate()
    if (err) { setError(err); return }
    setError(null)
    if (step < HOSPITAL_STEPS.length) setStep((s) => s + 1)
    else onDone()
  }

  function formatAadhar(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 12)
    return digits.replace(/(\d{4})(\d{1,4})?(\d{1,4})?/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join("-")
    )
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-3">
        <HospitalStepIndicator current={step} />
        <CardTitle className="text-lg">{HOSPITAL_STEPS[step - 1].label}</CardTitle>
        <CardDescription className="text-xs">
          Step {step} of {HOSPITAL_STEPS.length} — Hospital registration &amp; verification
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* ── Step 1: Identity & Verification ── */}
        {step === 1 && (
          <div className="space-y-4">
            <SectionLabel icon={CreditCard} label="User Identity Proof" />

            <div className="space-y-1.5">
              <Label>Aadhar Number <span className="text-red-500">*</span></Label>
              <Input
                placeholder="XXXX-XXXX-XXXX"
                value={data.aadharNumber}
                onChange={(e) => set("aadharNumber", formatAadhar(e.target.value))}
                maxLength={14}
              />
              <p className="text-[10px] text-gray-400">Used for identity verification only. Stored securely and never shared publicly.</p>
            </div>

            <Separator />
            <SectionLabel icon={Hospital} label="Hospital Information" />

            <div className="space-y-1.5">
              <Label>Hospital Name <span className="text-red-500">*</span></Label>
              <Input placeholder="e.g. Apollo Hospitals, AIIMS Delhi"
                value={data.hospitalName} onChange={(e) => set("hospitalName", e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label>Hospital Type <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 gap-2">
                {HOSPITAL_TYPES.map((t) => (
                  <button key={t.value} type="button" onClick={() => set("hospitalType", t.value)}
                    className={`py-2 px-3 rounded-xl border-2 text-xs font-semibold text-left transition-all
                      ${data.hospitalType === t.value
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>
                <Hash className="h-3 w-3 inline mr-1" />
                Registration / License Number <span className="text-red-500">*</span>
              </Label>
              <Input placeholder="e.g. MH-PVT-2021-00123"
                value={data.registrationNumber} onChange={(e) => set("registrationNumber", e.target.value)} />
              <p className="text-[10px] text-gray-400">
                Government-issued hospital registration or blood bank license number. Required for verification.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Year Established <span className="text-gray-400 font-normal text-xs">(optional)</span></Label>
                <NativeSelect value={data.yearEstablished} onChange={(v) => set("yearEstablished", v)}>
                  <option value="">Select year</option>
                  {Array.from({ length: 100 }, (_, i) => String(CURRENT_YEAR - i)).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </NativeSelect>
              </div>
              <div className="space-y-1.5">
                <Label><Award className="h-3 w-3 inline mr-1" />NABH Accredited?</Label>
                <div className="flex gap-2 mt-1">
                  {([true, false] as const).map((opt) => (
                    <button key={String(opt)} type="button" onClick={() => set("naabhAccredited", opt)}
                      className={`flex-1 py-2 rounded-xl border-2 text-xs font-semibold transition-all
                        ${data.naabhAccredited === opt
                          ? opt ? "border-green-500 bg-green-50 text-green-700" : "border-gray-400 bg-gray-50 text-gray-600"
                          : "border-gray-200 text-gray-400 hover:border-gray-300"}`}>
                      {opt ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Address & Location ── */}
        {step === 2 && (
          <div className="space-y-4">
            <SectionLabel icon={MapPin} label="Hospital Address" />

            {locationAllowed && (
              <div className="rounded-xl bg-green-50 border border-green-200 p-3 flex items-start gap-2 text-xs text-green-700">
                <Locate className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                {locating
                  ? <span className="flex items-center gap-1.5"><Loader2 className="h-3 w-3 animate-spin" /> Detecting location…</span>
                  : data.latitude
                    ? <span>GPS: <strong>{data.latitude}, {data.longitude}</strong>. Confirm address below.</span>
                    : <span>GPS detection failed. Please fill address manually.</span>
                }
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Full Address <span className="text-red-500">*</span></Label>
              <textarea rows={2} placeholder="Building name, floor, street number…"
                value={data.fullAddress} onChange={(e) => set("fullAddress", e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 resize-none" />
            </div>

            <div className="space-y-1.5">
              <Label>Area / Locality</Label>
              <Input placeholder="e.g. Bandra West, Sector 15"
                value={data.area} onChange={(e) => set("area", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>City <span className="text-red-500">*</span></Label>
                <Input placeholder="e.g. Mumbai" value={data.city} onChange={(e) => set("city", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>District <span className="text-red-500">*</span></Label>
                <Input placeholder="e.g. Mumbai Suburban" value={data.district} onChange={(e) => set("district", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>State <span className="text-red-500">*</span></Label>
                <Input placeholder="e.g. Maharashtra" value={data.state} onChange={(e) => set("state", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>PIN Code <span className="text-red-500">*</span></Label>
                <Input placeholder="6 digits" maxLength={6}
                  value={data.pinCode} onChange={(e) => set("pinCode", e.target.value.replace(/\D/g, "").slice(0, 6))} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Country</Label>
                <Input value="India" disabled className="bg-gray-50 text-gray-500" />
              </div>
            </div>

            <Separator />

            <div className="space-y-1.5">
              <Label>
                <Link className="h-3 w-3 inline mr-1" />
                Google Maps Link <span className="text-gray-400 font-normal text-xs">(optional)</span>
              </Label>
              <Input placeholder="https://maps.google.com/…"
                value={data.googleMapLink} onChange={(e) => set("googleMapLink", e.target.value)} />
              <p className="text-[10px] text-gray-400">Paste your hospital's Google Maps share link. Helps donors and patients navigate easily.</p>
            </div>
          </div>
        )}

        {/* ── Step 3: Contact Details ── */}
        {step === 3 && (
          <div className="space-y-4">
            <SectionLabel icon={Phone} label="Contact Details" />

            <div className="space-y-1.5">
              <Label>Primary Contact Number <span className="text-red-500">*</span></Label>
              <Input type="tel" placeholder="+91 22 1234 5678"
                value={data.primaryContact} onChange={(e) => set("primaryContact", e.target.value)} />
              <p className="text-[10px] text-gray-400">Main reception / front desk number.</p>
            </div>

            <div className="space-y-1.5">
              <Label>Emergency Contact Number (24×7) <span className="text-red-500">*</span></Label>
              <Input type="tel" placeholder="+91 98765 43210"
                value={data.emergencyContact} onChange={(e) => set("emergencyContact", e.target.value)} />
              <p className="text-[10px] text-red-400">This number will be shown to donors during urgent blood requests.</p>
            </div>

            <div className="space-y-1.5">
              <Label>Email Address <span className="text-red-500">*</span></Label>
              <Input type="email" placeholder="bloodbank@hospital.com"
                value={data.email} onChange={(e) => set("email", e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label>
                <Globe className="h-3 w-3 inline mr-1" />
                Website <span className="text-gray-400 font-normal text-xs">(optional)</span>
              </Label>
              <Input placeholder="https://www.yourhospital.com"
                value={data.website} onChange={(e) => set("website", e.target.value)} />
            </div>

            <Separator />
            <SectionLabel icon={Droplets} label="Blood Bank In-Charge" />
            <p className="text-xs text-gray-400">Person responsible for blood bank operations and donor coordination.</p>

            <div className="space-y-1.5">
              <Label>In-Charge Name <span className="text-gray-400 font-normal text-xs">(optional)</span></Label>
              <Input placeholder="e.g. Dr. Priya Mehta"
                value={data.bloodBankInChargeName} onChange={(e) => set("bloodBankInChargeName", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>In-Charge Direct Phone <span className="text-gray-400 font-normal text-xs">(optional)</span></Label>
              <Input type="tel" placeholder="+91 98765 43210"
                value={data.bloodBankInChargePhone} onChange={(e) => set("bloodBankInChargePhone", e.target.value)} />
            </div>
          </div>
        )}

        {/* ── Step 4: Blood Inventory ── */}
        {step === 4 && (
          <div className="space-y-5">
            <SectionLabel icon={Droplets} label="Blood Bank & Inventory" />

            <div className="space-y-2">
              <Label>Does this hospital have a blood bank? <span className="text-red-500">*</span></Label>
              <YesNo value={data.hasBloodBank} onChange={(v) => {
                set("hasBloodBank", v)
                if (!v) { set("storageCapacity", ""); set("bloodInventory", {}) }
              }} />
            </div>

            {data.hasBloodBank === true && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Storage Capacity (units) <span className="text-gray-400 font-normal text-xs">(optional)</span></Label>
                    <Input type="number" min={0} placeholder="e.g. 200"
                      value={data.storageCapacity} onChange={(e) => set("storageCapacity", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Blood Bank License No. <span className="text-gray-400 font-normal text-xs">(optional)</span></Label>
                    <Input placeholder="e.g. BB/MH/2020/001"
                      value={""}
                      onChange={() => {}}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Available Blood Groups &amp; Current Units</Label>
                  <p className="text-[10px] text-gray-400">Enter 0 if the group is unavailable right now. Leave blank to skip.</p>
                  <div className="grid grid-cols-2 gap-2">
                    {BLOOD_GROUPS.map((bg) => (
                      <div key={bg} className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 bg-gray-50">
                        <span className="text-sm font-bold text-red-600 w-8">{bg}</span>
                        <Input
                          type="number"
                          min={0}
                          placeholder="units"
                          className="h-7 text-xs px-2"
                          value={data.bloodInventory[bg] ?? ""}
                          onChange={(e) => set("bloodInventory", { ...data.bloodInventory, [bg]: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <Separator />
            <SectionLabel icon={Building} label="Hospital Capacity & Services" />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label><Bed className="h-3 w-3 inline mr-1" />Bed Capacity <span className="text-gray-400 font-normal text-xs">(optional)</span></Label>
                <Input type="number" min={1} placeholder="e.g. 300"
                  value={data.bedCapacity} onChange={(e) => set("bedCapacity", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Available 24×7? <span className="text-red-500">*</span></Label>
                <div className="flex gap-2 mt-1">
                  {([true, false] as const).map((opt) => (
                    <button key={String(opt)} type="button" onClick={() => set("available24x7", opt)}
                      className={`flex-1 py-2 rounded-xl border-2 text-xs font-semibold transition-all
                        ${data.available24x7 === opt
                          ? opt ? "border-green-500 bg-green-50 text-green-700" : "border-gray-400 bg-gray-50 text-gray-600"
                          : "border-gray-200 text-gray-400 hover:border-gray-300"}`}>
                      {opt ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Specializations / Departments <span className="text-gray-400 font-normal text-xs">(optional)</span></Label>
              <Input placeholder="e.g. Oncology, Cardiology, Thalassemia Centre"
                value={data.specializations} onChange={(e) => set("specializations", e.target.value)} />
              <p className="text-[10px] text-gray-400">Helps match patients with specialty blood needs.</p>
            </div>

            <div className="space-y-2">
              <Label>Does the hospital organise blood donation camps?</Label>
              <YesNo value={data.runsDonationCamps} onChange={(v) => set("runsDonationCamps", v)} />
            </div>
          </div>
        )}

        {/* ── Step 5: Manager / Admin ── */}
        {step === 5 && (
          <div className="space-y-4">
            <SectionLabel icon={Users} label="Hospital Manager / Admin" />
            <p className="text-xs text-gray-400">This person will be the primary point of accountability for all blood usage and requests on Quick Blood.</p>

            <div className="space-y-1.5">
              <Label>Manager Full Name <span className="text-red-500">*</span></Label>
              <Input placeholder="e.g. Mr. Arun Sharma"
                value={data.managerName} onChange={(e) => set("managerName", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Manager Phone <span className="text-red-500">*</span></Label>
              <Input type="tel" placeholder="+91 98765 43210"
                value={data.managerPhone} onChange={(e) => set("managerPhone", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Manager Email <span className="text-gray-400 font-normal text-xs">(optional)</span></Label>
              <Input type="email" placeholder="manager@hospital.com"
                value={data.managerEmail} onChange={(e) => set("managerEmail", e.target.value)} />
            </div>

            <Separator />
            <SectionLabel icon={Upload} label="Hospital ID Proof Upload" />
            <p className="text-xs text-gray-400">Upload hospital registration certificate, blood bank license, or any govt-issued hospital document.</p>

            <div className="space-y-1.5">
              <Label>Upload Document <span className="text-red-500">*</span></Label>
              <label className={`flex flex-col items-center gap-2 border-2 border-dashed rounded-xl py-6 px-4 cursor-pointer transition-colors
                ${data.idProofFileName ? "border-green-400 bg-green-50" : "border-gray-300 bg-gray-50 hover:border-red-300 hover:bg-red-50"}`}>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) set("idProofFileName", file.name)
                  }} />
                {data.idProofFileName ? (
                  <>
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                    <span className="text-sm font-semibold text-green-700">{data.idProofFileName}</span>
                    <span className="text-xs text-green-600">Tap to change</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-8 w-8 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-600">Tap to upload</span>
                    <span className="text-xs text-gray-400">PDF, JPG, PNG — max 5 MB</span>
                  </>
                )}
              </label>
            </div>

            <Separator />

            <div className="space-y-1.5">
              <Label>Government Scheme Affiliations <span className="text-gray-400 font-normal text-xs">(optional)</span></Label>
              <Input placeholder="e.g. Ayushman Bharat, PM-JAY, State Blood Policy"
                value={data.govtSchemes} onChange={(e) => set("govtSchemes", e.target.value)} />
              <p className="text-[10px] text-gray-400">Helps identify priority hospitals for government-assisted patients.</p>
            </div>

            <div className="space-y-1.5">
              <Label>Additional Notes <span className="text-gray-400 font-normal text-xs">(optional)</span></Label>
              <textarea rows={3} placeholder="Any special facilities, operating hours, or notes for donors and patients…"
                value={data.additionalNotes} onChange={(e) => set("additionalNotes", e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400 resize-none" />
            </div>

            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Your hospital registration will be reviewed by Quick Blood admins within <strong>24–48 hours</strong>.
                You will be notified by email once verified. Misuse of blood data is a legal offence.
              </span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-1">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={() => { setError(null); setStep((s) => s - 1) }} className="flex-1">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          )}
          <Button type="button" onClick={next} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
            {step === HOSPITAL_STEPS.length
              ? <><CheckCircle2 className="h-4 w-4 mr-2" /> Submit for Verification</>
              : <>Next <ChevronRight className="h-4 w-4 ml-1" /></>}
          </Button>
        </div>
        <p className="text-center text-xs text-gray-400">All data is encrypted and used only for blood coordination on Quick Blood.</p>
      </CardContent>
    </Card>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT PAGE — role branch
// ══════════════════════════════════════════════════════════════════════════════

export default function OnboardingPage() {
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)
  const [userName, setUserName] = useState("")
  const [locationAllowed, setLocationAllowed] = useState(false)
  const [done, setDone] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const r = sessionStorage.getItem("qb_user_role")
    const n = sessionStorage.getItem("qb_user_name") ?? ""
    if (!r) { router.replace("/auth/register"); return }
    setRole(r)
    setUserName(n)
    setLocationAllowed(sessionStorage.getItem("qb_perm_location") === "allowed")
  }, [router])

  function handleDone() {
    startTransition(async () => {
      // TODO: submit profile/request to backend API
      await new Promise((res) => setTimeout(res, 1000))
      sessionStorage.removeItem("qb_user_name")
      sessionStorage.removeItem("qb_user_role")
      sessionStorage.removeItem("qb_perm_location")
      sessionStorage.removeItem("qb_perm_notifications")
      sessionStorage.removeItem("qb_perm_messages")
      setDone(true)
      await new Promise((res) => setTimeout(res, 1500))
      router.push("/auth/login?registered=true")
    })
  }

  if (done || isPending) return <DoneScreen />

  if (!role) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-red-500" />
        </CardContent>
      </Card>
    )
  }

  if (role === "donor") {
    return <DonorOnboarding locationAllowed={locationAllowed} onDone={handleDone} />
  }

  if (role === "hospital") {
    return <HospitalOnboarding locationAllowed={locationAllowed} onDone={handleDone} />
  }

  // patient or patient's family
  return <PatientOnboarding userName={userName} onDone={handleDone} />
}
