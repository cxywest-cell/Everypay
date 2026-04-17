---
story_id: 8.1
story_key: 8-1-8-2-approval-chain-config
epic: 8
title: Configure Approval Chain and Auto-Acceptance Thresholds
status: review
created: 2026-04-15
source: epics.md (Stories 8.1, 8.2), prd-revised-2026-04-07.md (FR8, FR9, FR42)
---

# Story 8.1/8.2: Configure Approval Chain and Auto-Acceptance Thresholds

Status: ready-for-dev

## Story

As a seller,
I want to configure an approval chain for high-value settlements and set auto-acceptance thresholds,
So that large payments require internal review while small fluctuations are handled automatically.

## Acceptance Criteria

**AC1: Approval Chain API**

**Given** `src/app/api/approvals/route.ts` exists
**When** POST called with approvers array and optional threshold
**Then** the system creates an approval chain record with ordered approvers
**And** validates each approver exists in the system
**And** returns the created chain with IDs

**AC2: Auto-Acceptance Thresholds**

**Given** an approval chain is created
**When** threshold fields are provided (rate_move_pct, amount_threshold)
**Then** the system stores auto-acceptance thresholds on the chain
**And** settlements within threshold bypass manual approval

## Implementation Notes

- API: `POST /api/approvals` creates chain, `GET /api/approvals` lists all chains, `PATCH /api/approvals` approves/rejects
- Frontend: Approvals page with chain list, create form with approver selection, approve/reject actions with comment fields
- Status badges: PENDING, APPROVED, REJECTED with color coding
- Ordered approver progression: must approve in sequence

## Files Created/Modified

- `src/app/api/approvals/route.ts` — Approval chain CRUD with approve/reject logic
- `src/app/approvals/page.tsx` — Approval chain management UI
- `src/seeds/approval_chains.json` — Seed data with sample approval chains
