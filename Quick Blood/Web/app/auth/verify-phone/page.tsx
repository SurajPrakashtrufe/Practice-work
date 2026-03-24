"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Smartphone, Loader2, AlertCircle, RefreshCw, CheckCircle2, MapPin, Bell, MessageSquare, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"

type Permission = "location" | "notifications" | "messages"

const PERMISSIONS: {
  key: Permission
  icon: React.ReactNode
  title: string
  description: string
  reason: string
  color: string
}[] = [
  {
    key: "location",
    icon: <MapPin className="h-8 w-8 text-red-600" />,
    title: "Allow Location Access",
    description: "Quick Blood would like to access your location.",
    reason:
      "We use your location to find nearby blood donors, patients, and hospitals in real-time emergencies — helping save lives faster.",
    color: "bg-red-100",
  },
  {
    key: "notifications",
    icon: <Bell className="h-8 w-8 text-orange-500" />,
    title: "Allow Notifications",
    description: "Quick Blood would like to send you notifications.",
    reason:
      "Get instant alerts for blood requests matching your type, urgent donation drives, and updates on requests you've responded to.",
    color: "bg-orange-100",
  },
  {
    key: "messages",
    icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
    title: "Allow Messages",
    description: "Quick Blood would like to send you SMS messages.",
    reason:
      "Critical OTPs and emergency blood request alerts will be sent via SMS so you never miss an urgent need — even without internet.",
    color: "bg-blue-100",
  },
]

function PermissionDialog({
  permission,
  onAllow,
  onDeny,
}: {
  permission: (typeof PERMISSIONS)[number]
  onAllow: (key: Permission) => void
  onDeny: (key: Permission) => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      {/* Sheet */}
      <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Icon area */}
        <div className="flex flex-col items-center gap-3 px-6 pt-8 pb-4 text-center">
          <div className={`w-16 h-16 rounded-2xl ${permission.color} flex items-center justify-center`}>
            {permission.icon}
          </div>
          <h2 className="text-lg font-bold text-gray-900">{permission.title}</h2>
          <p className="text-sm text-gray-500">{permission.description}</p>
          <div className="w-full rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-xs text-gray-600 leading-relaxed text-left">
            <ShieldCheck className="h-3.5 w-3.5 inline-block mr-1 text-green-600 mb-0.5" />
            {permission.reason}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 px-6 pb-6 pt-2">
          <button
            onClick={() => onAllow(permission.key)}
            className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold py-3 text-sm transition-colors"
          >
            Allow
          </button>
          <button
            onClick={() => onDeny(permission.key)}
            className="w-full rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 text-sm transition-colors"
          >
            Don&apos;t Allow
          </button>
        </div>
      </div>
    </div>
  )
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

