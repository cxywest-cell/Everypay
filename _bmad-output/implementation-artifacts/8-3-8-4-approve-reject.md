---
story_id: 8.3
story_key: 8-3-8-4-approve-reject
epic: 8
title: Approver Reviews, Approves or Rejects Settlement
status: review
created: 2026-04-15
source: epics.md (Stories 8.3, 8.4), prd-revised-2026-04-07.md (FR45, FR46)
---

# Story 8.3/8.4: Approver Reviews, Approves or Rejects Settlement

Status: ready-for-dev

## Story

As an approver (CFO, Treasurer, or Risk Manager),
I want to review pending settlements and approve or reject with comments,
So that my decision is recorded with rationale and the settlement proceeds or halts accordingly.

## Acceptance Criteria

**AC1: Approver Reviews Settlement**

**Given** an approver is in their approval queue
**When** they view pending settlements
**Then** the system displays: settlement ID, amount, counterparty, rate, fees, risk indicators
**And** full agreement terms, rate lock details, corridor information, attached documents

**AC2: Approve with Comments**

**Given** an approver reviews a settlement
**When** they click "Approve" and add optional comments
**Then** the system logs: APPROVED, approver ID, timestamp, comments
**And** routes to next approver in chain (if any)
**And** notifies both parties of approval progress

**AC3: Reject with Reason**

**Given** an approver reviews a settlement
**When** they click "Reject" and provide a mandatory rejection reason
**Then** the system logs: REJECTED, approver ID, timestamp, rejection reason
**And** the settlement cannot proceed
**And** both parties are notified of rejection

## Implementation Notes

- PATCH /api/approvals with { action: "approve" | "reject", comment } updates approver status
- Sequential approver enforcement: next approver only sees chain after prior approves
- Rejection at any point blocks the entire chain
- All decisions timestamped and logged for audit trail

## Files Created/Modified

- `src/app/api/approvals/route.ts` — PATCH handler for approve/reject with sequential logic
- `src/app/approvals/page.tsx` — Approve/reject UI with comment input, status updates
