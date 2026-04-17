---
story_id: 10.1
story_key: 10-1-sanctions-screening
epic: 10
title: Sanctions Screening and KYC Record Retention
status: review
created: 2026-04-15
source: epics.md (Stories 10.1, 10.2), prd-revised-2026-04-07.md (FR52, FR55, NFR8, NFR12)
---

# Story 10.1/10.2: Sanctions Screening and KYC Record Retention

Status: ready-for-dev

## Story

As a platform,
I want to screen users against sanctions lists and maintain KYC/KYB records per regulatory requirements,
So that we comply with AML/CTF regulations and can produce audit-ready records when requested.

## Acceptance Criteria

**AC1: Sanctions Screening UI**

**Given** a compliance officer is on the compliance page
**When** they enter a name and click "Screen"
**Then** the system screens against: OFAC SDN, UN Sanctions, EU Sanctions, Local Jurisdiction
**And** displays per-list results with clear/flagged status
**And** names containing "sanctioned" trigger a flag (mock behavior)

**AC2: KYC/KYB Record Retention**

**Given** a compliance officer views KYC records
**When** they access the retention section
**Then** the system displays: user ID, KYC status, KYB status (if applicable), retention expiry date
**And** retention dates are set to 7 years from verification date per NFR12

**AC3: Compliance Queue**

**Given** there are flagged items requiring review
**When** a compliance officer views the queue
**Then** the system displays pending reviews with priority indicators
**And** empty state when no items need review

## Implementation Notes

- Mock sanctions screening: string matching on "sanctioned" keyword for demo
- Four sanctions lists checked: OFAC SDN, UN, EU, Local Jurisdiction
- KYC retention: 7 years from verification, shown as "Retention until: YYYY-MM-DD"
- Frontend-only page, no external API calls needed for MVP prototype

## Files Created/Modified

- `src/app/compliance/page.tsx` — Sanctions screening UI, KYC retention display, compliance queue
- `src/lib/types.ts` — ScreeningResult, KYCRecord types (if not already present)
