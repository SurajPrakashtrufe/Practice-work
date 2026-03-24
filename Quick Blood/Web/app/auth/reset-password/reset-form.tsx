"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface ResetFormProps {
  token: string | undefined
}

export default function ResetForm({ token }: ResetFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ password: "", confirmPassword: "" })

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  // Invalid / missing token state
  if (!token) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="flex flex-col items-center gap-5 py-10 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="h-7 w-7 text-red-600" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-gray-900">Invalid reset link</h2>
            <p className="text-sm text-gray-500">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
          </div>
          <Link href="/auth/forgot-password" className="w-full">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
              Request New Link
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  if (success) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="flex flex-col items-center gap-5 py-10 text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-7 w-7 text-green-600" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-gray-900">Password reset!</h2>
            <p className="text-sm text-gray-500">
              Your password has been updated successfully. You can now sign in with your new
              password.
            </p>
          </div>
          <Link href="/auth/login" className="w-full">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
              Sign in
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    startTransition(async () => {
      // TODO: call reset-password API with token + new password
      await new Promise((r) => setTimeout(r, 1000))
      setSuccess(true)
    })
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-1">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <Lock className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <CardTitle className="text-xl text-center">Set new password</CardTitle>
        <CardDescription className="text-center">
          Choose a strong password for your Quick Blood account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
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
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your new password"
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

          {/* Password strength hints */}
          {form.password.length > 0 && (
            <ul className="text-xs space-y-1 text-gray-500">
              <li className={form.password.length >= 8 ? "text-green-600" : "text-gray-400"}>
                {form.password.length >= 8 ? "✓" : "○"} At least 8 characters
              </li>
              <li className={/[A-Z]/.test(form.password) ? "text-green-600" : "text-gray-400"}>
                {/[A-Z]/.test(form.password) ? "✓" : "○"} One uppercase letter
              </li>
              <li className={/[0-9]/.test(form.password) ? "text-green-600" : "text-gray-400"}>
                {/[0-9]/.test(form.password) ? "✓" : "○"} One number
              </li>
            </ul>
          )}

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
