# Story 5.1-5.2: Propose and Lock PRELOCK Rate

## Epic
5 - Rate Management (PRELOCK)

## User Story
As a seller or buyer, I want to propose a PRELOCK exchange rate and lock it upon payment confirmation, so that the rate is guaranteed for this settlement.

## Acceptance Criteria
1. Rate proposal form with market rate reference
2. 5% deviation validation from market rate
3. Fee breakdown preview (FX Fee, Platform Fee, Corridor Fee)
4. Rate locked when buyer confirms payment (status: LOCKED)
5. RATE_LOCKED event logged with timestamp and rate value

## Implementation

### Files (Already Created in Epic 2)
- `src/app/payment-agreements/new/page.tsx` - Rate proposal with fee calculation
- `src/app/api/payment-agreements/route.ts` - POST creates agreement with 5% validation
- `src/app/api/payment-agreements/[id]/route.ts` - PATCH for accept/counter/reject
- `src/app/api/rate-locks/[settlementId]/route.ts` - POST creates rate lock on settlement

## Status
done
