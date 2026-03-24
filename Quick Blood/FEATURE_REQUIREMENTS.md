# Quick Blood - Feature Requirements Document (FRD)

**Project:** Quick Blood
**Version:** 1.0
**Date:** 2026-03-23
**Status:** Draft

---

## Table of Contents

1. [Core Modules (Defined in Scope)](#1-core-modules)
2. [Additional Features](#2-additional-features)
3. [Feature Priority Matrix](#3-feature-priority-matrix)

---

## 1. Core Modules

### 1.1 User / Donor Module

| Feature ID | Feature | Description |
|------------|---------|-------------|
| UM-01 | Donor Registration | Name, Age, Blood Group, Location, Phone, Email |
| UM-02 | Availability Toggle | Donor can mark themselves Available / Not Available |
| UM-03 | Last Donation Date | Track and display last donation date (90-day cooldown logic) |
| UM-04 | Profile Management | Edit personal details, blood group, contact info |
| UM-05 | Donation History | View all past donations logged by the donor |

---

### 1.2 Hospital / Requester Module

| Feature ID | Feature | Description |
|------------|---------|-------------|
| HR-01 | Hospital Registration | Name, Address, License Number, Contact Details |
| HR-02 | Create Blood Request | Blood group, units, location, urgency level |
| HR-03 | Urgency Levels | Normal / Emergency classification per request |
| HR-04 | Request Tracking | View status: Open / In Progress / Fulfilled / Closed |
| HR-05 | Requester Login | Secure login for hospital staff |

---

### 1.3 Search & Matching Engine

| Feature ID | Feature | Description |
|------------|---------|-------------|
| SM-01 | Blood Group Filter | Search donors by blood group |
| SM-02 | Distance-Based Search | Nearby donors using radius (e.g., within 10 km) |
| SM-03 | Availability Filter | Show only available donors |
| SM-04 | Emergency Priority | Emergency requests surface matching donors first |
| SM-05 | Sort by Distance | Closest donors appear first |
| SM-06 | Sort by Last Donation | Donors eligible to donate again sorted by priority |

---

### 1.4 Notification System

| Feature ID | Feature | Description |
|------------|---------|-------------|
| NS-01 | SMS Notification | Notify donors via SMS when a nearby request is raised |
| NS-02 | Email Notification | Email alert to donors for blood requests |
| NS-03 | Push Notification | In-app push notification (mobile / web) |
| NS-04 | Emergency Alert | Urgent message: "Urgent blood needed near you" |
| NS-05 | Request Status Update | Notify requester when a donor responds |

---

### 1.5 Location Services

| Feature ID | Feature | Description |
|------------|---------|-------------|
| LS-01 | GPS Location | Auto-detect user location via GPS |
| LS-02 | Pincode / City Input | Manual location entry by pincode or city name |
| LS-03 | Radius-Based Search | Define and filter by search radius (5/10/25/50 km) |

---

### 1.6 Authentication & Security

| Feature ID | Feature | Description |
|------------|---------|-------------|
| AS-01 | Signup / Login | Email & password based auth |
| AS-02 | JWT Auth | Token-based session management |
| AS-03 | Role-Based Access Control | Roles: Donor, Hospital, Admin |
| AS-04 | Password Reset | Forgot password via email OTP |

---

### 1.7 Admin Panel

| Feature ID | Feature | Description |
|------------|---------|-------------|
| AP-01 | User Management | View, suspend, or remove donor accounts |
| AP-02 | Hospital Management | Approve/reject hospital registrations |
| AP-03 | Request Monitoring | View all active and past requests |
| AP-04 | Spam/Fake Account Removal | Flag and remove fraudulent accounts |
| AP-05 | Analytics Dashboard | Total donors, active donors, requests fulfilled |

---

## 2. Additional Features

> Features beyond the original scope — recommended for a complete, production-ready platform.

---

### 2.1 Donor Verification & Trust System

| Feature ID | Feature | Description |
|------------|---------|-------------|
| DV-01 | Phone OTP Verification | Verify donor phone number at registration |
| DV-02 | ID Upload | Optional Aadhaar / National ID upload for trust badge |
| DV-03 | Verified Badge | Display a "Verified Donor" badge on profile |
| DV-04 | Blood Group Certificate Upload | Upload proof of blood group (lab report) |
| DV-05 | Donor Rating System | Hospitals can rate donors after donation |
| DV-06 | Donor Reliability Score | Auto-calculated score based on response rate, history |

---

### 2.2 Blood Bank Integration

| Feature ID | Feature | Description |
|------------|---------|-------------|
| BB-01 | Blood Bank Registry | Maintain a list of nearby blood banks with stock info |
| BB-02 | Real-Time Stock Status | Show available units per blood group at each blood bank |
| BB-03 | Redirect to Blood Bank | If no donor found, redirect to nearest stocked blood bank |
| BB-04 | Blood Bank Portal | Blood banks can log in and update their inventory |

---

### 2.3 Donation Camp / Drive Management

| Feature ID | Feature | Description |
|------------|---------|-------------|
| DC-01 | Camp Registration | Hospitals/NGOs can register blood donation camps |
| DC-02 | Camp Discovery | Donors can browse and register for upcoming camps |
| DC-03 | Camp Reminders | Notify registered donors before the camp date |
| DC-04 | Bulk Donation Tracking | Record multiple donations collected at a camp |

---

### 2.4 Donor Rewards & Gamification

| Feature ID | Feature | Description |
|------------|---------|-------------|
| RG-01 | Donation Points | Earn points per confirmed donation |
| RG-02 | Badges & Achievements | Milestone badges (1st, 5th, 10th donation etc.) |
| RG-03 | Leaderboard | City/district level top donor leaderboard |
| RG-04 | Partner Discounts | Tie-ups with pharmacies/clinics for donor perks |
| RG-05 | Certificate of Donation | Auto-generated downloadable donation certificate |

---

### 2.5 Emergency SOS Feature

| Feature ID | Feature | Description |
|------------|---------|-------------|
| SOS-01 | One-Tap SOS Request | Patient/family can raise an emergency request instantly |
| SOS-02 | Broadcast to All Nearby Donors | Auto-blast notification to all eligible nearby donors |
| SOS-03 | SOS Escalation | If no response in X minutes, widen search radius automatically |
| SOS-04 | SOS Tracking | Real-time status — how many donors notified, how many responded |

---

### 2.6 In-App Messaging & Communication

| Feature ID | Feature | Description |
|------------|---------|-------------|
| CM-01 | Donor-Requester Chat | In-app messaging between matched donor and hospital |
| CM-02 | Message Templates | Pre-set messages for coordination (e.g., ETA, confirmation) |
| CM-03 | Anonymous Contact | Mask phone numbers until both parties confirm intent |
| CM-04 | Call Masking | Proxy call so donor number is not directly exposed |

---

### 2.7 Medical Safety & Health Tracking

| Feature ID | Feature | Description |
|------------|---------|-------------|
| MH-01 | 90-Day Cooldown Enforcement | Block donor from appearing in search within 90 days of last donation |
| MH-02 | Health Questionnaire | Pre-donation eligibility checklist (illness, travel, medication) |
| MH-03 | Medical Condition Flag | Donors can flag temporary unavailability due to health reasons |
| MH-04 | Age Restriction Enforcement | Only users 18-65 can register as active donors |
| MH-05 | Weight Check Reminder | Prompt to confirm weight eligibility (min 50 kg) |

---

### 2.8 Multi-Platform Support

| Feature ID | Feature | Description |
|------------|---------|-------------|
| MP-01 | Web App | Responsive web application (React / Next.js) |
| MP-02 | Android App | Native or React Native Android application |
| MP-03 | iOS App | Native or React Native iOS application |
| MP-04 | PWA Support | Progressive Web App for offline access and install-on-device |
| MP-05 | USSD / SMS Fallback | Basic feature-phone support via USSD for rural areas |

---

### 2.9 Multilingual & Accessibility

| Feature ID | Feature | Description |
|------------|---------|-------------|
| ML-01 | Multiple Languages | Support regional languages (Hindi, Tamil, Bengali, etc.) |
| ML-02 | RTL Support | Right-to-left layout for Urdu/Arabic |
| ML-03 | Screen Reader Support | WCAG 2.1 AA accessibility compliance |
| ML-04 | Large Font Mode | Accessibility option for visually impaired users |

---

### 2.10 Social Sharing & Community

| Feature ID | Feature | Description |
|------------|---------|-------------|
| SC-01 | Share Request on Social Media | One-click share blood request to WhatsApp, Facebook, Twitter |
| SC-02 | Referral System | Donors can invite friends; earn bonus points on referral sign-up |
| SC-03 | Public Donor Wall | Opt-in public wall showing top donors in a city |
| SC-04 | NGO / Organization Accounts | NGOs can manage a group of volunteer donors |

---

### 2.11 Advanced Analytics & Reporting

| Feature ID | Feature | Description |
|------------|---------|-------------|
| AN-01 | Demand Heatmap | Visual map of blood demand hotspots by city/region |
| AN-02 | Blood Group Shortage Alerts | Notify admin when a blood group has critically low donor count |
| AN-03 | Request Fulfillment Rate | % of requests fulfilled within SLA (e.g., within 2 hours) |
| AN-04 | Donor Engagement Report | Active vs inactive donors over time |
| AN-05 | Export Reports | Admin can export data as CSV / PDF |

---

### 2.12 API & Third-Party Integrations

| Feature ID | Feature | Description |
|------------|---------|-------------|
| INT-01 | Google Maps API | Map display, distance calculation, geocoding |
| INT-02 | Twilio / MSG91 | SMS and call masking integration |
| INT-03 | Firebase Cloud Messaging | Push notifications for mobile |
| INT-04 | SendGrid / Mailgun | Transactional email service |
| INT-05 | Hospital EHR Integration | Optional plug-in to connect with hospital management systems |
| INT-06 | Government Blood Bank API | Integrate with national e-Raktkosh or similar APIs |

---

### 2.13 Feedback & Support

| Feature ID | Feature | Description |
|------------|---------|-------------|
| FS-01 | Donation Confirmation | Hospital confirms donation was received (closes loop) |
| FS-02 | Post-Donation Feedback | Both donor and hospital submit feedback after donation |
| FS-03 | Report a User | Flag suspicious or abusive accounts |
| FS-04 | In-App Help Center | FAQ and guided help articles |
| FS-05 | Support Ticket System | Raise a support issue; admin responds from panel |

---

### 2.14 Offline & Resilience Features

| Feature ID | Feature | Description |
|------------|---------|-------------|
| OR-01 | Offline Donor List Cache | Cache nearby donors for viewing without internet |
| OR-02 | SMS-Based Request Fallback | Accept requests via SMS if app is unavailable |
| OR-03 | Low-Bandwidth Mode | Reduced data mode for slow network areas |

---

## 3. Feature Priority Matrix

| Priority | Label | Meaning |
|----------|-------|---------|
| P0 | Must Have | App cannot launch without this |
| P1 | Should Have | High value, include in v1 if possible |
| P2 | Nice to Have | Phase 2 / post-launch |
| P3 | Future | Long-term roadmap |

| Feature Group | Priority |
|---------------|----------|
| User/Donor Module | P0 |
| Hospital Module | P0 |
| Search & Matching | P0 |
| Authentication & Security | P0 |
| Location Services | P0 |
| Notifications (SMS + Push) | P0 |
| Admin Panel | P0 |
| Phone OTP Verification | P0 |
| 90-Day Cooldown Enforcement | P0 |
| Emergency SOS | P1 |
| Blood Bank Integration | P1 |
| In-App Messaging | P1 |
| Medical Safety Checks | P1 |
| Social Sharing | P1 |
| Feedback & Support | P1 |
| Donor Rewards & Gamification | P2 |
| Donation Camps | P2 |
| Advanced Analytics | P2 |
| Multilingual Support | P2 |
| Multi-Platform (Mobile Apps) | P2 |
| NGO / Organization Accounts | P2 |
| EHR / Govt API Integration | P3 |
| USSD / SMS Fallback | P3 |
| Offline & Resilience | P3 |

---

*End of Feature Requirements Document*
