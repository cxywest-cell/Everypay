# Story 5.3-5.4: Display Rate/Fees Upfront and Handle Expiration

## Epic
5 - Rate Management (PRELOCK)

## User Story
As a buyer, I want to see the exchange rate and all fees before confirming payment, and have the system handle rate lock expiration, so that I make informed decisions and expired rates trigger re-quote.

## Acceptance Criteria
1. Payment confirmation screen shows: locked rate, USDT amount, fee breakdown, total in local currency
2. JetBrains Mono font for all amounts
3. Rate lock expiry: 0-44h active (green), 44-48h warning (amber), 48h+ expired (re-quote)
4. When rate expires, settlement cannot proceed with expired rate
5. Both parties notified of expiry

## Implementation

### Files Created/Updated
- `src/app/api/rate-locks/[settlementId]/route.ts` - PATCH checks expiry, returns hoursRemaining and state
- `src/app/settlements/[id]/page.tsx` - Rate lock section with expiry status badge

### Key Features
- Rate lock info display: locked rate, market at lock, expiry date
- Expiry state: ACTIVE (green), WARNING (amber, <4h remaining), EXPIRED (red)
- Hours remaining countdown display
- Fee breakdown in payment agreement creation

## Status
done
