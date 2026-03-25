import { NextRequest } from "next/server"
import { query, execute } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { ok, fail, unauthorized, serverError } from "@/lib/api"

// GET /api/chat/[id]/messages
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()
    const { id } = await params

    const rows = await query<Record<string, unknown>[]>`
      SELECT cm.Id, cm.Body, cm.IsRead, cm.ReadAt, cm.CreatedAt,
        cm.SenderId, u.Name AS SenderName
      FROM ChatMessages cm
      JOIN Users u ON u.Id = cm.SenderId
      WHERE cm.ConversationId = ${id}
      ORDER BY cm.CreatedAt ASC
    `

    // Mark messages from the other person as read
    await execute`
      UPDATE ChatMessages SET IsRead = 1, ReadAt = GETDATE()
      WHERE ConversationId = ${id} AND SenderId != ${user.userId} AND IsRead = 0
    `

    return ok(rows)
  } catch (err) {
    return serverError(err)
  }
}

// POST /api/chat/[id]/messages — send a message
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()
    const { id }   = await params
    const { body } = await req.json()
    if (!body?.trim()) return fail("body is required.")

    await execute`
      INSERT INTO ChatMessages (ConversationId, SenderId, Body) VALUES (${id}, ${user.userId}, ${body})
    `
    await execute`
      UPDATE ChatConversations SET LastMessageAt = GETDATE() WHERE Id = ${id}
    `

    return ok({ sent: true }, 201)
  } catch (err) {
    return serverError(err)
  }
}
