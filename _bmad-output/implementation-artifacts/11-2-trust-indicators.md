---
story_id: 11.2
story_key: 11-2-trust-indicators
epic: 11
title: Calculate and Display Trust Indicators
status: review
created: 2026-04-15
source: epics.md (Story 11.2), prd-revised-2026-04-07.md (FR71, FR72)
---

# Story 11.2: Calculate and Display Trust Indicators

Status: ready-for-dev

## Story

As a platform,
I want to calculate and display trust indicators per counterparty,
So that both parties can make informed decisions about their trading relationships.

## Acceptance Criteria

**AC1: Trust Indicators Display**

**Given** a counterparty profile is displayed
**When** trust indicators are rendered
**Then** the system shows: total settlements (count), total volume (USD), settlement success rate (%), average delivery time (days), dispute rate (%)
**And** success rate color-coded: green >= 95%, red < 95%
**And** dispute rate color-coded: red > 5%, normal otherwise

**AC2: Risk Alert Banner**

**Given** a counterparty has success rate below 95%
**When** their detail page is viewed
**Then** a red-bordered alert banner displays: "Risk Indicator: Settlement success rate below 95%"
**And** shows calculated failed settlement count

**AC3: Interaction History**

**Given** a user views a counterparty detail page
**When** the interaction history section is displayed
**Then** the system shows a chronological timeline of recent events (settlements, agreements, invoices)
**And** each event has a type indicator (success = green dot, info = blue dot)

## Implementation Notes

- All trust indicators computed from seed data fields (no real-time calculation in prototype)
- Failed settlement count calculated as: totalSettlements - round(totalSettlements * successRate / 100)
- Interaction history: static mock array with date, event description, and type
- Last interaction date from counterparty.lastInteractionAt field

## Files Created/Modified

- `src/app/counterparties/[id]/page.tsx` — Trust indicators grid, risk banner, interaction timeline
- `src/app/counterparties/page.tsx` — Trust indicators in list cards with conditional coloring
