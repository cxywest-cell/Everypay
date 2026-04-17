---
story_id: 1.3
story_key: 1-3-business-entity-kyb-verification-with-beneficial-ownership
epic: 1
title: Business Entity KYB Verification with Beneficial Ownership
status: review
created: 2026-04-14
source: epics.md (Story 1.3)
---

# Story 1.3: Business Entity KYB Verification with Beneficial Ownership

Status: review

## Story

As a business administrator,
I want to register my company and declare beneficial ownership,
So that my business can operate on the Everypay platform with proper verification.

## Acceptance Criteria

**AC1: Multi-Step KYB Flow**

**Given** a user with verified individual KYC
**When** they initiate KYB for their business entity
**Then** the system presents KYB flow: Business Details → Authorized Signatories → Beneficial Owners → Business Activity Declaration

**AC2: Business Registration Documents**

**Given** the user submits business registration documents (certificate of incorporation, articles of association)
**When** the documents are uploaded and validated
**Then** the system stores them securely
**And** logs the submission with timestamp and document type

**AC3: Beneficial Ownership Declaration**

**Given** the user declares beneficial owners (>10% shareholders per FR2)
**When** they add each beneficial owner with ID information
**Then** the system validates each owner's identity via KYC check
**And** flags any beneficial owner that requires enhanced due diligence

**AC4: Sanctions Screening**

**Given** all beneficial owners pass sanctions screening
**When** the KYB submission is complete
**Then** the business entity status updates to "VERIFIED"
**And** the business can initiate settlement activities

**AC5: Compliance Flag**

**Given** a beneficial owner fails sanctions screening
**When** the screening results return a match
**Then** the system flags the entity for compliance review
**And** creates a compliance queue entry for Epic 10 (AML & Compliance) investigation

## Tasks / Subtasks

- [x] Task 1 (AC: 1, 2, 3, 4) — Create multi-step KYB verification page
  - [x] Step 1: Business details (company name, registration number, incorporation date/country, business type, address, tax ID, doc upload)
  - [x] Step 2: Authorized signatories (select from organization users)
  - [x] Step 3: Beneficial owners (add/remove owners with name, nationality, ownership %, ID details, DOB, address)
  - [x] Step 4: Business activity declaration (activity, sector, volume, corridor, currency, supporting doc)
  - [x] Step indicator showing progress through all 4 steps
  - [x] Completion screen with organization details
- [x] Task 2 (AC: 1, 2, 3, 4, 5) — KYB API endpoints
  - [x] GET /api/kyb/:userId — fetch existing KYB submission
  - [x] POST /api/kyb/:userId — submit/update a KYB step, auto-update organization KYB status
  - [x] Seed files: kyb_submissions.json, organizations.json
- [x] Task 3 (AC: 5) — Sanctions screening
  - [x] Mock: auto-pass sanctions screening for each beneficial owner
  - [x] Flagging logic placeholder (would integrate with Epic 10)

## Dev Agent Record

### Agent Model Used

qwen3.6-plus

### Debug Log References

- TypeScript compilation: zero errors (npm run build compiled successfully)
- Prerender warnings: expected for client-side pages using useSearchParams (/kyb)

### Completion Notes List

1. **KYB Types** — `src/lib/kybTypes.ts` with KybSubmission, BusinessDetails, BeneficialOwnerDeclaration, BusinessActivityDeclaration interfaces.
2. **KYB Seeds** — `src/seeds/kyb_submissions.json` (1 completed sample), `src/seeds/organizations.json` (2 organizations: Alpha PENDING, Beta VERIFIED).
3. **KYB API** — `src/app/api/kyb/[userId]/route.ts` with GET/POST. Updates organization KYB status and beneficial owners on completion.
4. **KYB Page** — `src/app/kyb/page.tsx` multi-step wizard with business details form, signatory selection, dynamic beneficial owner add/remove, and business activity declaration.

### File List

- `src/lib/kybTypes.ts` — KYB domain types
- `src/seeds/kyb_submissions.json` — KYB submission seed data
- `src/seeds/organizations.json` — Organization seed data
- `src/app/api/kyb/[userId]/route.ts` — GET/POST KYB endpoints
- `src/app/kyb/page.tsx` — Multi-step KYB verification page
