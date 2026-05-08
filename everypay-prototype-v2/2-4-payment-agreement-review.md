# Story 2.4: Payment Agreement Review & Rate Negotiation

## Epic
2 - Documents & Review Workflow

## User Story
As a buyer, I want to review a payment agreement with proposed exchange rate, fees, and respond with accept/counter/reject so that I can negotiate settlement terms.

## Acceptance Criteria
1. Display agreement details: proposed rate, market rate, deviation percentage
2. Show fee breakdown: FX Fee, Platform Fee, Corridor Fee, Total
3. Three response actions: Accept, Counter-Propose, Reject
4. Counter-proposal allows entering a new rate (within 5% deviation)
5. 48-hour expiry check
6. When accepted, prompt to initiate settlement
7. Visual status indicators: PROPOSED (blue), ACCEPTED (green), COUNTER_PROPOSED (yellow), REJECTED (red)

## Implementation

### Files Created
- `src/app/payment-agreements/new/page.tsx` - Create payment agreement with rate proposal
- `src/app/payment-agreements/[id]/review/page.tsx` - Review/respond to payment agreement

### API Routes (Previously Created)
- `POST /api/payment-agreements` - Create agreement with 5% rate deviation validation, 48h expiry
- `GET /api/payment-agreements/[id]` - Retrieve single agreement
- `PATCH /api/payment-agreements/[id]` - Accept, counter-propose (with newRate), or reject

### Key Features
- Rate proposal form with live fee calculation
- Market rate comparison with deviation warning
- Review page with full fee breakdown
- Accept/Counter/Reject workflow
- Settlement initiation CTA after acceptance

## Status
in-progress
