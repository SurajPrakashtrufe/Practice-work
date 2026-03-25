import { NextRequest } from "next/server"
import { getRequest } from "@/lib/db"
import { ok, fail, serverError } from "@/lib/api"

// GET /api/donors/nearby?bloodGroup=B+&lat=19.07&lng=72.87&radius=10
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const bloodGroup = searchParams.get("bloodGroup")
    const lat        = parseFloat(searchParams.get("lat")    ?? "0")
    const lng        = parseFloat(searchParams.get("lng")    ?? "0")
    const radius     = parseFloat(searchParams.get("radius") ?? "10")

    if (!bloodGroup) return fail("bloodGroup is required.")

    const request = await getRequest()
    request.input("BloodGroup", bloodGroup)
    request.input("Latitude",   lat)
    request.input("Longitude",  lng)
    request.input("RadiusKm",   radius)

    const result = await request.execute("sp_FindCompatibleDonors")
    return ok(result.recordset)
  } catch (err) {
    return serverError(err)
  }
}
