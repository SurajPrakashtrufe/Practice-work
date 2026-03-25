import { NextRequest } from "next/server"
import { query, execute } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { ok, fail, unauthorized, notFound, serverError } from "@/lib/api"

// GET /api/requests/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const rows = await query<Record<string, unknown>[]>`
      SELECT
        br.*,
        hp.HospitalName AS VerifiedHospitalName,
        hp.IsVerified   AS HospitalVerified,
        (
          SELECT COUNT(*) FROM RequestResponses rr
          WHERE rr.RequestId = br.Id AND rr.Status IN ('Responded','Confirmed')
        ) AS ResponderCount
      FROM BloodRequests br
      LEFT JOIN HospitalProfiles hp ON hp.Id = br.HospitalId
      WHERE br.Id = ${id}
    `
    if (rows.length === 0) return notFound()
    return ok(rows[0])
  } catch (err) {
    return serverError(err)
  }
}

// PATCH /api/requests/[id] — update status or cancel
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()
    const { id }     = await params
    const { status, cancelReason } = await req.json()

    const valid = ["Open","Matched","Fulfilled","Cancelled"]
    if (status && !valid.includes(status)) return fail("Invalid status.")

    if (status === "Cancelled") {
      await execute`
        UPDATE BloodRequests SET
          Status       = 'Cancelled',
          CancelReason = ${cancelReason},
          CancelledAt  = GETDATE(),
          UpdatedAt    = GETDATE()
        WHERE Id = ${id} AND CreatedByUserId = ${user.userId}
      `
    } else if (status === "Fulfilled") {
      await execute`
        UPDATE BloodRequests SET Status = 'Fulfilled', FulfilledAt = GETDATE(), UpdatedAt = GETDATE()
        WHERE Id = ${id}
      `
    } else {
      await execute`
        UPDATE BloodRequests SET Status = ${status}, UpdatedAt = GETDATE() WHERE Id = ${id}
      `
    }

    return ok({ updated: true })
  } catch (err) {
    return serverError(err)
  }
}
