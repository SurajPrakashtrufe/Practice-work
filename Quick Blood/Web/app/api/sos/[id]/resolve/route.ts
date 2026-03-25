import { NextRequest } from "next/server"
import { execute } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { ok, unauthorized, serverError } from "@/lib/api"

// PATCH /api/sos/[id]/resolve
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()
    const { id } = await params

    await execute`
      UPDATE SosAlerts SET Status = 'Resolved', ResolvedAt = GETDATE()
      WHERE Id = ${id} AND CreatedByUserId = ${user.userId}
    `
    return ok({ resolved: true })
  } catch (err) {
    return serverError(err)
  }
}
