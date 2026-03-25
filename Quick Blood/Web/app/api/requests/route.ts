import { NextRequest } from "next/server"
import { query, execute } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { ok, fail, unauthorized, serverError } from "@/lib/api"

// GET /api/requests?status=Open&bloodGroup=B+&city=Mumbai&lat=19.07&lng=72.87&radius=10
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status     = searchParams.get("status")     ?? "Open"
    const bloodGroup = searchParams.get("bloodGroup")
    const city       = searchParams.get("city")

    let sql = `
      SELECT
        br.Id, br.SourceType, br.PatientName, br.BloodGroup, br.UnitsRequired,
        br.Urgency, br.Status, br.HospitalName, br.Area, br.City,
        br.Latitude, br.Longitude, br.CrossmatchRequired, br.CreatedAt,
        (
          SELECT COUNT(*) FROM RequestResponses rr
          WHERE rr.RequestId = br.Id AND rr.Status IN ('Responded','Confirmed')
        ) AS ResponderCount
      FROM BloodRequests br
      WHERE br.Status = '${status}'
    `
    if (bloodGroup) sql += ` AND br.BloodGroup = '${bloodGroup}'`
    if (city)       sql += ` AND br.City = '${city}'`
    sql += ` ORDER BY br.CreatedAt DESC`

    const pool    = (await import("@/lib/db")).getRequest
    const request = await pool()
    const result  = await request.query(sql)

    return ok(result.recordset)
  } catch (err) {
    return serverError(err)
  }
}

// POST /api/requests — create a new blood request
export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()

    const {
      patientName, patientAge, bloodGroup, unitsRequired, urgency,
      hospitalId, hospitalName, area, city, latitude, longitude,
      doctorName, ward, bedNumber, crossmatchRequired, clinicalNotes, scheduledDate,
    } = await req.json()

    if (!patientName || !bloodGroup || !unitsRequired || !urgency) {
      return fail("patientName, bloodGroup, unitsRequired and urgency are required.")
    }

    const sourceType = user.role === "Hospital" ? "Hospital" : "Patient"

    await execute`
      INSERT INTO BloodRequests (
        CreatedByUserId, SourceType, PatientName, PatientAge, BloodGroup,
        UnitsRequired, Urgency, HospitalId, HospitalName, Area, City,
        Latitude, Longitude, DoctorName, Ward, BedNumber,
        CrossmatchRequired, ClinicalNotes, ScheduledDate
      ) VALUES (
        ${user.userId}, ${sourceType}, ${patientName}, ${patientAge}, ${bloodGroup},
        ${unitsRequired}, ${urgency}, ${hospitalId}, ${hospitalName}, ${area}, ${city},
        ${latitude}, ${longitude}, ${doctorName}, ${ward}, ${bedNumber},
        ${crossmatchRequired ?? 0}, ${clinicalNotes}, ${scheduledDate}
      )
    `

    return ok({ created: true }, 201)
  } catch (err) {
    return serverError(err)
  }
}
