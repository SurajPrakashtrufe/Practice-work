import { NextRequest } from "next/server"
import { query, execute } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { ok, fail, unauthorized, serverError } from "@/lib/api"

// GET /api/requests/[id]/responses — list all donor responses for a request
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const rows = await query<Record<string, unknown>[]>`
      SELECT
        rr.Id, rr.Status, rr.RespondedAt, rr.ConfirmedAt,
        dp.Id AS DonorProfileId, u.Name AS DonorName,
        dp.BloodGroup, dp.ReliabilityScore, dp.LastDonationDate,
        dp.Latitude, dp.Longitude,
        CASE
          WHEN dp.LastDonationDate IS NULL THEN 0
          WHEN DATEDIFF(DAY, dp.LastDonationDate, GETDATE()) < 90 THEN 1
          ELSE 0
        END AS IsInCooldown
      FROM RequestResponses rr
      JOIN DonorProfiles dp ON dp.Id = rr.DonorId
      JOIN Users u ON u.Id = dp.UserId
      WHERE rr.RequestId = ${id}
      ORDER BY dp.ReliabilityScore DESC
    `
    return ok(rows)
  } catch (err) {
    return serverError(err)
  }
}

// POST /api/requests/[id]/responses — donor responds to a request
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()
    const { id } = await params

    const donorRows = await query<{ Id: string }[]>`
      SELECT Id FROM DonorProfiles WHERE UserId = ${user.userId}
    `
    if (donorRows.length === 0) return fail("Donor profile not found.", 404)
    const donorId = donorRows[0].Id

    // Upsert response
    const existing = await query<{ Id: string }[]>`
      SELECT Id FROM RequestResponses WHERE RequestId = ${id} AND DonorId = ${donorId}
    `
    if (existing.length > 0) {
      await execute`
        UPDATE RequestResponses
        SET Status = 'Responded', RespondedAt = GETDATE()
        WHERE RequestId = ${id} AND DonorId = ${donorId}
      `
    } else {
      await execute`
        INSERT INTO RequestResponses (RequestId, DonorId, Status, RespondedAt)
        VALUES (${id}, ${donorId}, 'Responded', GETDATE())
      `
    }

    // Update request status to Matched
    await execute`
      UPDATE BloodRequests SET Status = 'Matched', UpdatedAt = GETDATE()
      WHERE Id = ${id} AND Status = 'Open'
    `

    return ok({ responded: true })
  } catch (err) {
    return serverError(err)
  }
}
