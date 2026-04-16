# Story 4.3-4.5: Receipt Confirmation, Corridor Format, Documents

## Epic
4 - Settlement Tracking

## User Story
As a seller, I want to confirm USD/HKD receipt and view documents attached to settlement, so that I can verify completion and contractual documentation.

## Acceptance Criteria
1. Seller confirms receipt to mark settlement SETTLED
2. Settlement amounts displayed in corridor-appropriate format (BRL: R$ 1.234,56, ARS: $ 1.234,56, USD: $1,234.56, HKD: HK$ 1,234.56)
3. Compliance notation displayed (BCB compliant, BCRA Res. 8430/2020)
4. Document viewer: invoice, payment agreement, evidence pack availability
5. JetBrains Mono font for all amounts/rates/IDs

## Implementation

### Files Created
- `src/lib/corridorFormat.ts` - Corridor formatting helper (formatCorridorAmount, getCorridorComplianceNotation)

### Files Updated
- `src/app/settlements/page.tsx` - Uses corridor formatting for amounts
- `src/app/settlements/[id]/page.tsx` - Adds rate lock section, corridor formatting, document links, compliance notation

## Status
done
