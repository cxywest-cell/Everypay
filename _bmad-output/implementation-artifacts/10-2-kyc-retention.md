---
story_id: 10.2
story_key: 10-2-kyc-retention
epic: 10
title: KYC/KYB Record Retention Display
status: review
created: 2026-04-15
source: epics.md (Story 10.2), prd-revised-2026-04-07.md (FR55, NFR12)
---

# Story 10.2: KYC/KYB Record Retention Display

Status: ready-for-dev

## Story

As a compliance officer,
I want to view KYC/KYB record retention status for all users,
So that I can verify regulatory retention requirements are met and produce records when requested.

## Acceptance Criteria

**AC1: Retention Record Display**

**Given** a compliance officer views the retention section
**When** user records are displayed
**Then** each entry shows: user ID, KYC status (VERIFIED), KYB status (if applicable), retention expiry date
**And** retention dates calculated as verification_date + 7 years

**AC2: Compliance Queue**

**Given** there are no items requiring review
**When** the compliance queue is displayed
**Then** an empty state message confirms no pending reviews

## Implementation Notes

- Mock data hardcoded for 3 sample users (Carlos, Wei, CFO)
- Retention dates: 2033-04-15, 2033-03-15, 2033-04-01 (7 years from verification)
- Static display, no CRUD operations in prototype

## Files Created/Modified

- `src/app/compliance/page.tsx` — KYC retention section embedded in compliance page
