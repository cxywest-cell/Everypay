---
story_id: 12.2
story_key: 12-2-running-balance
epic: 12
title: Track Outgoing Payments and Running Balance per Seller
status: review
created: 2026-04-15
source: epics.md (Story 12.2), prd-revised-2026-04-07.md (FR74, FR75)
---

# Story 12.2: Track Outgoing Payments and Running Balance per Seller

Status: ready-for-dev

## Story

As a buyer,
I want to track all my outgoing payments across BRL and ARS corridors with a running balance per seller,
So that I know exactly how much I owe versus how much I have paid.

## Acceptance Criteria

**AC1: Running Balance Calculation**

**Given** a buyer has multiple invoices from the same seller
**When** the balance summary is displayed
**Then** the system calculates: total billed = sum of all invoice amounts, total paid = sum of PAID invoice amounts, balance = billed - paid
**And** balance displayed in red if positive (amount still owed), green if zero

**AC2: Empty State**

**Given** a buyer has no invoices matching the current filter
**When** the invoice list is empty
**Then** the system displays an appropriate empty state message
**And** for SENT filter: "No pending invoices"
**And** for All filter: "No invoices found"

## Implementation Notes

- Balance calculation uses Record<string, { billed: number; paid: number }> accumulator
- All computation done client-side from fetched invoice data
- No separate API endpoint needed for balance aggregation in prototype

## Files Created/Modified

- `src/app/purchase-ledger/page.tsx` — Balance by seller summary section embedded
