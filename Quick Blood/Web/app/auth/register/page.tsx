"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, AlertCircle, User, Droplets, Phone, Mail, Lock, X, FileText, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function TermsDialog({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-red-600" />
            <h2 className="text-base font-bold text-gray-900">Terms &amp; Conditions</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4 text-sm text-gray-700 leading-relaxed">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
            Last updated: March 2026
          </p>

          <p>
            Welcome to <strong>Quick Blood</strong>. By creating an account, you agree to these Terms &amp; Conditions
            and our Privacy Policy. Please read them carefully before proceeding.
          </p>

          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900">1. Data Sharing &amp; Consent</h3>
            <p>
              By registering with Quick Blood, you expressly consent to the collection, storage, and sharing of
              your basic personal information — including your name, blood group, age, phone number, and location —
              with verified patients, donors, and hospitals on the platform. This data sharing is limited strictly
              to facilitating emergency blood requests and life-saving coordination.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900">2. Purpose of Data Use</h3>
            <p>
              Your contact information and blood group details may be shared with:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-gray-600">
              <li>Patients or their families in need of your blood type</li>
              <li>Registered hospitals and medical facilities</li>
              <li>Verified Quick Blood coordinators for emergency logistics</li>
            </ul>
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900">3. Notifications &amp; Communications</h3>
            <p>
              You agree to receive push notifications, SMS alerts, and in-app messages related to blood donation
              requests, emergency needs, and account activity. You may manage notification preferences from your
              profile settings at any time.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900">4. Location Access</h3>
            <p>
              Quick Blood may request access to your device location to help match you with nearby patients or
              hospitals. Location data is used only during active sessions and is never sold to third parties.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900">5. Eligibility</h3>
            <p>
              You confirm that you are between 18 and 65 years of age and are medically fit to participate as a
              donor (if registering as one). Providing false medical information is strictly prohibited.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900">6. Data Security</h3>
            <p>
              We employ industry-standard security measures to protect your data. However, no digital transmission
              is 100% secure. By using Quick Blood, you acknowledge and accept this inherent risk.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900">7. Right to Withdraw</h3>
            <p>
              You may request deletion of your account and personal data at any time by contacting us. Upon
              deletion, your information will be removed from active systems within 30 days, subject to legal
              retention requirements.
            </p>
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900">8. Changes to Terms</h3>
            <p>
              Quick Blood reserves the right to update these Terms. Continued use of the app after changes
              constitutes your acceptance of the revised Terms.
            </p>
          </div>

          <p className="text-xs text-gray-400">
            For questions, contact us at <strong>legal@quickblood.app</strong>
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={onClose}
          >
            <Check className="h-4 w-4 mr-2" />
            I have read and understood
          </Button>
        </div>
      </div>
    </div>
  )
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const

interface RegisterForm {
  fullName: string
  age: string
  bloodGroup: string
  role: string
  phone: string
  email: string
  password: string
  confirmPassword: string
}

const INITIAL: RegisterForm = {
  fullName: "",
  age: "",
  bloodGroup: "",
  role: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
}

