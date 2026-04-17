---
story_id: 13.1
story_key: 13-1-outstanding-invoices
epic: 13
title: View Outstanding Invoices and Collection Status
status: review
created: 2026-04-15
source: epics.md (Story 13.1), prd-revised-2026-04-07.md (FR77, FR78)
---

# Story 13.1/13.2: View Outstanding Invoices, Aging Report, and FX Exposure

Status: ready-for-dev

## Story

As a seller,
I want to view outstanding invoices, an aging report for receivables, and my FX exposure,
So that I can track collection status, identify risks, and understand currency exposure.

## Acceptance Criteria

**AC1: Invoice List (Invoices Tab)**

**Given** a seller is on the Sales Ledger page
**When** they view the Invoices tab
**Then** the system displays all invoices where they are the seller: invoice ID, buyer, amount, status
**And** filter tabs: All, Outstanding (SENT), Paid (PAID), Overdue (OVERDUE)
**And** status badges color-coded per invoice state

**AC2: Balance by Buyer**

**Given** a seller views the Invoices tab
**When** there are invoices from multiple buyers
**Then** the system shows a "Balance by Buyer" summary: per buyer total billed, total received, outstanding
**And** outstanding amount color-coded: amber if owed, green if fully paid

**AC3: Aging Report Tab**

**Given** a seller switches to the Aging tab
**When** the aging report is displayed
**Then** the system shows three buckets: Current (0-30 days), 31-60 days overdue, 60+ days overdue
**And** each bucket shows the total amount for that category
**And** overdue invoice list with days overdue calculation
**And** color-coded: green (current), amber (31-60d), red (60+d)

**AC4: FX Exposure Tab**

**Given** a seller switches to the FX Exposure tab
**When** the FX exposure view is displayed
**Then** the system shows open invoice amounts grouped by currency
**And** total open settlement volume and count of active settlements

## Implementation Notes

- Three-tab interface: Invoices, Aging Report, FX Exposure
- Aging calculation: compare invoice dueDate against current date, compute days overdue
- FX exposure: group non-PAID, non-DRAFT invoices by currency, sum amounts
- Open settlement volume: sum fiatAmount from settlements where status != "SETTLED"
- Buyer context from `useSearchParams` userId (defaults to user-2/Wei)

## Files Created/Modified

- `src/app/sales-ledger/page.tsx` — Sales ledger with three-tab interface (invoices/aging/FX)
