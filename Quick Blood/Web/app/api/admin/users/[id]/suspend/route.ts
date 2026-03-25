import { NextRequest } from "next/server"
import { execute } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { ok, fail, unauthorized, serverError } from "@/lib/api"

// POST /api/admin/users/[id]/suspend
// Body: { reason: string }
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = getAuthUser(req)
    if (!admin) return unauthorized()
    if (admin.role !== "Admin") return fail("Admin only.", 403)

    const { id }    = await params
    const { reason } = await req.json()
    if (!reason?.trim()) return fail("reason is required.")

    await execute`UPDATE Users SET IsActive = 0 WHERE Id = ${id}`
    await execute`
      INSERT INTO UserSuspensions (UserId, SuspendedByAdminId, Reason)
      VALUES (${id}, ${admin.userId}, ${reason})
    `
    await execute`
      INSERT INTO AdminActionLog (AdminId, ActionType, TargetEntityType, TargetEntityId, Notes)
      VALUES (${admin.userId}, 'SuspendUser', 'User', ${id}, ${reason})
    `
    return ok({ suspended: true })
  } catch (err) {
    return serverError(err)
  }
}

// DELETE /api/admin/users/[id]/suspend — reinstate user
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = getAuthUser(req)
    if (!admin) return unauthorized()
    if (admin.role !== "Admin") return fail("Admin only.", 403)

    const { id } = await params

    await execute`UPDATE Users SET IsActive = 1 WHERE Id = ${id}`
    await execute`
      UPDATE UserSuspensions SET LiftedAt = GETDATE(), LiftedByAdminId = ${admin.userId}
      WHERE UserId = ${id} AND LiftedAt IS NULL
    `
    return ok({ reinstated: true })
  } catch (err) {
    return serverError(err)
  }
}