function StepIndicator({ current }: { current: number }) {
  const steps = ["Details", "Email OTP", "Phone OTP"]
  return (
    <div className="flex items-center justify-center gap-2 mb-2">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-0.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                i + 1 === current
                  ? "bg-red-600 text-white"
                  : i + 1 < current
                  ? "bg-red-200 text-red-700"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {i + 1 < current ? "✓" : i + 1}
            </div>
            <span
              className={`text-[10px] font-medium ${
                i + 1 === current ? "text-red-600" : "text-gray-400"
              }`}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-8 h-0.5 mb-3 transition-colors ${
                i + 1 < current ? "bg-red-300" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<RegisterForm>(INITIAL)
  const [showTerms, setShowTerms] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  function set(field: keyof RegisterForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function validate(): string | null {
    if (!form.fullName.trim()) return "Full name is required."
    const age = parseInt(form.age)
    if (!form.age || isNaN(age) || age < 18 || age > 65)
      return "Age must be between 18 and 65 years."
    if (!form.bloodGroup) return "Please select your blood group."
    if (!form.role) return "Please select your role."
    const phone = form.phone.replace(/\s|-/g, "")
    if (!phone || !/^\+?[0-9]{10,13}$/.test(phone))
      return "Enter a valid phone number (10–13 digits)."
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Enter a valid email address."
    if (form.password.length < 8) return "Password must be at least 8 characters."
    if (form.password !== form.confirmPassword) return "Passwords do not match."
    if (!termsAccepted) return "You must agree to the Terms & Conditions to continue."
    return null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError(null)

    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 500))
      // Store pending registration data for OTP verification steps
      sessionStorage.setItem("qb_pending_registration", JSON.stringify(form))
      sessionStorage.setItem("qb_email_otp", "123456")   // Demo OTP
      sessionStorage.setItem("qb_phone_otp", "123456")   // Demo OTP
      sessionStorage.removeItem("qb_email_verified")
      sessionStorage.removeItem("qb_phone_verified")
      router.push("/auth/verify-email")
    })
  }

  return (
    <>
    {showTerms && <TermsDialog onClose={() => setShowTerms(false)} />}
    <Card className="shadow-lg border-0">
      <CardHeader className="space-y-1 pb-4">
        <StepIndicator current={1} />
        <CardTitle className="text-xl">Create your account</CardTitle>
        <CardDescription>
          Join as a donor, hospital, or patient. Both email and phone verification required.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Section: Personal Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-red-500" />
              <span className="text-sm font-semibold text-gray-700">Personal Information</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                autoComplete="name"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  min={18}
                  max={65}
                  value={form.age}
                  onChange={(e) => set("age", e.target.value)}
                  disabled={isPending}
                />
                <p className="text-[10px] text-gray-400">18–65 years</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select
                  value={form.bloodGroup}
                  onValueChange={(v) => set("bloodGroup", v ?? "")}
                  disabled={isPending}
                >
                  <SelectTrigger id="bloodGroup">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_GROUPS.map((bg) => (
                      <SelectItem key={bg} value={bg}>
                        <span className="font-medium text-red-600">{bg}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">
                Role{" "}
                <Badge variant="secondary" className="ml-1 text-[10px]">
                  required
                </Badge>
              </Label>
              <Select
                value={form.role}
                onValueChange={(v) => set("role", v ?? "")}
                disabled={isPending}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="I am registering as..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="donor">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-red-500" />
                      Donor
                    </div>
                  </SelectItem>
                  <SelectItem value="hospital">Hospital / Medical Staff</SelectItem>
                  <SelectItem value="patient">Patient / Patient&apos;s Family</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Section: Contact */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-red-500" />
              <span className="text-sm font-semibold text-gray-700">Contact Details</span>
              <span className="text-xs text-gray-400">(both will be verified)</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3" /> Phone Number
                </span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3" /> Email Address
                </span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>

          <Separator />

          {/* Section: Password */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-red-500" />
              <span className="text-sm font-semibold text-gray-700">Set Password</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  disabled={isPending}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={(e) => set("confirmPassword", e.target.value)}
                  disabled={isPending}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Terms checkbox */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                disabled={isPending}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  termsAccepted
                    ? "bg-red-600 border-red-600"
                    : "border-gray-300 bg-white group-hover:border-red-400"
                }`}
              >
                {termsAccepted && <Check className="h-3 w-3 text-white" />}
              </div>
            </div>
            <span className="text-xs text-gray-500 leading-relaxed">
              I have read and agree to the{" "}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowTerms(true) }}
                className="text-red-600 font-semibold hover:underline"
              >
                Terms &amp; Conditions
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowTerms(true) }}
                className="text-red-600 font-semibold hover:underline"
              >
                Privacy Policy
              </button>
              , including consent to share my basic details (name, blood group, contact) with patients and hospitals for blood coordination.
            </span>
          </label>

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={isPending || !termsAccepted}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending OTP...
              </>
            ) : (
              "Continue to Verification"
            )}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-red-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
    </>
  )
}
