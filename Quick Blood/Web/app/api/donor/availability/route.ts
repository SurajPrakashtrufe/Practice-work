import { NextRequest } from "next/server"
import { execute } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { ok, unauthorized, serverError } from "@/lib/api"

// PATCH /api/donor/availability
export async function PATCH(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()

    const { isAvailable } = await req.json()
    const flag = isAvailable ? 1 : 0

    await execute`
      UPDATE DonorProfiles SET IsAvailable = ${flag}, UpdatedAt = GETDATE()
      WHERE UserId = ${user.userId}
    `

    // Log availability change
    await execute`
      INSERT INTO DonorAvailabilityLog (DonorId, IsAvailable)
      SELECT Id, ${flag} FROM DonorProfiles WHERE UserId = ${user.userId}
    `

    return ok({ isAvailable: !!isAvailable })
  } catch (err) {
    return serverError(err)
  }
}
