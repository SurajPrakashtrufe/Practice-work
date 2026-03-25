import { NextRequest } from "next/server"
import { execute } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { ok, unauthorized, serverError } from "@/lib/api"

// PATCH /api/notifications/read
// Body: { ids: ["uuid1","uuid2"] } — or omit ids to mark ALL as read
export async function PATCH(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()

    const { ids } = await req.json().catch(() => ({ ids: null }))

    if (ids && Array.isArray(ids) && ids.length > 0) {
      // Mark specific notifications read (one-by-one to avoid dynamic IN clause)
      for (const id of ids) {
        await execute`
          UPDATE Notifications SET IsRead = 1, ReadAt = GETDATE()
          WHERE Id = ${id} AND UserId = ${user.userId}
        `
      }
    } else {
      await execute`
        UPDATE Notifications SET IsRead = 1, ReadAt = GETDATE()
        WHERE UserId = ${user.userId} AND IsRead = 0
      `
    }

    return ok({ marked: true })
  } catch (err) {
    return serverError(err)
  }
}
