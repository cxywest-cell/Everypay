# Story 3.2-3.4: Settlement Leg Processing (Fiat->USDT->USD/HKD->Transfer)

## Epic
3 - Settlement Engine (MVP)

## User Story
As the platform, I want to process each settlement leg (fiat conversion, USDT transfer, offshore delivery) so that funds flow from buyer to seller through the settlement chain.

## Acceptance Criteria
1. Each leg progresses through defined status sequence
2. Leg 1: INITIATED -> FIAT_RECEIVED -> USDT_CONFIRMED -> FIAT_TO_USDT_COMPLETE
3. Leg 2: INITIATED -> USDT_TO_FIAT_IN_PROGRESS -> FIAT_CONVERSION_CONFIRMED -> USD_HKD_READY
4. Overall settlement status derived from most advanced leg
5. Settlement marked SETTLED when all legs complete
6. T+0 verification for USDT conversion (compensation clause if delayed)

## Implementation

### Files Created/Updated
- `src/app/api/settlements/[id]/route.ts` - POST advances settlement to next stage (mock)
- `src/app/api/rate-locks/[settlementId]/route.ts` - GET/POST/PATCH for rate lock management

### Key Features
- Settlement leg advancement with status sequence
- Automatic status calculation from leg states
- Completion date tracking
- Failure reason logging per leg

## Status
done
