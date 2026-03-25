# Quick Blood — API Report

All routes live under `/app/api/` and follow Next.js 16 App Router conventions.
Every protected route requires an `Authorization: Bearer <token>` header.
All responses follow the shape `{ success: true, data: ... }` or `{ success: false, message: "..." }`.

---

## Infrastructure Files

| File | Purpose |
|---|---|
| `lib/db.ts` | Singleton `mssql` connection pool, tagged-template `query<T>` and `execute` helpers |
| `lib/auth.ts` | HMAC-SHA256 JWT sign/verify, password hash/verify, `getAuthUser(req)` |
| `lib/api.ts` | `ok()`, `fail()`, `notFound()`, `unauthorized()`, `serverError()` response helpers |
| `.env.local` | `DB_SERVER`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL` |

---

## Auth APIs

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user (Donor/Patient/Hospital). Returns JWT + user object. |
| POST | `/api/auth/login` | Public | Login with email + password. Returns JWT + user object. |
| POST | `/api/auth/verify-otp` | Bearer | Verify email or phone OTP code. |
| POST | `/api/auth/forgot-password` | Public | Request a password reset link (sends email). |
| POST | `/api/auth/reset-password` | Public | Reset password using token from email link. |

### Register body
```json
{ "name": "Arjun Sharma", "email": "arjun@example.com", "phone": "9876543210", "password": "Str0ng!", "role": "Donor" }
```

### Login body
```json
{ "email": "arjun@example.com", "password": "Str0ng!" }
```

---

## Donor APIs

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/donor/profile` | Bearer | Get logged-in donor's full profile |
| PUT | `/api/donor/profile` | Bearer | Create or update donor profile (bloodGroup, city, location, etc.) |
| PATCH | `/api/donor/availability` | Bearer | Toggle availability on/off. Logs change to `DonorAvailabilityLog`. |
| GET | `/api/donor/donations` | Bearer | List all completed donations with rating info |

### PATCH availability body
```json
{ "isAvailable": true }
```

---

## Patient APIs

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/patient/profile` | Bearer | Get logged-in patient's profile |
| PUT | `/api/patient/profile` | Bearer | Create or update patient profile |

> **Note:** Patient requests are created via the shared `/api/requests` endpoint with `sourceType: "Patient"` automatically set by role.

---

## Blood Request APIs

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/requests` | Public | List open requests. Query: `?status=Open&bloodGroup=B%2B&city=Mumbai` |
| POST | `/api/requests` | Bearer | Create a new blood request |
| GET | `/api/requests/[id]` | Public | Get full detail of one request including responder count |
| PATCH | `/api/requests/[id]` | Bearer | Update status (`Matched`, `Fulfilled`, `Cancelled`) |
| GET | `/api/requests/[id]/responses` | Bearer | List all donor responses for a request (sorted by reliability score) |
| POST | `/api/requests/[id]/responses` | Bearer (Donor) | Donor responds to a request — sets status to `Responded`, auto-promotes request to `Matched` |
| POST | `/api/requests/[id]/confirm` | Bearer (Hospital/Patient) | Confirm a donor — inserts Donation, updates donor cooldown, marks request Fulfilled |

### POST /api/requests body
```json
{
  "patientName": "Rahul Mehta", "patientAge": 45, "bloodGroup": "B+",
  "unitsRequired": 2, "urgency": "Urgent",
  "hospitalName": "Apollo Hospital", "area": "Andheri", "city": "Mumbai",
  "latitude": 19.12, "longitude": 72.84,
  "doctorName": "Dr. Anita Sharma", "ward": "ICU", "bedNumber": "12B",
  "crossmatchRequired": true, "clinicalNotes": "Post-operative transfusion."
}
```

---

## Donor Discovery API

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/donors/nearby` | Public | Find compatible available donors by location. Uses `sp_FindCompatibleDonors` stored procedure. |

### Query params
```
?bloodGroup=B+&lat=19.07&lng=72.87&radius=10
```

Returns donors sorted by distance, filtered by blood compatibility and 90-day cooldown.

---

## Hospital APIs

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/hospital/profile` | Bearer | Get hospital profile |
| PUT | `/api/hospital/profile` | Bearer | Create or update hospital profile |
| GET | `/api/hospital/inventory` | Bearer | Get all 8 blood group stock levels with status (OK/Low/Critical/Out) |
| PUT | `/api/hospital/inventory` | Bearer | Save full inventory snapshot. Logs every change to `InventoryChangeLog`. |

