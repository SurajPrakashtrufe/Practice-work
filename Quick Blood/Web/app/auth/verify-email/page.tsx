"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Mail, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"

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

export default function VerifyEmailPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [maskedEmail, setMaskedEmail] = useState("")
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    const data = sessionStorage.getItem("qb_pending_registration")
    if (!data) {
      router.replace("/auth/register")
      return
    }
    const { email } = JSON.parse(data) as { email: string }
    const [local, domain] = email.split("@")
    setMaskedEmail(`${local.slice(0, 2)}${"*".repeat(Math.max(local.length - 2, 3))}@${domain}`)
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
      const stored = sessionStorage.getItem("qb_email_otp")
      if (otp !== stored) {
        setError("Incorrect OTP. Please check and try again.")
        return
      }
      sessionStorage.setItem("qb_email_verified", "true")
      router.push("/auth/verify-phone")
    })
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="space-y-1 text-center pb-4">
        <StepIndicator current={2} />
        <div className="flex justify-center mt-1">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <Mail className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <CardTitle className="text-xl mt-2">Verify your email</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-gray-800">{maskedEmail}</span>
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
            <strong>Demo mode:</strong> use OTP <strong className="font-mono tracking-widest">123456</strong>
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
              Verifying...
            </>
          ) : (
            "Verify Email"
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
            onClick={() => router.push("/auth/register")}
            className="text-xs text-gray-400 hover:text-gray-600 hover:underline"
          >
            &larr; Back to registration
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
