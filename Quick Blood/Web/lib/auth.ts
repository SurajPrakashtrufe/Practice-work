import { NextRequest } from "next/server"
import { query } from "./db"
import crypto from "crypto"

export interface JWTPayload {
  userId:    string
  role:      string
  email:     string
  iat:       number
  exp:       number
}

const SECRET = process.env.JWT_SECRET ?? "change_me_32_chars_minimum_secret"
const EXPIRES_IN_SECONDS = 7 * 24 * 60 * 60  // 7 days

// ── Minimal JWT (HMAC-SHA256, no external library) ───────────────────────────

function base64url(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input) : input
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

export function signToken(payload: Omit<JWTPayload, "iat" | "exp">): string {
  const now = Math.floor(Date.now() / 1000)
  const full = { ...payload, iat: now, exp: now + EXPIRES_IN_SECONDS }
  const header    = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const body      = base64url(JSON.stringify(full))
  const signature = base64url(
    crypto.createHmac("sha256", SECRET).update(`${header}.${body}`).digest()
  )
  return `${header}.${body}.${signature}`
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const [header, body, signature] = token.split(".")
    const expected = base64url(
      crypto.createHmac("sha256", SECRET).update(`${header}.${body}`).digest()
    )
    if (expected !== signature) return null
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as JWTPayload
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

// ── Extract + validate Bearer token from request ─────────────────────────────

export function getAuthUser(req: NextRequest): JWTPayload | null {
  const auth = req.headers.get("authorization") ?? ""
  if (!auth.startsWith("Bearer ")) return null
  return verifyToken(auth.slice(7))
}

// ── Password hashing (SHA-256 + salt, no bcrypt dep) ─────────────────────────
// For production, swap to bcrypt or Argon2.

export function hashPassword(plain: string, salt?: string): { hash: string; salt: string } {
  const s = salt ?? crypto.randomBytes(16).toString("hex")
  const hash = crypto.createHmac("sha256", s).update(plain).digest("hex")
  return { hash, salt: s }
}

export function verifyPassword(plain: string, storedHash: string, salt: string): boolean {
  const { hash } = hashPassword(plain, salt)
  return hash === storedHash
}

// ── Check user exists in DB and return basic info ────────────────────────────

export async function getUserById(id: string) {
  const rows = await query<{ Id: string; Name: string; Email: string; Role: string; IsActive: boolean }[]>`
    SELECT Id, Name, Email, Role, IsActive FROM Users WHERE Id = ${id}
  `
  return rows[0] ?? null
}
