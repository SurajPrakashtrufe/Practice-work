import { NextRequest } from "next/server"
import { query, execute } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { ok, fail, serverError } from "@/lib/api"

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()
    if (!token || !password) return fail("token and password are required.")
    if (password.length < 8)  return fail("Password must be at least 8 characters.")

    const rows = await query<{ Id: string; UserId: string; IsUsed: boolean; ExpiresAt: string }[]>`
      SELECT Id, UserId, IsUsed, ExpiresAt FROM PasswordResetTokens WHERE Token = ${token}
    `
    const record = rows[0]
    if (!record)          return fail("Invalid or expired token.", 400)
    if (record.IsUsed)    return fail("Token already used.", 400)
    if (new Date(record.ExpiresAt) < new Date()) return fail("Token expired.", 400)

    const { hash, salt } = hashPassword(password)
    const passwordHash   = `${hash}:${salt}`

    await execute`UPDATE Users SET PasswordHash = ${passwordHash} WHERE Id = ${record.UserId}`
    await execute`UPDATE PasswordResetTokens SET IsUsed = 1 WHERE Id = ${record.Id}`

    return ok({ reset: true })
  } catch (err) {
    return serverError(err)
  }
}
