import { NextRequest } from "next/server"
import { execute, query } from "@/lib/db"
import { hashPassword, signToken } from "@/lib/auth"
import { ok, fail, serverError } from "@/lib/api"

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password, role } = await req.json()

    if (!name || !email || !phone || !password || !role) {
      return fail("All fields are required.")
    }
    if (!["Donor", "Patient", "Hospital"].includes(role)) {
      return fail("Invalid role.")
    }

    // Check uniqueness
    const existing = await query<{ Id: string }[]>`
      SELECT Id FROM Users WHERE Email = ${email} OR Phone = ${phone}
    `
    if (existing.length > 0) return fail("Email or phone already registered.", 409)

    const { hash, salt } = hashPassword(password)
    // Store hash:salt together
    const passwordHash = `${hash}:${salt}`

    await execute`
      INSERT INTO Users (Name, Email, Phone, PasswordHash, Role)
      VALUES (${name}, ${email}, ${phone}, ${passwordHash}, ${role})
    `

    const user = await query<{ Id: string; Name: string; Email: string; Role: string }[]>`
      SELECT Id, Name, Email, Role FROM Users WHERE Email = ${email}
    `
    const u = user[0]
    const token = signToken({ userId: u.Id, role: u.Role, email: u.Email })

    return ok({ token, user: { id: u.Id, name: u.Name, email: u.Email, role: u.Role } }, 201)
  } catch (err) {
    return serverError(err)
  }
}
