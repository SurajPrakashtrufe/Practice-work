import { NextRequest } from "next/server"
import { query, execute } from "@/lib/db"
import { getAuthUser } from "@/lib/auth"
import { ok, fail, unauthorized, notFound, serverError } from "@/lib/api"

// GET /api/hospital/profile
export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()

    const rows = await query<Record<string, unknown>[]>`
      SELECT hp.*, u.Email, u.Phone AS UserPhone
      FROM HospitalProfiles hp
      JOIN Users u ON u.Id = hp.UserId
      WHERE hp.UserId = ${user.userId}
    `
    if (rows.length === 0) return notFound("Hospital profile not found.")
    return ok(rows[0])
  } catch (err) {
    return serverError(err)
  }
}

// PUT /api/hospital/profile
export async function PUT(req: NextRequest) {
  try {
    const user = getAuthUser(req)
    if (!user) return unauthorized()

    const {
      hospitalName, hospitalType, licenseNumber, address, city, state, pincode,
      latitude, longitude, phone, emergencyContact, website,
      hasBloodBank, isNabh, totalBeds, managerName, managerPhone, managerEmail,
    } = await req.json()

    const existing = await query<{ Id: string }[]>`
      SELECT Id FROM HospitalProfiles WHERE UserId = ${user.userId}
    `

    if (existing.length === 0) {
      if (!hospitalName) return fail("hospitalName is required.")
      await execute`
        INSERT INTO HospitalProfiles (
          UserId, HospitalName, HospitalType, LicenseNumber, Address, City, State, Pincode,
          Latitude, Longitude, Phone, EmergencyContact, Website,
          HasBloodBank, IsNabh, TotalBeds, ManagerName, ManagerPhone, ManagerEmail
        ) VALUES (
          ${user.userId}, ${hospitalName}, ${hospitalType}, ${licenseNumber}, ${address}, ${city}, ${state}, ${pincode},
          ${latitude}, ${longitude}, ${phone}, ${emergencyContact}, ${website},
          ${hasBloodBank ?? 0}, ${isNabh ?? 0}, ${totalBeds}, ${managerName}, ${managerPhone}, ${managerEmail}
        )
      `
    } else {
      await execute`
        UPDATE HospitalProfiles SET
          HospitalName     = COALESCE(${hospitalName},     HospitalName),
          HospitalType     = COALESCE(${hospitalType},     HospitalType),
          Address          = COALESCE(${address},          Address),
          City             = COALESCE(${city},             City),
          State            = COALESCE(${state},            State),
          Pincode          = COALESCE(${pincode},          Pincode),
          Latitude         = COALESCE(${latitude},         Latitude),
          Longitude        = COALESCE(${longitude},        Longitude),
          Phone            = COALESCE(${phone},            Phone),
          EmergencyContact = COALESCE(${emergencyContact}, EmergencyContact),
          Website          = COALESCE(${website},          Website),
          HasBloodBank     = COALESCE(${hasBloodBank},     HasBloodBank),
          IsNabh           = COALESCE(${isNabh},           IsNabh),
          TotalBeds        = COALESCE(${totalBeds},        TotalBeds),
          ManagerName      = COALESCE(${managerName},      ManagerName),
          ManagerPhone     = COALESCE(${managerPhone},     ManagerPhone),
          ManagerEmail     = COALESCE(${managerEmail},     ManagerEmail),
          UpdatedAt        = GETDATE()
        WHERE UserId = ${user.userId}
      `
    }

    return ok({ updated: true })
  } catch (err) {
    return serverError(err)
  }
}
