import { NextRequest } from "next/server"
import { query, execute } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { ok, fail, unauthorized, serverError } from "@/lib/api"

// GET /api/hospital/inventory
export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()

    const rows = await query<Record<string, unknown>[]>`
      SELECT hi.BloodGroup, hi.UnitsAvailable, hi.UpdatedAt,
        CASE
          WHEN hi.UnitsAvailable = 0 THEN 'Out'
          WHEN hi.UnitsAvailable <= 1 THEN 'Critical'
          WHEN hi.UnitsAvailable <= 3 THEN 'Low'
          ELSE 'OK'
        END AS StockStatus
      FROM HospitalInventory hi
      JOIN HospitalProfiles hp ON hp.Id = hi.HospitalId
      WHERE hp.UserId = ${user.userId}
      ORDER BY hi.BloodGroup
    `
    return ok(rows)
  } catch (err) {
    return serverError(err)
  }
}

// PUT /api/hospital/inventory — save full inventory snapshot
// Body: { inventory: { "O+": 5, "B+": 2, ... } }
export async function PUT(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()

    const { inventory } = await req.json() as { inventory: Record<string, number> }
    if (!inventory) return fail("inventory object is required.")

    const hospitalRows = await query<{ Id: string }[]>`
      SELECT Id FROM HospitalProfiles WHERE UserId = ${user.userId}
    `
    if (hospitalRows.length === 0) return fail("Hospital profile not found.", 404)
    const hospitalId = hospitalRows[0].Id

    for (const [group, units] of Object.entries(inventory)) {
      // Get previous value for audit log
      const prev = await query<{ UnitsAvailable: number }[]>`
        SELECT UnitsAvailable FROM HospitalInventory
        WHERE HospitalId = ${hospitalId} AND BloodGroup = ${group}
      `
      const prevUnits = prev[0]?.UnitsAvailable ?? 0

      // Upsert
      await execute`
        MERGE HospitalInventory AS target
        USING (SELECT ${hospitalId} AS HId, ${group} AS BG, ${units} AS Units) AS src
          ON target.HospitalId = src.HId AND target.BloodGroup = src.BG
        WHEN MATCHED THEN
          UPDATE SET UnitsAvailable = src.Units, UpdatedAt = GETDATE(), UpdatedByUserId = ${user.userId}
        WHEN NOT MATCHED THEN
          INSERT (HospitalId, BloodGroup, UnitsAvailable, UpdatedByUserId)
          VALUES (src.HId, src.BG, src.Units, ${user.userId});
      `

      // Log the change
      if (prevUnits !== units) {
        await execute`
          INSERT INTO InventoryChangeLog (HospitalId, BloodGroup, PreviousUnits, NewUnits, Reason, ChangedByUserId)
          VALUES (${hospitalId}, ${group}, ${prevUnits}, ${units}, 'Manual update', ${user.userId})
        `
      }
    }

    return ok({ saved: true })
  } catch (err) {
    return serverError(err)
  }
}
