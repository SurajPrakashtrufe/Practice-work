"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, AlertCircle, User, Droplets, Phone, Mail, Lock } from "lucide-react"
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

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={isPending}
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

          <p className="text-center text-xs text-gray-400">
            By registering you agree to our{" "}
            <span className="text-red-600 cursor-pointer hover:underline">Terms</span> &amp;{" "}
            <span className="text-red-600 cursor-pointer hover:underline">Privacy Policy</span>
          </p>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-red-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
