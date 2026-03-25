import { NextRequest } from "next/server"
import { query } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { ok, fail, unauthorized, serverError } from "@/lib/api"

// GET /api/admin/stats
export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()
    if (user.role !== "Admin") return fail("Admin only.", 403)

    const [users, requests, donations, pending] = await Promise.all([
      query<{ total: number; donors: number; patients: number; hospitals: number }[]>`
        SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN Role = 'Donor'    THEN 1 ELSE 0 END) AS donors,
          SUM(CASE WHEN Role = 'Patient'  THEN 1 ELSE 0 END) AS patients,
          SUM(CASE WHEN Role = 'Hospital' THEN 1 ELSE 0 END) AS hospitals
        FROM Users WHERE IsActive = 1
      `,
      query<{ open: number; fulfilled: number }[]>`
        SELECT
          SUM(CASE WHEN Status IN ('Open','Matched') THEN 1 ELSE 0 END) AS open,
          SUM(CASE WHEN Status = 'Fulfilled'         THEN 1 ELSE 0 END) AS fulfilled
        FROM BloodRequests
      `,
      query<{ total: number }[]>`SELECT COUNT(*) AS total FROM Donations`,
      query<{ count: number }[]>`SELECT COUNT(*) AS count FROM HospitalProfiles WHERE IsVerified = 0`,
    ])

    return ok({
      users:              users[0],
      requests:           requests[0],
      totalDonations:     donations[0].total,
      pendingVerifications: pending[0].count,
    })
  } catch (err) {
    return serverError(err)
  }
}
