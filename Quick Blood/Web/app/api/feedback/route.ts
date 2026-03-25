import { NextRequest } from "next/server"
import { execute } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { ok, fail, unauthorized, serverError } from "@/lib/api"

// POST /api/feedback — submit donor rating
export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()

    const { donationId, donorProfileId, stars, tags, comment } = await req.json()
    if (!donationId || !donorProfileId || !stars) {
      return fail("donationId, donorProfileId and stars are required.")
    }
    if (stars < 1 || stars > 5) return fail("stars must be between 1 and 5.")

    await execute`
      INSERT INTO DonorRatings (DonationId, RatedByUserId, DonorId, Stars, Tags, Comment)
      VALUES (${donationId}, ${user.userId}, ${donorProfileId}, ${stars}, ${JSON.stringify(tags ?? [])}, ${comment})
    `

    return ok({ submitted: true }, 201)
  } catch (err) {
    return serverError(err)
  }
}
