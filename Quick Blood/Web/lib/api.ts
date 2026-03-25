import { NextResponse } from "next/server"

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status })
}

export function notFound(message = "Not found") {
  return fail(message, 404)
}

export function unauthorized(message = "Unauthorized") {
  return fail(message, 401)
}

export function serverError(err: unknown) {
  console.error(err)
  return fail("Internal server error", 500)
}