### PUT /api/hospital/inventory body
```json
{ "inventory": { "O-": 2, "O+": 8, "A-": 1, "A+": 5, "B-": 0, "B+": 4, "AB-": 3, "AB+": 6 } }
```

---

## SOS APIs

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/sos` | Public | List active SOS alerts near a location. Query: `?lat=19.07&lng=72.87&radius=25` |
| POST | `/api/sos` | Bearer | Broadcast a new SOS alert (auto-expires in 2 hours) |
| PATCH | `/api/sos/[id]/resolve` | Bearer | Mark an SOS as resolved |

### POST /api/sos body
```json
{ "bloodGroup": "AB-", "unitsRequired": 1, "patientName": "Sneha", "contactPhone": "9876543210", "hospitalName": "KEM Hospital", "latitude": 18.99, "longitude": 72.83 }
```

---

## Notification APIs

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/notifications` | Bearer | Get all notifications. Query: `?unread=true` for unread only. |
| PATCH | `/api/notifications/read` | Bearer | Mark notifications as read. Body: `{ "ids": [...] }` or omit to mark all. |

---

## Chat APIs

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/chat` | Bearer | List all conversations with last message and unread count |
| POST | `/api/chat` | Bearer | Start a new conversation. Body: `{ "otherUserId": "...", "requestId": "..." }` |
| GET | `/api/chat/[id]/messages` | Bearer | Load all messages in a conversation. Auto-marks received messages as read. |
| POST | `/api/chat/[id]/messages` | Bearer | Send a message. Body: `{ "body": "I can donate at 3pm." }` |

---

## Feedback API

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/feedback` | Bearer | Submit post-donation donor rating (1–5 stars, tag chips, comment) |

### POST /api/feedback body
```json
{ "donationId": "uuid", "donorProfileId": "uuid", "stars": 5, "tags": ["punctual","cooperative"], "comment": "Very helpful!" }
```

---

## Admin APIs

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/stats` | Bearer (Admin) | Platform-wide stats: total users, open/fulfilled requests, pending verifications |
| GET | `/api/admin/hospitals` | Bearer (Admin) | List hospitals. Query: `?status=pending` or `?status=verified` |
| POST | `/api/admin/hospitals/[id]/verify` | Bearer (Admin) | Approve or reject a hospital. Body: `{ "action": "approve" }` or `{ "action": "reject", "reason": "..." }` |
| GET | `/api/admin/users` | Bearer (Admin) | List all users. Query: `?role=Donor&search=arjun` |
| POST | `/api/admin/users/[id]/suspend` | Bearer (Admin) | Suspend a user. Body: `{ "reason": "..." }` |
| DELETE | `/api/admin/users/[id]/suspend` | Bearer (Admin) | Reinstate a suspended user |

---

## Summary

| Category | Route count |
|---|---|
| Auth | 5 |
| Donor | 4 |
| Blood Requests | 7 |
| Donor Discovery | 1 |
| Hospital | 4 |
| SOS | 3 |
| Notifications | 2 |
| Chat | 4 |
| Feedback | 1 |
| Admin | 6 |
| **Total** | **37** |

---

## How to connect the frontend pages

Replace `localStorage` mock data in each dashboard page with `fetch()` calls:

```ts
// Example: donor availability toggle in donor/page.tsx
async function toggleAvailability() {
  const token = localStorage.getItem("qb_token")
  await fetch("/api/donor/availability", {
    method: "PATCH",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ isAvailable: !available }),
  })
}
```

### Auth token storage
After login/register the API returns `{ data: { token, user } }`.
Store the token:
```ts
localStorage.setItem("qb_token", data.token)
localStorage.setItem("qb_session", JSON.stringify(data.user))
```

### Environment setup
1. Open `SQL Server Management Studio` or `Azure Data Studio`
2. Create database: `CREATE DATABASE QuickBlood`
3. Run `database/schema.sql` against the new database
4. Fill in `.env.local` with your server details
5. Run `npm run dev` — the pool connects on first request
