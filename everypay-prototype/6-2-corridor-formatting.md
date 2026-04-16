# Story 6.2: Display Settlement in Corridor-Appropriate Format

## Epic
6 - Corridor Operations

## User Story
As a user in a specific corridor, I want to see settlement amounts formatted according to my local conventions, so that I can easily understand the settlement details.

## Acceptance Criteria
1. BRL: R$ 1.234,56 BRL with Brazilian number format
2. ARS: $ 1.234,56 ARS with Argentine number format
3. USD: $1,234.56 USD with US format
4. HKD: HK$ 1,234.56 with HK format
5. JetBrains Mono font for all amounts
6. Compliance notation shown (BCB compliant, BCRA Res. 8430/2020)

## Implementation

### Files Created
- `src/lib/corridorFormat.ts` - formatCorridorAmount() using Intl.NumberFormat with locale-specific formatting

### Files Updated
- `src/app/settlements/page.tsx` - Uses formatCorridorAmount for all amounts
- `src/app/settlements/[id]/page.tsx` - Corridor-formatted amounts in legs and amounts sections, compliance notation in header

## Status
done
