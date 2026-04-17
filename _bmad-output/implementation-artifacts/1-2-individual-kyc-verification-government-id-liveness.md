---
story_id: 1.2
story_key: 1-2-individual-kyc-verification-government-id-liveness
epic: 1
title: Individual KYC Verification (Government ID + Liveness)
status: review
created: 2026-04-14
source: epics.md (Story 1.2)
---

# Story 1.2: Individual KYC Verification (Government ID + Liveness)

Status: review

## Story

As an individual user,
I want to submit my government-issued ID and complete a liveness check,
So that I can verify my identity to meet regulatory requirements.

## Acceptance Criteria

**AC1: Multi-Step KYC Flow**

**Given** a registered user with verified email
**When** they initiate KYC individual verification
**Then** the system presents a step-by-step flow: ID Upload → Liveness Check → Address Verification → Sanctions Screening

**AC2: ID Document Upload**

**Given** the user uploads a government-issued ID (passport, national ID, or driver's license)
**When** the document details are submitted
**Then** the system stores the document reference securely
**And** logs the upload timestamp, document type, and storage reference
**And** KYC status progresses to DOCUMENTS_UNDER_REVIEW

**AC3: Liveness Check**

**Given** the user completes the liveness check (selfie + random action verification)
**When** the liveness check passes
**Then** the system marks liveness as verified
**And** the KYC status progresses

**AC4: Address Verification**

**Given** the user provides their residential address
**When** the address details are submitted
**Then** the system records the address and proof document reference

**AC5: Sanctions Screening**

**Given** all KYC documents are submitted and pass automated screening
**When** sanctions screening completes (per FR52 and NFR8)
**Then** the KYC status updates to "VERIFIED"
**And** the user gains access to full platform features

**AC6: Login Redirect**

**Given** a user logs in with KYC status PENDING
**When** they sign in
**Then** they are redirected to the KYC verification flow
**And** cannot access the dashboard until verified

## Tasks / Subtasks

- [x] Task 1 (AC: 1, 2, 3, 4, 5) — Create multi-step KYC verification page
  - [x] Step 1: ID Document upload (type selector, document number, nationality, expiry date, file upload UI)
  - [x] Step 2: Liveness check (selfie capture UI with tips)
  - [x] Step 3: Address verification (full address form + proof upload UI)
  - [x] Step 4: Sanctions screening (auto-complete with loading animation)
  - [x] Step indicator showing progress through all 4 steps
  - [x] Completion screen with redirect to dashboard
- [x] Task 2 (AC: 1, 2, 3, 4, 5) — KYC API endpoints
  - [x] GET /api/kyc/:userId — fetch existing KYC submission
  - [x] POST /api/kyc/:userId — submit/update a KYC step
  - [x] Seed file for KYC submissions
- [x] Task 3 (AC: 6) — Update login redirect logic
  - [x] PENDING users redirect to /kyc
  - [x] VERIFIED users redirect to dashboard
  - [x] DOCUMENTS_UNDER_REVIEW/FLAGGED users see status message

## Dev Agent Record

### Agent Model Used

qwen3.6-plus

### Debug Log References

- TypeScript compilation: zero errors (npm run build compiled successfully)
- Prerender warnings: expected for client-side pages using useSearchParams (/login, /kyc)

### Completion Notes List

1. **KYC Types** — `src/lib/kycTypes.ts` with KYCDocument, LivenessCheck, AddressVerification, KycSubmission interfaces.
2. **KYC Seed** — `src/seeds/kyc_submissions.json` with one completed sample submission.
3. **KYC API** — `src/app/api/kyc/[userId]/route.ts` with GET (fetch submission) and POST (submit step, auto-update user KYC status).
4. **KYC Page** — `src/app/kyc/page.tsx` multi-step wizard with step indicator, form validation, mock file upload UI, sanctions screening animation, and completion screen.
5. **Login Update** — Updated login redirect: PENDING → /kyc, VERIFIED → /, other statuses → status message.

### File List

- `src/lib/kycTypes.ts` — KYC domain types
- `src/seeds/kyc_submissions.json` — KYC submission seed data
- `src/app/api/kyc/[userId]/route.ts` — GET/POST KYC endpoints
- `src/app/kyc/page.tsx` — Multi-step KYC verification page
- `src/app/(auth)/login/page.tsx` — Updated redirect logic for KYC status