export default function VerifyPhonePage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [maskedPhone, setMaskedPhone] = useState("")
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [success, setSuccess] = useState(false)
  const [permissionStep, setPermissionStep] = useState<number | null>(null)

  useEffect(() => {
    const data = sessionStorage.getItem("qb_pending_registration")
    const emailVerified = sessionStorage.getItem("qb_email_verified")

    if (!data) {
      router.replace("/auth/register")
      return
    }
    if (!emailVerified) {
      router.replace("/auth/verify-email")
      return
    }

    const { phone } = JSON.parse(data) as { phone: string }
    const digits = phone.replace(/\D/g, "")
    setMaskedPhone(`${"*".repeat(Math.max(digits.length - 4, 3))}${digits.slice(-4)}`)
  }, [router])

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true)
      return
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  function handleResend() {
    setCountdown(60)
    setCanResend(false)
    setOtp("")
    setError(null)
    // TODO: call resend OTP API
  }

  function handleVerify() {
    if (otp.length < 6) {
      setError("Please enter the complete 6-digit OTP.")
      return
    }
    setError(null)

    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 800))
      const stored = sessionStorage.getItem("qb_phone_otp")
      if (otp !== stored) {
        setError("Incorrect OTP. Please check and try again.")
        return
      }

      // Mark phone verified and complete registration
      sessionStorage.setItem("qb_phone_verified", "true")

      // Preserve name + role for onboarding before clearing
      const regRaw = sessionStorage.getItem("qb_pending_registration")
      if (regRaw) {
        const { fullName, role } = JSON.parse(regRaw) as { fullName: string; role: string }
        sessionStorage.setItem("qb_user_name", fullName)
        sessionStorage.setItem("qb_user_role", role)
      }

      // TODO: call registration API with sessionStorage data
      // await api.register(JSON.parse(regRaw!))

      // Clear session data
      sessionStorage.removeItem("qb_pending_registration")
      sessionStorage.removeItem("qb_email_otp")
      sessionStorage.removeItem("qb_phone_otp")
      sessionStorage.removeItem("qb_email_verified")
      sessionStorage.removeItem("qb_phone_verified")

      setSuccess(true)
      await new Promise((r) => setTimeout(r, 1200))
      setPermissionStep(0)
    })
  }

  function advancePermission(key: Permission, granted: boolean) {
    sessionStorage.setItem(`qb_perm_${key}`, granted ? "allowed" : "denied")
    const next = (permissionStep ?? 0) + 1
    if (next >= PERMISSIONS.length) {
      setPermissionStep(null)
      router.push("/auth/onboarding")
    } else {
      setPermissionStep(next)
    }
  }

  if (success) {
    return (
      <>
        {permissionStep !== null && (
          <PermissionDialog
            permission={PERMISSIONS[permissionStep]}
            onAllow={(k) => advancePermission(k, true)}
            onDeny={(k) => advancePermission(k, false)}
          />
        )}
        <Card className="shadow-lg border-0">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-gray-900">Account Created!</h2>
              <p className="text-sm text-gray-500">
                {permissionStep === null
                  ? "Redirecting to login..."
                  : "Setting up your permissions..."}
              </p>
            </div>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-red-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="space-y-1 text-center pb-4">
        <StepIndicator current={3} />
        <div className="flex justify-center mt-1">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <Smartphone className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <CardTitle className="text-xl mt-2">Verify your phone</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent via SMS to{" "}
          <span className="font-semibold text-gray-800">{maskedPhone}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Demo hint */}
        <Alert className="border-amber-200 bg-amber-50">
          <AlertDescription className="text-xs text-amber-700">
            <strong>Demo mode:</strong> use OTP{" "}
            <strong className="font-mono tracking-widest">123456</strong>
          </AlertDescription>
        </Alert>

        <div className="flex flex-col items-center gap-2">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={otp}
            onChange={setOtp}
            disabled={isPending}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="border-gray-300 focus:border-red-500" />
              <InputOTPSlot index={1} className="border-gray-300 focus:border-red-500" />
              <InputOTPSlot index={2} className="border-gray-300 focus:border-red-500" />
              <InputOTPSlot index={3} className="border-gray-300 focus:border-red-500" />
              <InputOTPSlot index={4} className="border-gray-300 focus:border-red-500" />
              <InputOTPSlot index={5} className="border-gray-300 focus:border-red-500" />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-xs text-gray-400">Enter the 6-digit code</p>
        </div>

        <Button
          className="w-full bg-red-600 hover:bg-red-700 text-white"
          onClick={handleVerify}
          disabled={isPending || otp.length < 6}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying &amp; Creating Account...
            </>
          ) : (
            "Verify Phone & Create Account"
          )}
        </Button>

        <div className="text-center text-sm text-gray-500">
          Didn&apos;t receive the code?{" "}
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-red-600 font-semibold hover:underline inline-flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Resend OTP
            </button>
          ) : (
            <span>
              Resend in{" "}
              <span className="font-semibold text-gray-700 tabular-nums">{countdown}s</span>
            </span>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push("/auth/verify-email")}
            className="text-xs text-gray-400 hover:text-gray-600 hover:underline"
          >
            &larr; Back to email verification
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
