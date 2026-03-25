import { NextRequest } from "next/server"
import { query } from "@/lib/db"
import { verifyPassword, signToken } from "@/lib/auth"
import { ok, fail, serverError } from "@/lib/api"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return fail("Email and password are required.")

    const rows = await query<{ Id: string; Name: string; Email: string; Role: string; PasswordHash: string; IsActive: boolean }[]>`
      SELECT Id, Name, Email, Role, PasswordHash, IsActive FROM Users WHERE Email = ${email}
    `
    const user = rows[0]
    if (!user) return fail("Invalid credentials.", 401)
    if (!user.IsActive) return fail("Account suspended. Contact support.", 403)

    const [hash, salt] = user.PasswordHash.split(":")
    if (!verifyPassword(password, hash, salt)) return fail("Invalid credentials.", 401)

    const token = signToken({ userId: user.Id, role: user.Role, email: user.Email })

    return ok({
      token,
      user: { id: user.Id, name: user.Name, email: user.Email, role: user.Role },
    })
  } catch (err) {
    return serverError(err)
  }
}
