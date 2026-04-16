# Story 4.1-4.2: View Real-Time Settlement Status and Chain

## Epic
4 - Settlement Tracking

## User Story
As either buyer or seller, I want to view real-time settlement status through the entire settlement chain, so that I know exactly where my payment is at any moment.

## Acceptance Criteria
1. Settlement list showing all settlements with status badges
2. Settlement detail view with full chain visualization
3. Each leg shows: amount from/to, currencies, exchange rate, fees, timestamp
4. Progress indicator for in-progress settlements
5. Responsive layout for mobile (Carlos) and desktop (Wei)

## Implementation

### Files Created/Updated
- `src/app/settlements/page.tsx` - Settlement list with corridor-formatted amounts
- `src/app/settlements/[id]/page.tsx` - Settlement detail with rate lock, legs, documents

### Key Features
- Corridor-formatted amounts using formatCorridorAmount helper
- Rate lock section with expiry status
- Leg-by-leg breakdown with conversion details
- Document links (invoice, payment agreement, evidence pack)
- Simulated advancement for demo purposes

## Status
done
