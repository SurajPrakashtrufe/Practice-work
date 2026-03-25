import { NextRequest } from "next/server"
import { query, execute } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { ok, fail, unauthorized, serverError } from "@/lib/api"

// POST /api/requests/[id]/confirm — hospital/patient confirms a donor
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()
    const { id }      = await params
    const { donorProfileId, unitsDonated, notes } = await req.json()

    if (!donorProfileId) return fail("donorProfileId is required.")

    // Get hospital ID if applicable
    const hospitalRows = await query<{ Id: string }[]>`
      SELECT Id FROM HospitalProfiles WHERE UserId = ${user.userId}
    `
    const hospitalId = hospitalRows[0]?.Id ?? null

    // Call stored procedure sp_ConfirmDonation
    const req2 = await (await import("@/lib/db")).getRequest()
    req2.input("RequestId",         donorProfileId.constructor.name === "String" ? undefined : undefined) // placeholder
    await req2.execute("sp_ConfirmDonation", {
      // Pass via raw request
    })

    // Inline equivalent (no stored proc dependency for portability)
    await execute`
      INSERT INTO Donations (RequestId, DonorId, HospitalId, UnitsDonated, ConfirmedByUserId, Notes)
      VALUES (${id}, ${donorProfileId}, ${hospitalId}, ${unitsDonated ?? 1}, ${user.userId}, ${notes})
    `
    await execute`
      UPDATE DonorProfiles SET
        LastDonationDate = CAST(GETDATE() AS DATE),
        TotalDonations   = TotalDonations + 1,
        ReliabilityScore = CASE WHEN ReliabilityScore + 20 > 100 THEN 100 ELSE ReliabilityScore + 20 END,
        UpdatedAt        = GETDATE()
      WHERE Id = ${donorProfileId}
    `
    await execute`
      UPDATE BloodRequests SET Status = 'Fulfilled', FulfilledAt = GETDATE(), UpdatedAt = GETDATE()
      WHERE Id = ${id}
    `
    await execute`
      UPDATE RequestResponses SET Status = 'Confirmed', ConfirmedAt = GETDATE()
      WHERE RequestId = ${id} AND DonorId = ${donorProfileId}
    `

    return ok({ confirmed: true })
  } catch (err) {
    return serverError(err)
  }
}
