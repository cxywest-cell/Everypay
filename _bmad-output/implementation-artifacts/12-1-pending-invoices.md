---
story_id: 12.1
story_key: 12-1-pending-invoices
epic: 12
title: View Pending Invoices and Payment Status
status: review
created: 2026-04-15
source: epics.md (Story 12.1), prd-revised-2026-04-07.md (FR73)
---

# Story 12.1/12.2: View Pending Invoices and Running Balance

Status: ready-for-dev

## Story

As a buyer,
I want to view all pending invoices with payment status and track my running balance per seller,
So that I can manage my payment obligations and know exactly how much I owe.

## Acceptance Criteria

**AC1: Invoice List**

**Given** a buyer is on the Purchase Ledger page
**When** the page loads
**Then** the system displays all invoices where they are the buyer: invoice ID, seller, amount, due date, status
**And** status filter tabs: All, Pending (SENT), Paid (PAID), Overdue (OVERDUE)

**AC2: Balance by Seller**

**Given** a buyer views the ledger
**When** the balance summary section is displayed
**Then** the system shows per seller: total billed, total paid, outstanding balance
**And** balance color-coded: red if amount owed, green if fully paid

**AC3: Pay Now CTA**

**Given** an invoice has status SENT
**When** the buyer views the invoice row
**Then** a "Pay Now" link is displayed
**And** clicking it navigates to the payment agreement creation page with pre-filled invoice details

## Implementation Notes

- Fetches invoices filtered by `buyerId` from `/api/invoices?buyerId={userId}`
- Balance calculation: client-side reduce over invoice array (billed vs paid per seller)
- "Pay Now" links to `/payment-agreements/new?invoiceId=...&sellerId=...&buyerId=...&amount=...`
- Status colors: DRAFT=gray, SENT=blue, PAID=green, OVERDUE=red

## Files Created/Modified

- `src/app/purchase-ledger/page.tsx` — Purchase ledger with invoice list, seller balance summary, Pay Now CTA
