---
story_id: 13.2
story_key: 13-2-aging-fx-exposure
epic: 13
title: Aging Report and FX Exposure View
status: review
created: 2026-04-15
source: epics.md (Stories 13.2, 13.3), prd-revised-2026-04-07.md (FR79, FR80, FR82-FR85)
---

# Story 13.2: Aging Report and FX Exposure View

Status: ready-for-dev

## Story

As a seller,
I want to see an aging report for receivables and my aggregated FX exposure,
So that I can identify collection risks and understand total currency exposure across open settlements.

## Acceptance Criteria

**AC1: Aging Buckets**

**Given** a seller views the Aging tab
**When** the aging report is displayed
**Then** three columns show: Current (0-30 days), 31-60 days overdue, 60+ days overdue
**And** amounts calculated from invoice dueDate vs now
**And** Current bucket: invoices not yet due or <= 0 days overdue
**And** 31-60 bucket: daysOverdue > 0 and <= 60
**And** 60+ bucket: daysOverdue > 60

**AC2: Overdue Invoice Detail**

**Given** there are OVERDUE invoices
**When** the aging report is displayed
**Then** a list of overdue invoices shows: invoice ID, buyer, days overdue, amount
**And** each row shows the calculated days overdue value

**AC3: FX Exposure**

**Given** a seller views the FX Exposure tab
**When** the FX exposure view is displayed
**Then** the system shows: per-currency exposure (BRL, ARS, USD, etc.) from open invoices
**And** total open settlement volume (USD)
**And** count of active (non-SETTLED) settlements

## Implementation Notes

- Aging: `daysOverdue = floor((now - dueDate) / (1000 * 60 * 60 * 24))`
- PAID and DRAFT invoices excluded from aging calculations
- FX exposure: `Record<string, number>` accumulator keyed by currency
- Open settlement volume: filter settlements by `status !== "SETTLED"`, sum `fiatAmount`

## Files Created/Modified

- `src/app/sales-ledger/page.tsx` — Aging report section and FX exposure section embedded
