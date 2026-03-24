# Quick Blood — Feature Requirements Document (FRD)

**Project:** Quick Blood
**Version:** 1.4
**Last Updated:** 2026-03-24
**Status:** Active Development

---

## Build Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Built & implemented in current codebase |
| 🔄 | Partially built — UI done, backend stub only |
| 📋 | Planned — not yet started |
| ⚠️ | Modified from previous spec — see note |

---

## Priority Legend

| Priority | Label | Meaning |
|----------|-------|---------|
| **P0-A** | **Core Flow** | **Required for basic app functionality — must be completed first, in order** |
| **P0-B** | **Safety & Trust** | **Required for safe and secure usage — must ship with P0-A** |
| **P0-C** | **Enhancement** | **Improves reliability and performance — complete before launch** |
| P0 | Must Have | General must-have (use P0-A/B/C for sub-classification where possible) |
| P1 | Should Have | High value; target v1 release |
| P2 | Nice to Have | Phase 2 / post-launch |
| P3 | Future Roadmap | Long-term vision |

---

## Table of Contents

1. [Authentication & Registration](#1-authentication--registration)
2. [Onboarding Flows](#2-onboarding-flows)
3. [Donor Module](#3-donor-module)
4. [Patient / Patient Family Module](#4-patient--patient-family-module)
5. [Hospital Module](#5-hospital-module)
6. [Search & Matching Engine](#6-search--matching-engine)
7. [Notification System](#7-notification-system)
8. [Location Services](#8-location-services)
9. [Admin Panel & Verification](#9-admin-panel--verification)
10. [Blood Bank Integration](#10-blood-bank-integration)
11. [Emergency SOS](#11-emergency-sos)
12. [In-App Messaging & Communication](#12-in-app-messaging--communication)
13. [Medical Safety & Health Tracking](#13-medical-safety--health-tracking)
14. [Donation Camps & Drives](#14-donation-camps--drives)
15. [Donor Rewards & Gamification](#15-donor-rewards--gamification)
16. [Request Lifecycle Management](#16-request-lifecycle-management)
17. [Blood Component & Compatibility Engine](#17-blood-component--compatibility-engine)
18. [Rare Blood Group Registry](#18-rare-blood-group-registry)
19. [Recurring Patient Profiles](#19-recurring-patient-profiles)
20. [Digital Health Cards & Certificates](#20-digital-health-cards--certificates)
21. [Hospital Cross-Coordination](#21-hospital-cross-coordination)
22. [Social Sharing & Community](#22-social-sharing--community)
23. [Donor Availability Scheduling](#23-donor-availability-scheduling)
24. [WhatsApp & Bot Integration](#24-whatsapp--bot-integration)
25. [Government Health ID Integration](#25-government-health-id-integration)
26. [Fraud Prevention & Safety](#26-fraud-prevention--safety)
27. [Advanced Analytics & Reporting](#27-advanced-analytics--reporting)
28. [Multi-Platform & Accessibility](#28-multi-platform--accessibility)
29. [API & Third-Party Integrations](#29-api--third-party-integrations)
30. [Feedback & Support](#30-feedback--support)
31. [Offline & Resilience Features](#31-offline--resilience-features)
32. [Feature Priority Matrix](#32-feature-priority-matrix)
33. [MVP Core Flow](#33-mvp-core-flow)
34. [Core System Logic](#34-core-system-logic)
35. [Failure & Edge Case Handling](#35-failure--edge-case-handling)
36. [Minimum Launch Criteria](#36-minimum-launch-criteria)
37. [Priority Sub-Categorization](#37-priority-sub-categorization)
38. [v1.4 Priority Adjustments](#38-v14-priority-adjustments)

---

## 1. Authentication & Registration

> **Stack:** Next.js 16 · React 19 · Tailwind CSS v4 · Base UI (shadcn)
> **Strategy:** Email OTP + Phone OTP dual verification before account creation.

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| AS-01 | Multi-step Registration Form | Name, Age, Blood Group, Role, Phone, Email, Password | P0 | ✅ |
| AS-02 | Email OTP Verification | 6-digit OTP to email, verified before proceeding | P0 | ✅ |
| AS-03 | Phone OTP Verification | 6-digit OTP via SMS, completes registration | P0 | ✅ |
| AS-04 | Role Selection at Signup | Donor / Hospital / Patient selected at registration | P0 | ✅ |
| AS-05 | Terms & Conditions Dialog | Full legal T&C in scrollable modal, opened via link | P0 | ✅ |
| AS-06 | Legal Consent Checkbox | Must tick "I agree" to enable form submission | P0 | ✅ |
| AS-07 | T&C — Data Sharing Clause | Consent to share name, blood group, contact with patients/hospitals | P0 | ✅ |
| AS-08 | Login Page | Email + password login with error handling | P0 | ✅ |
| AS-09 | Forgot Password Flow | Reset request via email | P0 | ✅ |
| AS-10 | Password Reset Form | Secure token-based password reset | P0 | ✅ |
| AS-11 | JWT Session Management | Token-based auth for API calls | P0 | 📋 |
| AS-12 | Role-Based Access Control | Route guards per role: Donor / Hospital / Patient / Admin | P0 | 📋 |
| AS-13 | Refresh Token Rotation | Silent re-auth with rotating refresh tokens | P1 | 📋 |
| AS-14 | Social Login | Google / Apple sign-in as alternative | P2 | 📋 |
| AS-15 | Account Deactivation | User requests deletion; 30-day data retention before purge | P1 | 📋 |

---

## 2. Onboarding Flows

> Role-specific multi-step onboarding triggered after registration and permission dialogs.
> **Goal:** Collect minimum required data to enable safe matching. Reduce friction and drop-off.

### 2.1 Permission Dialogs (Post-Registration)

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| PD-01 | Sequential Permission Dialogs | Three dialogs shown one-after-another after account creation | P0 | ✅ |
| PD-02 | Location Permission Dialog | Explains GPS use for matching; stores Allow/Deny result | P0 | ✅ |
| PD-03 | Notification Permission Dialog | Explains push alerts for blood requests | P0 | ✅ |
| PD-04 | Messages / SMS Permission Dialog | Explains SMS OTPs and emergency alerts | P0 | ✅ |
| PD-05 | Permission Result Storage | Allow/Deny saved to session; used to auto-detect GPS in onboarding | P0 | ✅ |

### 2.2 Donor Onboarding (6 Steps)

> ⚠️ **Onboarding Simplification in progress** — Steps 3/4/6 being moved to optional post-registration profile to reduce drop-off.

| Feature ID | Feature | Description | Priority | Status | Note |
|------------|---------|-------------|----------|--------|------|
| DO-01 | Availability Selection | Available / Unavailable badge selection | P0 | ✅ | Keep |
| DO-02 | Location Step | GPS auto-fill if allowed; manual City/District/State/Country if denied | P0 | ✅ | Keep |
| DO-03 | Blood Health History | ~~Detailed disease input~~ → Simplified to Yes/No eligibility flag only | P0 | ⚠️ | **MODIFY: Replace detailed text input with Yes/No flag. Full details move to profile.** |
| DO-04 | Diabetes & Sugar Levels | ~~Fasting and post-meal glucose captured at onboarding~~ | P1 | ⚠️ | **MODIFY: Move to optional profile section after login. Not shown at onboarding.** |
| DO-05 | Blood Donation History | Ever donated? Yes → last donation month + year; 90-day gap warning | P0 | ✅ | Keep |
| DO-06 | Additional Health Details | ~~Weight, medications, allergies at onboarding~~ | P1 | ⚠️ | **MODIFY: Move weight / medications / allergies to post-registration profile edit.** |
| DO-07 | Emergency Contact | Emergency contact name and phone number | P0 | ✅ | Keep |

### 2.3 Patient / Patient Family Onboarding (3 Steps)

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| PO-01 | Requester Name Auto-fill | User's name pre-filled from registration; read-only | P0 | ✅ |
| PO-02 | Patient Details | Patient name, age, relationship, alternate contact (optional) | P0 | ✅ |
| PO-03 | Hospital Details | Hospital name, area, city, district, state; country locked to India; doctor name | P0 | ✅ |
| PO-04 | Blood Group Required | Grid selector for all 8 blood groups | P0 | ✅ |
| PO-05 | Units Required | Number of blood units needed | P0 | ✅ |
| PO-06 | Urgency — Urgent | Instant broadcast to all nearby matching donors | P0 | ✅ |
| PO-07 | Urgency — Scheduled | Date-range picker for planned surgery / procedure | P0 | ✅ |
| PO-08 | Urgency — Regular Basis | Recurring units per daily/weekly/monthly period | P0 | ✅ |

### 2.4 Hospital Onboarding (5 Steps)

> ⚠️ **Onboarding Modifications in progress** — Blood inventory and storage capacity moved post-login.

| Feature ID | Feature | Description | Priority | Status | Note |
|------------|---------|-------------|----------|--------|------|
| HO-01 | Identity Verification | ~~Aadhar-only~~ → Hospital License / Govt Registration **OR** Aadhar (either accepted) | P0 | ⚠️ | **MODIFY: Make Aadhar optional. Accept Hospital License / Govt Reg as primary proof.** |
| HO-02 | Hospital Name & Type | Government / Private / Blood Bank / NGO / Trust / Teaching | P0 | ✅ | Keep |
| HO-03 | Registration / License Number | Govt-issued hospital or blood bank license — mandatory | P0 | ✅ | Keep |
| HO-04 | Year Established | Optional founding year | P2 | ✅ | Keep |
| HO-05 | NABH Accreditation | Yes/No indicator | P1 | ✅ | Keep |
| HO-06 | Full Address | Street, area, city, district, state, PIN; country locked to India | P0 | ✅ | Keep |
| HO-07 | GPS Auto-detect | Coordinates captured if location permission granted | P0 | ✅ | Keep |
| HO-08 | Google Maps Link | Optional GMaps share URL | P1 | ✅ | Keep |
| HO-09 | Primary Contact Number | Main reception number | P0 | ✅ | Keep |
| HO-10 | Emergency Contact (24×7) | Shown to donors during urgent requests | P0 | ✅ | Keep |
| HO-11 | Email & Website | Official email; website optional | P0 | ✅ | Keep |
| HO-12 | Blood Bank In-Charge | In-charge name and direct phone | P1 | ✅ | Keep |
| HO-13 | Has Blood Bank Flag | Yes/No — triggers inventory section | P0 | ✅ | Keep |
| HO-14 | Blood Inventory per Group | ~~Captured at onboarding~~ → Move to hospital dashboard after login | P0 | ⚠️ | **MODIFY: Remove from onboarding. Hospital updates stock from dashboard post-login.** |
| HO-15 | Storage Capacity | ~~Required~~ → Optional field | P2 | ⚠️ | **MODIFY: Make optional throughout.** |
| HO-16 | 24×7 Availability | Emergency services round-the-clock indicator | P0 | ✅ | Keep |
| HO-17 | Bed Capacity | Total hospital bed count | P2 | ✅ | Keep |
| HO-18 | Specializations | Oncology, Thalassemia Centre, Cardiology, etc. | P1 | ✅ | Keep |
| HO-19 | Donation Camps Flag | Whether hospital organises blood donation drives | P2 | ✅ | Keep |
| HO-20 | Manager Details | Manager name, phone, email for accountability | P0 | ✅ | Keep |
| HO-21 | Hospital ID Proof Upload | Registration cert / blood bank license — PDF / JPG / PNG | P0 | ✅ | Keep |
| HO-22 | Govt Scheme Affiliations | Ayushman Bharat, PM-JAY, State Blood Policy | P2 | ✅ | Keep |
| HO-23 | Admin Review Notice | 24–48 hr verification notice on final step | P0 | ✅ | Keep |
| HO-24 | Real-time Inventory Sync | Hospital updates blood stock from dashboard | P0 | 📋 | New |
| HO-25 | Low Stock Alert | Notify admin when a group drops below threshold | P0 | 📋 | New |

---

## 3. Donor Module

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| DM-01 | Donor Profile Page | View and edit personal, health, and location details | P0 | 📋 |
| DM-02 | Availability Badge | Green "Available" / Grey "Unavailable" shown publicly | P0 | 🔄 |
| DM-03 | Availability Toggle | One-tap switch from profile or home screen | P0 | 📋 |
| DM-04 | 90-Day Cooldown Lock | Auto-block donor from search for 90 days post-donation | P0 | 📋 |
| DM-05 | Donation Log | Full history: date, hospital, blood group, confirmation | P1 | 📋 |
| DM-06 | Health Profile Edit | Update blood condition, diabetes, medications, weight post-login | P1 | 📋 |
| DM-07 | Blood Group Verification | Upload lab report for Verified Blood Group badge | P1 | 📋 |
| DM-08 | Donor Reliability Score | Auto-score: response rate + cancellations + completed donations | **P0** | 📋 | *(upgraded from P1)* |
| DM-09 | Donor Health Card | Downloadable one-page PDF health summary | P2 | 📋 |
| DM-10 | Next Eligible Donation Date | Auto-calculated from last donation; shown on profile | P0 | 📋 |
| DM-11 | Donor Online Status | Show Online / Offline / Last Seen on donor card | **P0** | 📋 | *(upgraded from P1 — critical for real-time matching)* |
| DM-12 | Donor Reliability Score Display | Visual score badge shown on public profile and search results | **P0** | 📋 | *(upgraded from P1)* |
| DM-13 | Verified Donor Badge | Badge for donors with lab-verified blood group | P1 | 📋 |

---

## 4. Patient / Patient Family Module

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| PM-01 | Active Request Dashboard | Open, in-progress, and fulfilled requests | P0 | 📋 |
| PM-02 | Multi-Patient Profiles | One account manages requests for multiple family members | P1 | 📋 |
| PM-03 | Request Status Tracker | Searching → Donor Found → In Transit → Fulfilled | P0 | 📋 |
| PM-04 | Donor Contact Reveal | Masked contact revealed after donor confirms intent | P0 | 📋 |
| PM-05 | Request Edit / Cancel | Edit units or urgency; cancel if blood obtained elsewhere | P0 | 📋 |
| PM-06 | Request History | Archive of all past requests with outcomes | P1 | 📋 |
| PM-07 | Patient Anonymity Toggle | Hide patient details until match confirmed | P1 | 📋 |
| PM-08 | Regular Request Automation | Auto-raise request on schedule for recurring patients | P1 | 📋 |
| PM-09 | Post-Fulfillment Feedback | Rate the donor and document outcome | P1 | 📋 |

---

## 5. Hospital Module

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| HM-01 | Hospital Dashboard | Active requests, blood inventory, verification status | P0 | 📋 |
| HM-02 | Create Blood Request | Raise request: blood group, units, urgency, patient details | P0 | 📋 |
| HM-03 | Inventory Management | Update per-group blood unit counts in real time | P0 | 📋 |
| HM-04 | Request History | Full log of requests with status and outcomes | P1 | 📋 |
| HM-05 | Staff Sub-Accounts | Staff roles: blood bank staff / doctor / admin | P1 | 📋 |
| HM-06 | Blood Usage Audit Log | Every unit issued logged for compliance | P0 | 📋 |
| HM-07 | Donation Confirmation | Hospital confirms blood received; closes request loop | P0 | 📋 |
| HM-08 | Donor Rating | Hospital rates donor after each donation | P1 | 📋 |
| HM-09 | Camp Management | Register and manage donation drives | P2 | 📋 |
| HM-10 | Cross-Hospital Request | Request surplus from nearby hospital's inventory | P1 | 📋 |
| HM-11 | Verified Hospital Badge | Verified / Pending / Rejected badge on profile | **P0** | 📋 | *(enforced immediately)* |

---

## 6. Search & Matching Engine

> 🔴 **Critical Core** — P0 across the board. The matching engine IS the app's core value.

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| SM-01 | Blood Group Filter | Find donors by exact blood group | P0 | 📋 |
| SM-02 | Compatibility Filter | Show compatible donors (O- for any; AB+ plasma for any) | P0 | 📋 |
| SM-03 | Distance-Based Search | Match within configurable radius | P0 | 📋 |
| SM-04 | Availability Filter | Show only currently available donors | P0 | 📋 |
| SM-05 | Emergency Priority Sort | Urgent requests surface eligible donors first | P0 | 📋 |
| SM-06 | Cooldown Filter | Exclude donors within 90-day window | P0 | 📋 |
| SM-07 | Health Eligibility Filter | Exclude donors with disqualifying conditions | P0 | 📋 |
| SM-08 | Donor Score Sort | Higher reliability score ranked first | P0 | 📋 |
| SM-09 | Plasma / Platelet Donors | Separate filter for component donation types | P1 | 📋 |
| SM-10 | Rare Blood Group Flag | Dedicated search pool for rare groups | P1 | 📋 |
| SM-11 | Real-Time Matching Engine | Core algorithm: blood group + distance + availability + eligibility | **P0** | 📋 | *(upgraded — must build)* |
| SM-12 | Radius Selection Filter | User selects 5 km / 10 km / 25 km / 50 km | **P0** | 📋 |
| SM-13 | Live Distance Calculation | Show exact distance between donor and requester in real time | **P0** | 📋 |
| SM-14 | Smart Matching Priority | Rank donors: distance + availability + reliability score combined | **P0** | 📋 |

---

## 7. Notification System

> 🔴 **Must be real-time.** Push failures must fall back to SMS automatically.

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| NS-01 | SMS Notification | Notify donors via SMS for nearby blood requests | P0 | 🔄 |
| NS-02 | Email Notification | Email alerts for OTPs, requests, status updates | P0 | 🔄 |
| NS-03 | Push Notification | In-app/browser push for mobile and web | P0 | 🔄 |
| NS-04 | Permission-Gated Alerts | Notifications only if user granted permission in onboarding | P0 | ✅ |
| NS-05 | Emergency Broadcast | Blast to all eligible nearby donors: "Urgent blood needed near you" | P0 | 📋 |
| NS-06 | Request Status Updates | Notify requester when donor responds, confirms, or withdraws | P0 | 📋 |
| NS-07 | Cooldown Reminder | Notify donor when eligible to donate again | P1 | 📋 |
| NS-08 | Inventory Low Alert | Alert hospital staff when blood group stock drops below threshold | P0 | 📋 |
| NS-09 | Camp Reminder | Remind donors 24 hrs before a donation camp | P2 | 📋 |
| NS-10 | Verification Status Alert | Hospital notified when admin approves / rejects registration | P0 | 📋 |
| NS-11 | Notification Preferences | User manages which alert types they receive | P1 | 📋 |
| NS-12 | Instant Push Trigger Engine | Trigger push notification immediately on request creation | **P0** | 📋 | *(upgraded — real-time mandatory)* |
| NS-13 | SMS Fallback System | If push delivery fails, auto-send SMS alert | **P0** | 📋 |
| NS-14 | Notification Delivery Tracking | Track delivered / read status per notification | **P0** | 📋 | *(upgraded from P1 — required for reliability)* |

---

## 8. Location Services

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| LS-01 | GPS Auto-Detect | Capture device coordinates if permission granted | P0 | ✅ |
| LS-02 | Manual Location Entry | City, District, State, PIN as fallback | P0 | ✅ |
| LS-03 | Google Maps Link | Paste GMaps URL for precise navigation | P1 | ✅ |
| LS-04 | Reverse Geocoding | GPS coordinates → readable address via Maps API | P0 | 📋 |
| LS-05 | Radius Search | Find donors/hospitals within N km | P0 | 📋 |
| LS-06 | Map View | Interactive map of nearby donors and hospitals | P1 | 📋 |
| LS-07 | Real-Time Donor Location | Optional live location sharing during transit (donor consent) | P2 | 📋 |
| LS-08 | PIN Code Lookup | Auto-fill city/district from PIN via postal API | P1 | 📋 |

---

## 9. Admin Panel & Verification

> 🔴 **Hospital verification must be built immediately** — unverified hospitals cannot be trusted with blood usage data.

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| AP-01 | User Management | View, suspend, restore, delete donor/patient accounts | P0 | 📋 |
| AP-02 | Hospital Verification Queue | List of pending hospital registrations for review | **P0** | 📋 | *(enforced)* |
| AP-03 | Document Review | View uploaded ID proof and license during verification | **P0** | 📋 |
| AP-04 | Request Monitoring | View all active, in-progress, fulfilled, expired requests | P0 | 📋 |
| AP-05 | Fraud & Spam Detection | Flag and remove fake/duplicate accounts | P0 | 📋 |
| AP-06 | Analytics Dashboard | Donors, requests, fulfillment rate, blood group heatmap | P1 | 📋 |
| AP-07 | Blood Group Shortage Alerts | Alert when a group has critically low donor count in a region | P0 | 📋 |
| AP-08 | Audit Log | Immutable log of all admin actions | P0 | 📋 |
| AP-09 | Export Reports | CSV / PDF for donors, requests, hospital data | P1 | 📋 |
| AP-10 | Content Management | Manage T&C, Privacy Policy, help articles | P2 | 📋 |
| AP-11 | Role Management | Sub-admin roles with limited permissions | P2 | 📋 |
| AP-12 | Hospital Verification Workflow | Approve / Reject hospital with written reason + audit trail | **P0** | 📋 | *(upgraded — build immediately)* |
| AP-13 | Verified Hospital Badge System | Green "Verified" badge issued after admin approval | **P0** | 📋 |
| AP-14 | Fake Account Detection Rules | Rule-based flags: duplicate phone, rapid requests, mismatched location | **P0** | 📋 |

---

## 10. Blood Bank Integration

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| BB-01 | Blood Bank Registry | Directory of registered blood banks with live stock | P1 | 📋 |
| BB-02 | Real-Time Stock Status | Units per blood group at each blood bank | P0 | 🔄 |
| BB-03 | Fallback to Blood Bank | If no donor found, surface nearest stocked blood bank | P0 | 📋 |
| BB-04 | Blood Bank Portal Login | Blood banks manage their own stock dashboard | P1 | 📋 |
| BB-05 | Stock History | Incoming / outgoing units log with recipient details | P1 | 📋 |
| BB-06 | e-Raktkosh API Integration | Sync with NBTC e-Raktkosh national blood stock system | P3 | 📋 |

---

## 11. Emergency SOS

> 🔴 **Upgraded to P0.** This is the single highest-value feature for life-saving scenarios.

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| SOS-01 | One-Tap SOS Request | Emergency request raised with single button | **P0** | 📋 | *(upgraded from P1)* |
| SOS-02 | Broadcast to All Nearby | Auto-notify all eligible donors within radius | **P0** | 📋 |
| SOS-03 | Radius Escalation | Widen radius if no donor responds in X minutes | **P0** | 📋 |
| SOS-04 | SOS Live Tracker | Real-time: donors notified / responded / confirmed | **P0** | 📋 |
| SOS-05 | SOS Request Pinning | Urgent requests pinned at top of all donor feeds | P0 | 📋 |
| SOS-06 | 108 Ambulance Deeplink | One-tap link to emergency ambulance services | P1 | 📋 |
| SOS-07 | One-Tap Emergency Button | Pre-filled form with saved patient + hospital data; one click to submit | **P0** | 📋 |
| SOS-08 | Auto Radius Expansion | Automatically increase search radius if no response after X minutes | **P0** | 📋 |

---

## 12. In-App Messaging & Communication

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| CM-01 | Donor-Requester Chat | In-app messaging between matched donor and hospital/patient | P1 | 📋 |
| CM-02 | Message Templates | Pre-set coordination messages (ETA, confirmation, address) | P1 | 📋 |
| CM-03 | Anonymous Contact Phase | Phone numbers masked until both parties confirm intent | P0 | 📋 |
| CM-04 | Call Masking | Proxy call so donor's number is never directly exposed | P1 | 📋 |
| CM-05 | Read Receipts | Confirm donor has seen the request | P1 | 📋 |
| CM-06 | Message Expiry | Chat thread expires after request closes or 7 days | P2 | 📋 |

---

## 13. Medical Safety & Health Tracking

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| MH-01 | Blood Condition Flag (Simplified) | Yes/No eligibility flag at onboarding; detailed input in profile | P0 | ⚠️ |
| MH-02 | Diabetes Tracking (Post-Login) | Fasting and post-meal glucose in optional profile section | P1 | ⚠️ |
| MH-03 | Medication Disclosure | Current medications in post-login profile edit | P1 | ⚠️ |
| MH-04 | Known Allergies | Allergy info in post-login profile section | P1 | ⚠️ |
| MH-05 | Weight Eligibility (Post-Login) | Weight captured in profile edit; min 50 kg for donation | P1 | ⚠️ |
| MH-06 | Age Restriction Enforcement | Only 18–65 can register as active donors | P0 | ✅ |
| MH-07 | 90-Day Cooldown Enforcement | Block donor from search for 90 days post-donation | P0 | 📋 |
| MH-08 | Temporary Health Flag | Self-flag unavailability: illness, travel, medication | P1 | 📋 |
| MH-09 | Pre-Donation Eligibility Checklist | Short health questionnaire before each donation confirmation | P1 | 📋 |
| MH-10 | Blood Group Certificate Upload | Lab-verified blood group report for Verified badge | P1 | 📋 |
| MH-11 | Emergency Contact Stored | Emergency contact captured for every donor | P0 | ✅ |
| MH-12 | Health Profile Re-assessment | Prompt donor to update health info every 6 months | P2 | 📋 |

---

## 14. Donation Camps & Drives

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| DC-01 | Camp Registration by Hospital/NGO | Register a camp: date, location, capacity | P2 | 📋 |
| DC-02 | Camp Discovery Feed | Donors browse and register for nearby upcoming camps | P2 | 📋 |
| DC-03 | Camp Reminder Notifications | Notify donors 24 hrs and 1 hr before camp | P2 | 📋 |
| DC-04 | Bulk Donation Logging | Record multiple donations from a single camp | P2 | 📋 |
| DC-05 | Camp Analytics | Attendance vs target, units collected, group breakdown | P2 | 📋 |
| DC-06 | Hospital Runs Camps Flag | Captured at onboarding; surfaces active organisers | P2 | ✅ |

---

## 15. Donor Rewards & Gamification

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| RG-01 | Donation Points | Points earned per confirmed donation | P2 | 📋 |
| RG-02 | Milestone Badges | 1st, 5th, 10th, 25th donation badges | P2 | 📋 |
| RG-03 | City / District Leaderboard | Top donors ranked by location | P2 | 📋 |
| RG-04 | Partner Discounts | Pharmacies and clinics offer perks to active donors | P3 | 📋 |
| RG-05 | Digital Donation Certificate | Auto-generated downloadable PDF per donation | P2 | 📋 |
| RG-06 | Streak System | Consecutive-year donation streaks | P3 | 📋 |
| RG-07 | Life Saved Counter | Estimated lives saved on profile (1 donation ≈ 3 lives) | P2 | 📋 |

---

## 16. Request Lifecycle Management

> Tracks a blood request from creation through fulfillment or expiry.
> 🔴 **Must implement fully at P0** — incomplete lifecycle breaks the core loop.

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| RL-01 | Request States | Draft → Open → Donor Found → In Transit → Fulfilled / Expired / Cancelled | P0 | 📋 |
| RL-02 | Request Expiry | Auto-close urgent requests after 24 hrs; notify requester | P0 | 📋 |
| RL-03 | Donor Accept / Decline | Donor taps Accept or Decline on incoming notification | P0 | 📋 |
| RL-04 | Multiple Donor Matching | Multiple donors can respond; requester picks the best | P0 | 📋 |
| RL-05 | Fulfillment Confirmation | Hospital/patient confirms blood received; closes request | P0 | 📋 |
| RL-06 | Partial Fulfillment | Mark partially fulfilled; continue searching for remaining units | P1 | 📋 |
| RL-07 | Request Cloning | Duplicate past request with updated details | P2 | 📋 |
| RL-08 | Request Feed | Donors see live feed of open requests sorted by urgency | P0 | 📋 |
| RL-09 | Real-Time Request Tracker | Live updates: Notified → Accepted → On the Way → Completed | **P0** | 📋 |
| RL-10 | Donor ETA Tracking | Donor shares estimated arrival time or optional live location | **P1** | 📋 |
| RL-11 | Auto Expiry Enforcement | System hard-expires requests after defined duration (24 hrs urgent / 7 days scheduled) | **P0** | 📋 | *(priority enforced)* |
| RL-12 | Multi-Donor Selection UI | Requester UI to compare and select best donor among all responders | **P0** | 📋 |
| RL-13 | Donor Response Counter | Show "X donors notified / Y responded" on request card | **P1** | 📋 |
| RL-14 | Live Status UI | Real-time UI updates without page refresh (WebSockets / Firebase) | **P0** | 📋 |

---

## 17. Blood Component & Compatibility Engine

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| BC-01 | Blood Component Types | Whole blood, Packed RBCs, FFP, Platelets, Cryoprecipitate | P1 | 📋 |
| BC-02 | Component-Based Requests | Patient requests specific component, not just whole blood | P1 | 📋 |
| BC-03 | Platelet Donor Pool | Sub-registry for platelet/apheresis donors | P2 | 📋 |
| BC-04 | Plasma Donor Pool | Convalescent plasma donor tracking | P2 | 📋 |
| BC-05 | Compatibility Matrix Engine | O- for any; AB for plasma; logic applied at matching | P0 | 📋 |
| BC-06 | In-App Compatibility Chart | Visual reference for blood group compatibility | P1 | 📋 |

---

## 18. Rare Blood Group Registry

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| RB-01 | Rare Group Flag | Donors self-declare rare groups (Bombay/hh, Rh-null, etc.) | P2 | 📋 |
| RB-02 | Rare Group Lab Verification | Certified lab proof for rare group badge | P2 | 📋 |
| RB-03 | Rare Group Emergency Search | Separate search path for rare blood groups | P2 | 📋 |
| RB-04 | National Rare Group Network | Connect with rare donor registries across states | P3 | 📋 |
| RB-05 | Rare Donor Override Alert | Alert rare donors even outside normal search radius | P2 | 📋 |

---

## 19. Recurring Patient Profiles

> For patients with chronic conditions requiring regular transfusions (thalassemia, dialysis, etc.)

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| RP-01 | Recurring Request Setup | Regular urgency type captured at onboarding with units & period | P0 | ✅ |
| RP-02 | Auto-Request Scheduler | System auto-raises request on scheduled date | P1 | 📋 |
| RP-03 | Dedicated Donor Pool | Patient saves preferred donors for recurring needs | P1 | 📋 |
| RP-04 | Transfusion History Log | All past transfusion dates and units logged | P1 | 📋 |
| RP-05 | Caregiver Sub-Account | Family caregiver manages requests on patient's behalf | P2 | 📋 |

---

## 20. Digital Health Cards & Certificates

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| HC-01 | Donor Health Card | Downloadable PDF: blood group, health status, last donation | P2 | 📋 |
| HC-02 | Donation Certificate | Auto-generated certificate with QR code per donation | P2 | 📋 |
| HC-03 | Hospital Verified Receipt | Hospital-stamped digital receipt per blood unit issued | P1 | 📋 |
| HC-04 | QR Profile Sharing | Donor QR opens their Quick Blood public profile | P2 | 📋 |

---

## 21. Hospital Cross-Coordination

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| HC-X-01 | Hospital-to-Hospital Request | Hospital A requests surplus from Hospital B | P1 | 📋 |
| HC-X-02 | Surplus Stock Broadcast | Hospitals with excess stock broadcast availability | P1 | 📋 |
| HC-X-03 | Transfer Confirmation | Both hospitals confirm; both inventories auto-updated | P1 | 📋 |
| HC-X-04 | Transfer Audit Trail | Immutable log of all inter-hospital blood movements | P0 | 📋 |

---

## 22. Social Sharing & Community

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| SC-01 | Share Request via WhatsApp | One-tap share of blood request to WhatsApp | P1 | 📋 |
| SC-02 | Share to Social Media | Facebook / Twitter / X sharing buttons | P2 | 📋 |
| SC-03 | Referral System | Points earned when referred user signs up | P2 | 📋 |
| SC-04 | Public Donor Wall | Opt-in city-level top-donor leaderboard | P2 | 📋 |
| SC-05 | NGO / Organisation Accounts | NGOs manage a pool of volunteer donors | P2 | 📋 |
| SC-06 | Community Impact Counter | Running total: requests fulfilled, lives helped, units donated | P2 | 📋 |

---

## 23. Donor Availability Scheduling

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| DA-01 | Set Availability Window | Donor sets specific days/times available each week | P2 | 📋 |
| DA-02 | Blackout Dates | Donor blocks dates when unavailable | P2 | 📋 |
| DA-03 | Auto-Unavailable on Travel | Donor sets travel dates; system marks unavailable automatically | P2 | 📋 |
| DA-04 | Availability Reminder | Prompt donor to update availability after 30 days inactivity | P2 | 📋 |

---

## 24. WhatsApp & Bot Integration

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| WA-01 | WhatsApp OTP Delivery | OTPs via WhatsApp as SMS alternative | P2 | 📋 |
| WA-02 | WhatsApp Request Alert | Push blood request directly to donor on WhatsApp | P1 | 📋 |
| WA-03 | WhatsApp Bot — Donor Lookup | "Find B+ donor near Pune" via WhatsApp message | P3 | 📋 |
| WA-04 | WhatsApp Bot — Request Raise | Raise emergency request via WhatsApp without opening app | P3 | 📋 |
| WA-05 | USSD Fallback | Blood request lookup via USSD for feature phones | P3 | 📋 |

---

## 25. Government Health ID Integration

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| GH-01 | ABDM Health ID Linking | Link Ayushman Bharat (ABHA) health ID | P3 | 📋 |
| GH-02 | e-Raktkosh Sync | Pull/push stock data from NBTC API | P3 | 📋 |
| GH-03 | DigiLocker Aadhar Verify | Paperless Aadhar verification via DigiLocker API | P3 | 📋 |
| GH-04 | State Blood Policy Compliance | Request flows comply with state-level transfusion regulations | P2 | 📋 |

---

## 26. Fraud Prevention & Safety

> 🔴 **Critical.** Misuse of blood request platform has life-and-death consequences.

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| FS-01 | Donation Confirmation | Hospital confirms blood received; closes request loop | P0 | 📋 |
| FS-02 | Post-Donation Feedback | Donor and hospital rate each other | P1 | 📋 |
| FS-03 | Report a User | Flag suspicious, abusive, or fake accounts | P0 | 📋 |
| FS-04 | In-App Help Center | FAQ and guided help articles | P1 | 📋 |
| FS-05 | Support Ticket System | Raise a support issue; admin responds | P1 | 📋 |
| FS-06 | Safety Incident Report | Report misuse of blood data or false request filing | P0 | 📋 |
| FS-07 | Legal Consent Record | T&C agreement timestamp stored per user for legal compliance | P0 | 🔄 |
| FS-08 | Request Limit Control | Limit number of simultaneous active requests per user / hospital | **P0** | 📋 |
| FS-09 | OTP Before Emergency Request | Mandatory OTP re-verification before raising urgent/SOS request | **P0** | 📋 |
| FS-10 | Suspicious Activity Flagging | Auto-flag abnormal patterns: rapid requests, mismatched location, duplicate accounts | **P0** | 📋 |

---

## 27. Advanced Analytics & Reporting

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| AN-01 | Blood Demand Heatmap | Visual map of request density by city/district | P2 | 📋 |
| AN-02 | Blood Group Shortage Alerts | Admin notified when donor count drops critically | P0 | 📋 |
| AN-03 | Fulfillment Rate Tracking | % requests fulfilled within 1 hr / 4 hrs / 24 hrs SLA | P1 | 📋 |
| AN-04 | Donor Engagement Trends | Active vs inactive donors over time; churn analysis | P2 | 📋 |
| AN-05 | Hospital Performance Metrics | Response time, fulfillment rate, rating per hospital | P2 | 📋 |
| AN-06 | Export Reports | CSV / PDF for donors, requests, inventory, camps | P1 | 📋 |
| AN-07 | Blood Type Distribution Map | Regional breakdown of donor blood groups | P2 | 📋 |
| AN-08 | Predictive Shortage Model | ML alert: "B- likely short in Chennai next week" | P3 | 📋 |

---

## 28. Multi-Platform & Accessibility

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| MP-01 | Web App (Next.js) | Responsive web — current platform | P0 | ✅ |
| MP-02 | Android App | React Native or native Android | P2 | 📋 |
| MP-03 | iOS App | React Native or native iOS | P2 | 📋 |
| MP-04 | PWA Support | Install from browser; offline caching | P2 | 📋 |
| MP-05 | Dark Mode | System-aware and manual toggle | P2 | 📋 |
| MP-06 | Multilingual Support | Hindi, Tamil, Bengali, Telugu, Marathi, Kannada | P2 | 📋 |
| MP-07 | RTL Layout | Urdu right-to-left support | P3 | 📋 |
| MP-08 | WCAG 2.1 AA Compliance | Full screen reader and accessibility support | P2 | 📋 |
| MP-09 | Large Font Mode | Accessibility option for visually impaired | P2 | 📋 |
| MP-10 | Low-Bandwidth Mode | Reduced asset loading for slow networks | P2 | 📋 |

---

## 29. API & Third-Party Integrations

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| INT-01 | Google Maps API | Map display, distance, geocoding, reverse geocoding | P0 | 📋 |
| INT-02 | Twilio / MSG91 | SMS delivery and call masking | P0 | 📋 |
| INT-03 | Firebase Cloud Messaging | Push notifications for Android and web | P0 | 📋 |
| INT-04 | SendGrid / Mailgun | Transactional email: OTPs, alerts, certificates | P0 | 📋 |
| INT-05 | WhatsApp Business API | WhatsApp OTPs and request notifications | P1 | 📋 |
| INT-06 | Razorpay / UPI | Optional payment for premium or membership features | P3 | 📋 |
| INT-07 | DigiLocker API | Aadhar and document verification | P3 | 📋 |
| INT-08 | e-Raktkosh API | National blood bank stock integration | P3 | 📋 |
| INT-09 | ABDM API | Ayushman Bharat Digital Mission health ID | P3 | 📋 |
| INT-10 | Hospital EHR Connector | Plug-in for hospital management systems | P3 | 📋 |
| INT-11 | 108 Emergency Services | Direct link / API call to ambulance services | P1 | 📋 |

---

## 30. Feedback & Support

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| FB-01 | Post-Donation Feedback | Both parties submit feedback after donation | P1 | 📋 |
| FB-02 | Donor Rating by Hospital | Hospital rates donor 1–5 stars with comment | P1 | 📋 |
| FB-03 | Hospital Rating by Donor | Donor rates hospital experience | P1 | 📋 |
| FB-04 | Report a User / Hospital | Flag suspicious or abusive accounts | P0 | 📋 |
| FB-05 | In-App Help Center | FAQ and guided help articles | P1 | 📋 |
| FB-06 | Support Ticket System | User raises issue; admin responds from panel | P1 | 📋 |

---

## 31. Offline & Resilience Features

| Feature ID | Feature | Description | Priority | Status |
|------------|---------|-------------|----------|--------|
| OR-01 | Offline Donor Cache | Cache nearby donor list for offline viewing | P2 | 📋 |
| OR-02 | SMS Request Fallback | Accept blood requests via inbound SMS | P3 | 📋 |
| OR-03 | Service Worker Caching | Background sync and asset caching for PWA | P2 | 📋 |
| OR-04 | Retry Queue | Failed API calls queued and retried on reconnect | P1 | 📋 |

---

## 32. Feature Priority Matrix

### Build Status Summary

| Status | Count (approx.) |
|--------|----------------|
| ✅ Built | ~40 features |
| 🔄 UI Done, Backend Pending | ~8 features |
| 📋 Planned | ~120 features |

---

### Priority Assignments (Updated v1.4)

> P0 features are now sub-categorised as P0-A (Core Flow) · P0-B (Safety & Trust) · P0-C (Enhancement).
> Build order: complete all P0-A first, then P0-B in parallel, then P0-C before launch.

| Feature Group | Priority | Sub | Change | Status |
|---------------|----------|-----|--------|--------|
| Authentication (Register / Login / OTP) | P0 | P0-A | — | ✅ Built |
| Terms & Conditions + Legal Consent | P0 | P0-A | — | ✅ Built |
| Permission Dialogs | P0 | P0-A | — | ✅ Built |
| Donor Onboarding (Simplified) | P0 | P0-A | ⚠️ Steps 3/4/6 simplified | ✅ Built |
| Patient Onboarding | P0 | P0-A | — | ✅ Built |
| Hospital Onboarding (Modified) | P0 | P0-A | ⚠️ Inventory post-login | ✅ Built |
| Role-Based Routing | P0 | P0-A | — | ✅ Built |
| Donor Availability Badge & Toggle | P0 | P0-A | — | 🔄 UI Done |
| **Real-Time Matching Engine (SM-11–14)** | **P0** | **P0-A** | 🔴 Upgraded | 📋 Planned |
| **Request Lifecycle — Full (RL-01–14)** | **P0** | **P0-A** | 🔴 Upgraded | 📋 Planned |
| **Instant Push + SMS Fallback (NS-12–13)** | **P0** | **P0-A** | 🔴 Upgraded | 📋 Planned |
| **Notification Delivery Tracking (NS-14)** | **P0** | **P0-A** | 🔴 Upgraded from P1 | 📋 Planned |
| **Emergency SOS (SOS-01–08)** | **P0** | **P0-A** | 🔴 Upgraded from P1 | 📋 Planned |
| **Donor Online Status (DM-11)** | **P0** | **P0-A** | 🔴 Upgraded from P1 | 📋 Planned |
| 90-Day Cooldown Enforcement | P0 | P0-A | — | 📋 Planned |
| JWT Auth & RBAC | P0 | P0-A | — | 📋 Planned |
| **Hospital Verification Workflow (AP-12–14)** | **P0** | **P0-B** | 🔴 Enforced immediately | 📋 Planned |
| **Fraud Prevention (FS-08–10)** | **P0** | **P0-B** | 🔴 New | 📋 Planned |
| **Verified Hospital Badge (HM-11)** | **P0** | **P0-B** | 🔴 Enforced | 📋 Planned |
| Anonymous Contact / Phone Masking | P0 | P0-B | — | 📋 Planned |
| Request Limit Control (FS-08) | P0 | P0-B | — | 📋 Planned |
| OTP Before Emergency Request (FS-09) | P0 | P0-B | — | 📋 Planned |
| **Donor Reliability Score (DM-08, DM-12)** | **P0** | **P0-C** | 🔴 Upgraded from P1 | 📋 Planned |
| Smart Matching Priority (SM-14) | P0 | P0-C | — | 📋 Planned |
| Live Status UI — WebSocket (RL-14) | P0 | P0-C | — | 📋 Planned |
| Blood Bank Integration | P1 | — | — | 📋 Planned |
| In-App Chat | P1 | — | — | 📋 Planned |
| Donor Profile & Donation Log | P1 | — | — | 📋 Planned |
| Request Feed (Donor View) | P1 | — | — | 📋 Planned |
| Blood Compatibility Engine | P1 | — | — | 📋 Planned |
| WhatsApp Notifications | P1 | — | — | 📋 Planned |
| Donation Camps Management | P2 | — | — | 📋 Planned |
| Donor Rewards & Gamification | P2 | — | — | 📋 Planned |
| Recurring Patient Auto-Scheduler | P2 | — | — | 📋 Planned |
| Rare Blood Group Registry | P2 | — | — | 📋 Planned |
| Advanced Analytics & Heatmap | P2 | — | — | 📋 Planned |
| Multilingual Support | P2 | — | — | 📋 Planned |
| PWA / Mobile Apps | P2 | — | — | 📋 Planned |
| Dark Mode | P2 | — | — | 📋 Planned |
| Government ID / ABDM Integration | P3 | — | — | 📋 Planned |
| Predictive Shortage Model (ML) | P3 | — | — | 📋 Planned |
| USSD / SMS Fallback (Feature Phones) | P3 | — | — | 📋 Planned |
| WhatsApp Bot (Raise Request via Chat) | P3 | — | — | 📋 Planned |

---

## 33. MVP Core Flow

> 🔴 **P0-A — Build in this exact order.** No P1/P2 feature should be developed until this entire chain works end-to-end.

| Feature ID | Feature | Description | Depends On |
|------------|---------|-------------|------------|
| MVP-01 | User Registration | Complete signup: Email + Phone OTP + Role + Onboarding | — |
| MVP-02 | Donor Availability System | Donor marked Available / Unavailable via toggle; badge shown publicly | MVP-01 |
| MVP-03 | Create Blood Request | Patient/Hospital raises request: blood group, units, urgency | MVP-01 |
| MVP-04 | Matching Engine Core | Filter donors by blood group, availability, distance, eligibility | MVP-02, MVP-03 |
| MVP-05 | Notification Trigger | Instant push + SMS fallback fired on request creation | MVP-04 |
| MVP-06 | Donor Response System | Donor accepts or rejects an incoming request | MVP-05 |
| MVP-07 | Request Tracking | Real-time status: Open → Accepted → In Transit → Fulfilled | MVP-06 |
| MVP-08 | Fulfillment Confirmation | Hospital/Patient confirms donation received; request closes | MVP-07 |
| MVP-09 | Cooldown Enforcement | 90-day donor cooldown auto-activated after confirmed donation | MVP-08 |

```
Registration → Onboarding → [Donor: Set Availability] → [Patient/Hospital: Create Request]
                                                                        ↓
                                                          Matching Engine runs
                                                                        ↓
                                                          Notifications sent (Push → SMS fallback)
                                                                        ↓
                                                          Donor accepts → Request tracked live
                                                                        ↓
                                                          Hospital confirms → Cooldown starts
```

---

## 34. Core System Logic

### 34.1 Matching Engine Logic

```
INPUT
─────────────────────────────────────────────────────
  blood_group_required   : string      (e.g. "B+")
  request_location       : { lat, lng }
  urgency_type           : urgent | scheduled | regular
  units_needed           : number

PROCESS
─────────────────────────────────────────────────────
  Step 1  Filter donors by blood group compatibility
          (exact match + compatible donors per matrix)

  Step 2  Filter donors where availability = Available

  Step 3  Exclude donors in 90-day post-donation cooldown

  Step 4  Exclude donors with disqualifying health flags

  Step 5  Filter donors within selected search radius

  Step 6  Rank remaining donors by:
            a) Distance        (nearest first)
            b) Online status   (Online > Last Seen < 1hr > Offline)
            c) Reliability score (highest first)

OUTPUT
─────────────────────────────────────────────────────
  sorted_donor_list[]
  → Trigger Notification System (§34.2)
```

### 34.2 Notification Delivery Logic

```
TRIGGER
─────────────────────────────────────────────────────
  On request creation (or donor match found)

PROCESS
─────────────────────────────────────────────────────
  Step 1  Send push notification immediately

  Step 2  Wait 5–10 seconds

  Step 3  Check delivery status
          If push NOT delivered → trigger SMS fallback
          If push delivered     → mark as delivered, track read

  Step 4  Log delivery status:
            sent | delivered | read | failed

  Step 5  If both push + SMS fail → retry once after 60s
          If still fails         → flag for admin review
```

---

## 35. Failure & Edge Case Handling

| Feature ID | Edge Case | System Behaviour |
|------------|-----------|-----------------|
| EC-01 | No matching donor found | Show nearest blood bank with available stock; display contact |
| EC-02 | No donor response (timeout) | Auto-expand search radius; re-trigger notifications to wider pool |
| EC-03 | Donor cancels after accepting | Re-trigger matching instantly; notify requester; penalise reliability score |
| EC-04 | Multiple donors accept simultaneously | Requester sees all responders; selects best match via UI |
| EC-05 | Partial fulfillment | Request stays open for remaining units; continue matching in background |
| EC-06 | Fake or suspicious request detected | Block request submission; notify admin; log event |
| EC-07 | Push notification failure | Auto-fallback to SMS; retry once; flag if both fail |
| EC-08 | Hospital unverified at request time | Prevent request creation; prompt admin verification first |
| EC-09 | Donor in cooldown period | Excluded from matching; next eligible date shown on their profile |
| EC-10 | Request expires (24 hrs urgent / 7 days scheduled) | Auto-close; notify requester; suggest blood bank fallback |

---

## 36. Minimum Launch Criteria

> The application **cannot go live** until every condition below is verified and tested end-to-end.

| # | Criteria | Feature Reference | Status |
|---|----------|------------------|--------|
| 1 | User registration, OTP verification, and role onboarding fully working | AS-01–10, DO/PO/HO onboarding | ✅ Built |
| 2 | Donor availability toggle operational and badge visible on profile | DM-02, DM-03 | 🔄 Partial |
| 3 | Patient and hospital can create blood requests | MVP-03, PO-04–08 | 🔄 Partial |
| 4 | Matching engine fully functional (SM-01–SM-14) | §6 | 📋 Planned |
| 5 | Notification system working: Push + SMS fallback (NS-01–NS-14) | §7 | 📋 Planned |
| 6 | Request lifecycle complete: Open → Accepted → Fulfilled (RL-01–RL-09) | §16 | 📋 Planned |
| 7 | Hospital verification system active: queue, approval, badge (AP-12–14) | §9 | 📋 Planned |
| 8 | Fraud prevention basic rules active: request limits, OTP gate, flagging (FS-08–10) | §26 | 📋 Planned |
| 9 | 90-day cooldown enforced after confirmed donation | DM-04, MVP-09 | 📋 Planned |
| 10 | Edge cases EC-01 to EC-10 handled without app crash | §35 | 📋 Planned |

---

## 37. Priority Sub-Categorization

> Introduced in v1.4 to give development teams a clear build order within P0.

| Priority | Label | Meaning | Build Order |
|----------|-------|---------|-------------|
| **P0-A** | **Core Flow** | Basic app functionality — registration → matching → request → fulfillment | First |
| **P0-B** | **Safety & Trust** | Verification, fraud prevention, contact privacy | Second (parallel with P0-A where possible) |
| **P0-C** | **Reliability Enhancement** | Scoring, smart ranking, real-time UI polish | Third (before launch) |

### Sub-category Assignments

| Feature Group | Priority | Sub-category |
|---------------|----------|-------------|
| Matching Engine (SM-01–14) | P0 | **P0-A** |
| Request Lifecycle (RL-01–14) | P0 | **P0-A** |
| Notification System — Push + SMS (NS-01–13) | P0 | **P0-A** |
| Notification Delivery Tracking (NS-14) | P0 | **P0-A** |
| Emergency SOS (SOS-01–08) | P0 | **P0-A** |
| Donor Online Status (DM-11) | P0 | **P0-A** |
| 90-Day Cooldown | P0 | **P0-A** |
| JWT Auth & RBAC | P0 | **P0-A** |
| Hospital Verification Workflow (AP-12–14) | P0 | **P0-B** |
| Verified Hospital Badge (HM-11) | P0 | **P0-B** |
| Fraud Prevention (FS-08–10) | P0 | **P0-B** |
| Anonymous Contact / Phone Masking | P0 | **P0-B** |
| OTP Before Emergency Request (FS-09) | P0 | **P0-B** |
| Donor Reliability Score (DM-08, DM-12) | P0 | **P0-C** |
| Smart Matching Priority (SM-14) | P0 | **P0-C** |
| Live Status UI — WebSockets (RL-14) | P0 | **P0-C** |

---

## 38. v1.4 Priority Adjustments

| Feature ID | Feature | Old Priority | New Priority | Reason |
|------------|---------|-------------|-------------|--------|
| DM-11 | Donor Online Status | P1 | **P0 (P0-A)** | Critical for real-time matching — knowing if a donor is online determines notification urgency |
| NS-14 | Notification Delivery Tracking | P1 | **P0 (P0-A)** | Without delivery tracking, SMS fallback logic (NS-13) cannot function correctly |
| SOS-01–08 | Emergency SOS suite | P1 | **P0 (P0-A)** | Core life-saving feature; cannot be post-launch |
| DM-08, DM-12 | Donor Reliability Score | P1 | **P0 (P0-C)** | Required for smart matching priority ranking (SM-14) |
| HM-11 | Verified Hospital Badge | P1 | **P0 (P0-B)** | Unverified hospitals must not be able to broadcast requests |
| SM-11–14 | Matching Engine enhancements | P0 (unenforced) | **P0 (P0-A enforced)** | Marked must-build-first; no launch without working match algorithm |
| RL-09–14 | Request lifecycle additions | P0 (unenforced) | **P0 (P0-A enforced)** | Full lifecycle required; partial implementation not acceptable for launch |

---

## Appendix A — Pages Built (Web · `/app/auth/`)

| Route | Description | Status |
|-------|-------------|--------|
| `/auth/register` | Multi-field registration + T&C dialog + consent checkbox | ✅ |
| `/auth/verify-email` | 6-digit email OTP | ✅ |
| `/auth/verify-phone` | 6-digit phone OTP → permission dialogs → onboarding redirect | ✅ |
| `/auth/onboarding` | Role-branched: Donor (6 steps) / Patient (3 steps) / Hospital (5 steps) | ✅ |
| `/auth/login` | Email + password login | ✅ |
| `/auth/forgot-password` | Password reset request | ✅ |
| `/auth/reset-password` | New password form | ✅ |

---

## Appendix B — Onboarding Modification Summary (v1.3 Changes)

| Field | Old Location | New Location | Reason |
|-------|-------------|--------------|--------|
| Blood disease details (free text) | Donor onboarding Step 3 | Optional profile section | Reduce drop-off |
| Diabetes & sugar levels | Donor onboarding Step 4 | Optional profile section | Reduce drop-off |
| Weight, medications, allergies | Donor onboarding Step 6 | Post-login profile edit | Reduce drop-off |
| Blood inventory per group | Hospital onboarding Step 4 | Hospital dashboard post-login | Reduce onboarding time |
| Storage capacity | Hospital onboarding Step 4 (required) | Hospital dashboard (optional) | Not critical at signup |
| Aadhar (sole identity) | Hospital onboarding Step 1 (mandatory) | Hospital License OR Aadhar (either accepted) | More accessible for hospitals without personal Aadhar |

---

*End of Feature Requirements Document — v1.4*
