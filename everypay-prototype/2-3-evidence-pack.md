# Story 2.3: Evidence Pack Generation (Audit Trail)

## Epic
2 - Documents & Review Workflow

## User Story
As a compliance officer, I want to view evidence packs for completed settlements so that I can verify the audit trail is complete and tamper-evident.

## Acceptance Criteria
1. Evidence packs can be retrieved by settlement ID
2. Display all documents in the pack (order, contract, invoice, logistics, customs, supporting)
3. Show SHA-256 hash for tamper detection
4. Display retention expiry (7 years from creation per FR50)
5. Status tracking: GENERATED, DOWNLOADED, ARCHIVED

## Implementation

### API Routes (Previously Created)
- `GET /api/evidence-packs/[settlementId]` - Retrieve evidence pack for a settlement

### Key Features
- Document list with type categorization
- Hash verification display
- Retention period tracking
- Status management

## Status
pending
