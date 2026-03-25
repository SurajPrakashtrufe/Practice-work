import { NextRequest } from "next/server"
import { query, execute } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { ok, fail, unauthorized, serverError } from "@/lib/api"

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()

    const { code, type } = await req.json()
    if (!code || !type) return fail("code and type are required.")
    if (!["Email", "Phone"].includes(type)) return fail("type must be Email or Phone.")

    const rows = await query<{ Id: string; IsUsed: boolean; ExpiresAt: string }[]>`
      SELECT Id, IsUsed, ExpiresAt
      FROM OtpVerifications
      WHERE UserId = ${user.userId} AND Type = ${type} AND Code = ${code}
      ORDER BY CreatedAt DESC
    `
    const otp = rows[0]
    if (!otp) return fail("Invalid OTP.", 400)
    if (otp.IsUsed) return fail("OTP already used.", 400)
    if (new Date(otp.ExpiresAt) < new Date()) return fail("OTP expired.", 400)

    // Mark OTP used
    await execute`UPDATE OtpVerifications SET IsUsed = 1 WHERE Id = ${otp.Id}`

    // Mark user verified
    const col = type === "Email" ? "IsEmailVerified" : "IsPhoneVerified"
    await execute`UPDATE Users SET ${col} = 1 WHERE Id = ${user.userId}`

    return ok({ verified: true })
  } catch (err) {
    return serverError(err)
  }
}
