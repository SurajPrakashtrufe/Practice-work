import { NextRequest } from "next/server"
import { query, execute } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { ok, fail, unauthorized, serverError } from "@/lib/api"

// GET /api/sos — list active SOS alerts near a location
// Query: ?lat=19.07&lng=72.87&radius=25
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const lat    = parseFloat(searchParams.get("lat")    ?? "0")
    const lng    = parseFloat(searchParams.get("lng")    ?? "0")
    const radius = parseFloat(searchParams.get("radius") ?? "25")

    const rows = await query<Record<string, unknown>[]>`
      SELECT
        s.Id, s.BloodGroup, s.UnitsRequired, s.PatientName,
        s.HospitalName, s.Latitude, s.Longitude, s.RadiusKm,
        s.Status, s.CreatedAt, s.ExpiresAt,
        u.Name AS PostedBy,
        ROUND(
          6371 * 2 * ASIN(SQRT(
            POWER(SIN(RADIANS(s.Latitude  - ${lat})  / 2), 2) +
            COS(RADIANS(${lat})) * COS(RADIANS(s.Latitude)) *
            POWER(SIN(RADIANS(s.Longitude - ${lng}) / 2), 2)
          )), 2
        ) AS DistanceKm
      FROM SosAlerts s
      JOIN Users u ON u.Id = s.CreatedByUserId
      WHERE s.Status = 'Active'
        AND (s.ExpiresAt IS NULL OR s.ExpiresAt > GETDATE())
      ORDER BY DistanceKm ASC
    `
    return ok(rows)
  } catch (err) {
    return serverError(err)
  }
}

// POST /api/sos — broadcast a new SOS
export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()

    const { bloodGroup, unitsRequired, patientName, contactPhone, hospitalName, latitude, longitude } = await req.json()
    if (!bloodGroup) return fail("bloodGroup is required.")

    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours

    await execute`
      INSERT INTO SosAlerts (CreatedByUserId, BloodGroup, UnitsRequired, PatientName, ContactPhone, HospitalName, Latitude, Longitude, ExpiresAt)
      VALUES (${user.userId}, ${bloodGroup}, ${unitsRequired ?? 1}, ${patientName}, ${contactPhone}, ${hospitalName}, ${latitude}, ${longitude}, ${expiresAt})
    `

    return ok({ broadcasting: true }, 201)
  } catch (err) {
    return serverError(err)
  }
}
