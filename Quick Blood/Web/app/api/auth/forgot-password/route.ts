import { NextRequest } from "next/server"
import { query, execute } from "@/lib/db"
import { ok, fail, serverError } from "@/lib/api"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return fail("Email is required.")

    const rows = await query<{ Id: string }[]>`SELECT Id FROM Users WHERE Email = ${email}`
    // Always return ok to prevent email enumeration
    if (rows.length === 0) return ok({ sent: true })

    const token     = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await execute`
      INSERT INTO PasswordResetTokens (UserId, Token, ExpiresAt)
      VALUES (${rows[0].Id}, ${token}, ${expiresAt})
    `

    // TODO: send email with reset link containing the token
    // e.g. sendEmail(email, `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`)

    return ok({ sent: true })
  } catch (err) {
    return serverError(err)
  }
}
