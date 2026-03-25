import { NextRequest } from "next/server"
import { query } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { ok, unauthorized, serverError } from "@/lib/api"

// GET /api/donor/donations — all donations for the logged-in donor
export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()

    const rows = await query<Record<string, unknown>[]>`
      SELECT
        d.Id, d.UnitsDonated, d.DonationDate, d.Notes,
        br.BloodGroup, br.PatientName, br.Urgency,
        hp.HospitalName,
        dr.Stars AS RatingStars
      FROM Donations d
      JOIN BloodRequests  br ON br.Id = d.RequestId
      LEFT JOIN HospitalProfiles hp ON hp.Id = d.HospitalId
      LEFT JOIN DonorRatings dr ON dr.DonationId = d.Id
      WHERE d.DonorId = (SELECT Id FROM DonorProfiles WHERE UserId = ${user.userId})
      ORDER BY d.DonationDate DESC
    `
    return ok(rows)
  } catch (err) {
    return serverError(err)
  }
}
