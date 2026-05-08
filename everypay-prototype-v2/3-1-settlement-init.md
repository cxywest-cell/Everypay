# Story 3.1: Initialize Settlement on Payment Confirmation

## Epic
3 - Settlement Engine (MVP)

## User Story
As the platform, I want to initialize a settlement record when buyer confirms payment, so that the settlement can be tracked through all conversion legs.

## Acceptance Criteria
1. Settlement created from accepted payment agreement only
2. Settlement record includes: ID, buyer/seller IDs, agreement ID, locked rate, amounts
3. First settlement leg (fiat deposit) created with status INITIATED
4. Rate lock record created linking settlement to invoice
5. Payment agreement status updated to reflect settlement initiated
6. Audit log entry SETTLEMENT_INITIATED created

## Implementation

### Files Updated
- `src/app/api/settlements/route.ts` - POST creates settlement + rate lock record, updates agreement

### Key Features
- Validates agreement is ACCEPTED before allowing settlement
- Auto-calculates USDT amount from locked rate
- Creates 2 settlement legs: fiat->USDT and USDT->final currency
- Creates corresponding rate lock record
- Links settlement to invoice via rate lock

## Status
done
