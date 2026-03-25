import { NextRequest } from "next/server"
import { query, execute } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { ok, fail, unauthorized, serverError } from "@/lib/api"

// GET /api/chat — list all conversations for the logged-in user
export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()

    const rows = await query<Record<string, unknown>[]>`
      SELECT
        cc.Id, cc.RequestId, cc.LastMessageAt,
        ua.Name AS ParticipantAName, ub.Name AS ParticipantBName,
        (
          SELECT TOP 1 Body FROM ChatMessages
          WHERE ConversationId = cc.Id ORDER BY CreatedAt DESC
        ) AS LastMessage,
        (
          SELECT COUNT(*) FROM ChatMessages
          WHERE ConversationId = cc.Id AND SenderId != ${user.userId} AND IsRead = 0
        ) AS UnreadCount
      FROM ChatConversations cc
      JOIN Users ua ON ua.Id = cc.ParticipantAId
      JOIN Users ub ON ub.Id = cc.ParticipantBId
      WHERE cc.ParticipantAId = ${user.userId} OR cc.ParticipantBId = ${user.userId}
      ORDER BY cc.LastMessageAt DESC
    `
    return ok(rows)
  } catch (err) {
    return serverError(err)
  }
}

// POST /api/chat — start a new conversation
export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()

    const { otherUserId, requestId } = await req.json()
    if (!otherUserId) return fail("otherUserId is required.")

    // Check if conversation already exists
    const existing = await query<{ Id: string }[]>`
      SELECT Id FROM ChatConversations
      WHERE RequestId = ${requestId}
        AND (
          (ParticipantAId = ${user.userId} AND ParticipantBId = ${otherUserId}) OR
          (ParticipantAId = ${otherUserId} AND ParticipantBId = ${user.userId})
        )
    `
    if (existing.length > 0) return ok({ conversationId: existing[0].Id })

    await execute`
      INSERT INTO ChatConversations (RequestId, ParticipantAId, ParticipantBId)
      VALUES (${requestId}, ${user.userId}, ${otherUserId})
    `
    const created = await query<{ Id: string }[]>`
      SELECT TOP 1 Id FROM ChatConversations
      WHERE ParticipantAId = ${user.userId} AND ParticipantBId = ${otherUserId}
      ORDER BY CreatedAt DESC
    `
    return ok({ conversationId: created[0].Id }, 201)
  } catch (err) {
    return serverError(err)
  }
}
