---
story_id: 11.1
story_key: 11-1-counterparty-list
epic: 11
title: View Counterparty List with Trust Indicators
status: review
created: 2026-04-15
source: epics.md (Story 11.1), prd-revised-2026-04-07.md (FR69, FR70, FR71)
---

# Story 11.1/11.2: View Counterparty List with Trust Indicators

Status: ready-for-dev

## Story

As a seller or buyer,
I want to view my trading partners with trust indicators and risk flags,
So that I can assess the reliability of my counterparties before engaging in new settlements.

## Acceptance Criteria

**AC1: Counterparty List**

**Given** a user is on the counterparties page
**When** the page loads
**Then** the system displays all trading partners with: company name, role (buyer/seller), total settlements, volume, success rate, dispute rate
**And** filter tabs for: All, Buyers, Sellers

**AC2: Risk Highlighting**

**Given** a counterparty has settlement success rate below 95%
**When** their card is displayed
**Then** a "High Risk" badge is shown in red
**And** the success rate is displayed in red with "Below 95% threshold" note

**AC3: Counterparty Detail**

**Given** a user clicks on a counterparty card
**When** they navigate to the detail page
**Then** the system displays: full trust indicators grid (settlements, volume, success rate, avg delivery, dispute rate)
**And** risk alert banner if success rate below 95% with failed settlement count
**And** interaction history timeline with recent events

## Implementation Notes

- Counterparty data from `/api/counterparties` seed file
- Risk threshold hardcoded at 95% success rate
- Detail page uses URL param `/counterparties/[id]` with client-side filtering from API
- Interaction history: hardcoded mock events for demo (settlements, agreements, invoices)
- Trust indicators grid: 4-column layout on desktop, 2-column on mobile

## Files Created/Modified

- `src/app/counterparties/page.tsx` — Counterparty list with filters and risk badges
- `src/app/counterparties/[id]/page.tsx` — Detail view with trust metrics and interaction history
- `src/seeds/counterparties.json` — Updated seed data with 3 counterparties including high-risk demo
