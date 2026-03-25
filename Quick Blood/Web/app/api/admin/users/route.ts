import { NextRequest } from "next/server"
import { query } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { ok, fail, unauthorized, serverError } from "@/lib/api"

// GET /api/admin/users?role=Donor&search=arjun
export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()
    if (user.role !== "Admin") return fail("Admin only.", 403)

    const { searchParams } = new URL(req.url)
    const role   = searchParams.get("role")
    const search = searchParams.get("search")

    let sql = `
      SELECT u.Id, u.Name, u.Email, u.Phone, u.Role, u.IsActive,
             u.IsEmailVerified, u.IsPhoneVerified, u.CreatedAt
      FROM Users u
      WHERE 1=1
    `
    if (role)   sql += ` AND u.Role = '${role}'`
    if (search) sql += ` AND (u.Name LIKE '%${search}%' OR u.Email LIKE '%${search}%')`
    sql += ` ORDER BY u.CreatedAt DESC`

    const request = await (await import("@/lib/db")).getRequest()
    const result  = await request.query(sql)

    return ok(result.recordset)
  } catch (err) {
    return serverError(err)
  }
}
