import { NextRequest } from "next/server"
import { query, execute } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { ok, unauthorized, serverError } from "@/lib/api"

// GET /api/notifications?unread=true
export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()

    const { searchParams } = new URL(req.url)
    const unreadOnly = searchParams.get("unread") === "true"

    const rows = await query<Record<string, unknown>[]>`
      SELECT Id, Type, Title, Message, LinkUrl, RefId, IsRead, CreatedAt
      FROM Notifications
      WHERE UserId = ${user.userId}
        ${unreadOnly ? "AND IsRead = 0" : ""}
      ORDER BY CreatedAt DESC
    `
    return ok(rows)
  } catch (err) {
    return serverError(err)
  }
}
