# Story 6.1: Configure Corridor-Specific Compliance Rules

## Epic
6 - Corridor Operations

## User Story
As a platform administrator, I want the system to enforce corridor-specific compliance rules for BRL and ARS, so that each settlement meets the regulatory requirements of its corridor.

## Acceptance Criteria
1. BRL corridor: BCB payment institution authorized, CPF required, IOF tax applicable
2. ARS corridor: BCRA Res. 8430/2020, CUIL required, USDT restrictions apply
3. Compliance rules displayed on settlement detail
4. Partner API uptime tracked per corridor

## Implementation

### Files Created
- `src/seeds/corridor_configs.json` - Corridor configuration seed data (BRL, ARS)
- `src/lib/corridorFormat.ts` - Corridor formatting helper with compliance notation
- `src/app/api/corridors/route.ts` - GET list or filter by corridor

### Key Features
- Corridor config with compliance rules array
- Currency symbol and number format per corridor
- Compliance notation helper (getCorridorComplianceNotation)
- Partner API uptime percentage tracking

## Status
done
