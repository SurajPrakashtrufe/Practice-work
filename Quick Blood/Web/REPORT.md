# Quick Blood — Build Report

## App Infrastructure

| File | Description |
|---|---|
| `app/layout.tsx` | Root layout — Geist font, Sonner `<Toaster>`, full SEO metadata (OG, Twitter card, Apple PWA) |
| `app/globals.css` | Smooth scroll, tap highlight removal, `@keyframes shimmer/fadeIn/slideUp/pulse-ring`, page entrance animations, scrollbar utilities |
| `app/manifest.ts` | PWA manifest — theme color, icons, SOS + request shortcuts |
| `app/page.tsx` | Public marketing landing page — hero, stats bar, how-it-works, role cards, trust signals, CTA, footer |
| `app/not-found.tsx` | 404 page with home + dashboard links |
| `app/error.tsx` | Global error boundary with reset + go home |

---

## Auth Flow (`/auth`)

| File | Description |
|---|---|
| `auth/layout.tsx` | Centered card layout for all auth pages |
| `auth/login/page.tsx` | Email/password login, role detection, session write to localStorage |
| `auth/register/page.tsx` | Registration form with role selector (donor/patient/hospital) |
| `auth/verify-email/page.tsx` | Email OTP verification step |
| `auth/verify-phone/page.tsx` | Phone OTP verification step |
| `auth/forgot-password/page.tsx` | Email entry for password reset |
| `auth/reset-password/page.tsx` + `reset-form.tsx` | New password form after reset link |
| `auth/onboarding/page.tsx` | Multi-step profile setup — blood group, city, availability, hospital details |

---

## Dashboard Shell

| File | Description |
|---|---|
| `dashboard/layout.tsx` | Role-aware shell — top header (bell, blood group badge), bottom nav per role, notification link, SOS shortcut |
| `dashboard/page.tsx` | Role router — redirects to `/dashboard/donor`, `/patient`, or `/hospital` |
| `dashboard/loading.tsx` | Spinner fallback for dashboard segment |
| `dashboard/error.tsx` | Dashboard-scoped error boundary |

---

## Donor Dashboard (`/dashboard/donor`)

| File | Description |
|---|---|
| `donor/page.tsx` | Home — availability toggle (persisted to localStorage), blood group stats, reliability score bar, nearby compatible requests |
| `donor/loading.tsx` | Full skeleton matching donor home layout |
| `donor/requests/page.tsx` | All compatible blood requests — filter by All/Urgent/Nearby, respond button with pending → accepted state + toast |
| `donor/donations/page.tsx` | Donation history — cooldown ring + progress bar, reliability score, active/history tabs |
| `donor/profile/page.tsx` | Profile — avatar, availability toggle, stats, notification settings, logout |

---

## Patient Dashboard (`/dashboard/patient`)

| File | Description |
|---|---|
| `patient/page.tsx` | Home — active request card with live status, stats row, past requests list, new request CTA |
| `patient/loading.tsx` | Full skeleton matching patient home layout |
| `patient/request/new/page.tsx` | 3-step new request wizard (patient info → hospital → blood group/units/urgency) with validation, review screen, success screen + toast |
| `patient/requests/page.tsx` | Active/Past tabs with status badges and respondent counts |
| `patient/requests/[id]/page.tsx` | Request detail — matching engine, donor cards (distance-sorted, cooldown check), confirm/call/chat, mark fulfilled + toasts |
| `patient/profile/page.tsx` | Profile — stats, saved hospitals, settings, logout |

---

## Hospital Dashboard (`/dashboard/hospital`)

| File | Description |
|---|---|
| `hospital/page.tsx` | Home — critical stock alert, 4-stat grid, inventory overview, active requests list, post CTA |
| `hospital/loading.tsx` | Full skeleton matching hospital home layout |
| `hospital/request/new/page.tsx` | 2-step new request wizard (patient/ward info → blood group/units/urgency/crossmatch) + toast |
| `hospital/requests/page.tsx` | Active/Past tabs, links to detail |
| `hospital/requests/[id]/page.tsx` | Request detail — donor cards with reliability ScoreDots, confirm/decline/call/chat, fulfillment modal (units + notes), WhatsApp share, cancel, rate donor link + toasts |
| `hospital/inventory/page.tsx` | Per-group ± controls + direct input, critical/low/ok status, save with toast |
| `hospital/profile/page.tsx` | Hospital profile — NABH badge, verified status, 4-stat grid, contact info, manager info |

---

## Shared Dashboard Features

| File | Description |
|---|---|
| `dashboard/notifications/page.tsx` | Role-aware notifications — unread badge, All/Unread tabs, grouped Today/Earlier, click-to-read, navigation links |
| `dashboard/notifications/loading.tsx` | Notification skeleton list |
| `dashboard/sos/page.tsx` | Emergency SOS — 3 states: setup → broadcasting (animated ping) → live tracker (auto-escalating radius, nearby blood banks, 108 ambulance deeplink) |
| `dashboard/chat/[id]/page.tsx` | In-app chat — message thread, auto-reply simulation, quick reply templates, read receipts, call button, privacy masking |
| `dashboard/compatibility/page.tsx` | Blood compatibility tool — 8×8 matrix view + detail view (can donate to/receive from), universal donor/recipient facts |
| `dashboard/feedback/donor/page.tsx` | Post-donation donor rating — 5-star hover, aspect tag chips, comment, success screen + toast |

---

## Admin Panel (`/admin`)

| File | Description |
|---|---|
| `admin/layout.tsx` | Indigo sidebar layout — nav with pending badge, mobile drawer, logout |
| `admin/page.tsx` | Overview — platform stats, pending hospital queue, blood group distribution bar chart, recent activity feed |
| `admin/hospitals/page.tsx` | Hospital list — Pending/All tabs, search, status badges |
| `admin/hospitals/[id]/page.tsx` | Hospital review — full info display, approve flow (confirmation), reject flow (reason required) + toasts |
| `admin/users/page.tsx` | User directory — role/search filters, stats row, expandable rows, suspend/reinstate |
| `admin/requests/page.tsx` | Platform-wide request log — status filters, search, stats row |

---

## Components & Utilities

| File | Description |
|---|---|
| `components/ui/skeleton-card.tsx` | Shared skeletons — StatCardSkeleton, RequestCardSkeleton, ProfileCardSkeleton, ToggleCardSkeleton, NotificationSkeleton, InventoryGridSkeleton |
| `components/ui/sonner.tsx` | Sonner toast provider wrapper |
| `components/ui/button.tsx` / `input.tsx` / `card.tsx` etc. | shadcn/ui base components (pre-installed) |

---

## Summary

| Category | Count |
|---|---|
| Total `.tsx` files built | **47** |
| Auth pages | 8 |
| Donor pages | 5 |
| Patient pages | 5 |
| Hospital pages | 6 |
| Shared dashboard features | 5 |
| Admin pages | 6 |
| Infrastructure / layout / shell | 7 |
| Components | 5 |
