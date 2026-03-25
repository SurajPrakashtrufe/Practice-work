import { NextRequest } from "next/server"
import { query } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { ok, unauthorized, fail, serverError } from "@/lib/api"

// GET /api/admin/hospitals?status=pending
export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()
    if (user.role !== "Admin") return fail("Admin only.", 403)

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status") // "pending" | "verified" | null (all)

    const rows = await query<Record<string, unknown>[]>`
      SELECT
        hp.Id, hp.HospitalName, hp.HospitalType, hp.City, hp.LicenseNumber,
        hp.IsNabh, hp.HasBloodBank, hp.TotalBeds, hp.IsVerified, hp.VerifiedAt,
        hp.ManagerName, hp.ManagerEmail, hp.ManagerPhone,
        hp.CreatedAt, u.Email
      FROM HospitalProfiles hp
      JOIN Users u ON u.Id = hp.UserId
      WHERE (${status} IS NULL OR hp.IsVerified = CASE WHEN ${status} = 'verified' THEN 1 ELSE 0 END)
      ORDER BY hp.CreatedAt DESC
    `
    return ok(rows)
  } catch (err) {
    return serverError(err)
  }
}
