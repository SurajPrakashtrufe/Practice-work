"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Mail, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.")
      return
    }

    startTransition(async () => {
      // TODO: call password reset API
      await new Promise((r) => setTimeout(r, 1000))
      setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="flex flex-col items-center gap-5 py-10 text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-7 w-7 text-green-600" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-gray-900">Check your inbox</h2>
            <p className="text-sm text-gray-500 max-w-xs">
              We sent a password reset link to{" "}
              <span className="font-semibold text-gray-700">{email}</span>. It expires in 30
              minutes.
            </p>
          </div>
          <div className="w-full space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => { setSubmitted(false); setEmail("") }}
            >
              Try a different email
            </Button>
            <Link href="/auth/login">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                Back to Sign in
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-1">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <Mail className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <CardTitle className="text-xl text-center">Forgot your password?</CardTitle>
        <CardDescription className="text-center">
          Enter your registered email and we&apos;ll send you a reset link.
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
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1 hover:underline"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
