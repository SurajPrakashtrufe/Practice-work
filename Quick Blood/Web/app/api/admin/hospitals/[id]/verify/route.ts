import { NextRequest } from "next/server"
import { execute } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { ok, fail, unauthorized, serverError } from "@/lib/api"

// POST /api/admin/hospitals/[id]/verify
// Body: { action: "approve" | "reject", reason?: string }
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()
    if (user.role !== "Admin") return fail("Admin only.", 403)

    const { id }              = await params
    const { action, reason }  = await req.json()

    if (!["approve", "reject"].includes(action)) return fail("action must be approve or reject.")
    if (action === "reject" && !reason?.trim())   return fail("reason is required when rejecting.")

    if (action === "approve") {
      await execute`
        UPDATE HospitalProfiles
        SET IsVerified = 1, VerifiedAt = GETDATE(), VerifiedByAdminId = ${user.userId}
        WHERE Id = ${id}
      `
      await execute`
        INSERT INTO AdminActionLog (AdminId, ActionType, TargetEntityType, TargetEntityId)
        VALUES (${user.userId}, 'ApproveHospital', 'Hospital', ${id})
      `
    } else {
      await execute`
        INSERT INTO AdminActionLog (AdminId, ActionType, TargetEntityType, TargetEntityId, Notes)
        VALUES (${user.userId}, 'RejectHospital', 'Hospital', ${id}, ${reason})
      `
    }

    return ok({ action, done: true })
  } catch (err) {
    return serverError(err)
  }
}
