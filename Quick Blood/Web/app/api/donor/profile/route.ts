import { NextRequest } from "next/server"
import { query, execute } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { ok, fail, unauthorized, notFound, serverError } from "@/lib/api"

// GET /api/donor/profile
export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()

    const rows = await query<Record<string, unknown>[]>`
      SELECT dp.*, u.Name, u.Email, u.Phone
      FROM DonorProfiles dp
      JOIN Users u ON u.Id = dp.UserId
      WHERE dp.UserId = ${user.userId}
    `
    if (rows.length === 0) return notFound("Donor profile not found.")
    return ok(rows[0])
  } catch (err) {
    return serverError(err)
  }
}

// PUT /api/donor/profile — create or update
export async function PUT(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()

    const { bloodGroup, isAvailable, city, state, pincode, latitude, longitude } = await req.json()

    const existing = await query<{ Id: string }[]>`
      SELECT Id FROM DonorProfiles WHERE UserId = ${user.userId}
    `

    if (existing.length === 0) {
      // Create
      if (!bloodGroup) return fail("bloodGroup is required.")
      await execute`
        INSERT INTO DonorProfiles (UserId, BloodGroup, IsAvailable, City, State, Pincode, Latitude, Longitude)
        VALUES (${user.userId}, ${bloodGroup}, ${isAvailable ?? 1}, ${city}, ${state}, ${pincode}, ${latitude}, ${longitude})
      `
    } else {
      // Update
      await execute`
        UPDATE DonorProfiles SET
          BloodGroup  = COALESCE(${bloodGroup}, BloodGroup),
          IsAvailable = COALESCE(${isAvailable}, IsAvailable),
          City        = COALESCE(${city},        City),
          State       = COALESCE(${state},       State),
          Pincode     = COALESCE(${pincode},     Pincode),
          Latitude    = COALESCE(${latitude},    Latitude),
          Longitude   = COALESCE(${longitude},   Longitude),
          UpdatedAt   = GETDATE()
        WHERE UserId = ${user.userId}
      `
    }

    return ok({ updated: true })
  } catch (err) {
    return serverError(err)
  }
}
