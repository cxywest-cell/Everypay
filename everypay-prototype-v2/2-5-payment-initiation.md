# Story 2.5: Payment Initiation & Settlement Tracking

## Epic
2 - Documents & Review Workflow

## User Story
As a user, I want to initiate a settlement from an accepted payment agreement and track its progress through each leg so that I can monitor the conversion and transfer status.

## Acceptance Criteria
1. Settlement creation from accepted payment agreement only
2. Display settlement legs: fiat->USDT conversion, USDT->final currency, bank transfer
3. Each leg shows: amount from/to, currencies, exchange rate, fees, timestamp, failure reason
4. Overall settlement status derived from leg statuses
5. Simulated progress advancement (mock)
6. Completion date tracking

## Implementation

### Files Created
- `src/app/settlements/page.tsx` - Settlement list with status overview
- `src/app/settlements/[id]/page.tsx` - Settlement detail with leg tracking

### API Routes Updated/Created
- `POST /api/settlements` - Create settlement from accepted agreement (validates agreement status)
- `GET /api/settlements?buyerId=&sellerId=` - List settlements with filtering
- `GET /api/settlements/[id]` - Retrieve single settlement
- `POST /api/settlements/[id]` - Advance settlement to next stage (mock simulation)

### Key Features
- Settlement cards with fiat/USDT/final amounts
- Leg-by-leg progress tracking with status badges
- Simulated advancement for demo purposes
- Completion status display
- Settlement list filtering by user role

## Status
in-progress
