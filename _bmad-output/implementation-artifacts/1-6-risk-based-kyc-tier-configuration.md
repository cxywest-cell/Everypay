---
story_id: 1.6
story_key: 1-6-risk-based-kyc-tier-configuration
epic: 1
title: Risk-Based KYC Tier Configuration
status: review
created: 2026-04-14
source: epics.md (Story 1.6)
---

# Story 1.6: Risk-Based KYC Tier Configuration

Status: review

## Story

As a platform administrator,
I want the system to apply risk-based KYC with different verification levels,
So that higher payment thresholds require fuller verification while low-risk users face reduced friction.

## Acceptance Criteria

**AC1: Tier Evaluation**

**Given** a user initiates a payment above the standard KYC threshold
**When** the user triggers a transaction that exceeds their current KYC tier limit
**Then** the system evaluates the user's current KYC tier against the transaction amount
**And** determines if enhanced verification is required based on configured thresholds

**AC2: Tier Limits**

**Given** a user with Tier 1 KYC (simplified) initiates a high-value payment
**When** the amount exceeds the Tier 1 limit (FR64)
**Then** the system prompts the user to complete Tier 2 or Tier 3 verification
**And** blocks the payment until required KYC is completed

**AC3: Tier Elevation**

**Given** a user completes additional KYC requirements to elevate their tier
**When** Compliance system validates the additional documents
**Then** the user's KYC tier is updated
**And** the new tier applies to all future transactions

## Tasks / Subtasks

- [x] Task 1 (AC: 1) — KYC tier types and configuration
  - [x] `src/lib/kycTierTypes.ts` — KycTierConfig, KycTierEvaluation interfaces
  - [x] Seed file: kyc_tier_configs.json (TIER_1: $10k, TIER_2: $100k, TIER_3: $1M)
- [x] Task 2 (AC: 1, 2) — Tier evaluation API
  - [x] POST /api/kyc-tiers/evaluate — checks user's tier against transaction amount
  - [x] Returns allowed/blocked status with reason and required tier
  - [x] Monthly volume check included
- [x] Task 3 (AC: 3) — Tier configuration management
  - [x] GET /api/kyc-tiers — fetch all tier configs
  - [x] PATCH /api/kyc-tiers — update tier thresholds
  - [x] Admin page at /admin/kyc-tiers with tier cards and inline editing
- [x] Task 4 (AC: 1, 2) — Tier evaluation tester
  - [x] Interactive tester on admin page to test any user/amount combination
  - [x] Shows ALLOWED or BLOCKED status with explanation

## Dev Agent Record

### Agent Model Used

qwen3.6-plus

### Debug Log References

- TypeScript compilation: zero errors (npm run build compiled successfully)
- Prerender warnings: expected for client-side pages using useSearchParams

### Completion Notes List

1. **KYC Tier Types** — `src/lib/kycTierTypes.ts` with KycTierConfig and KycTierEvaluation interfaces.
2. **Tier Config Seed** — `src/seeds/kyc_tier_configs.json` with 3 tiers: TIER_1 ($10k/$50k), TIER_2 ($100k/$500k), TIER_3 ($1M/$5M).
3. **Evaluate API** — `src/app/api/kyc-tiers/evaluate/route.ts` — determines if a user's KYC tier allows a given transaction amount, checks both single transaction and monthly volume limits.
4. **Config API** — `src/app/api/kyc-tiers/route.ts` — GET/PATCH for viewing and updating tier thresholds.
5. **Admin Page** — `/admin/kyc-tiers` — Tier cards with inline editing, required document display, and interactive tier evaluation tester.

### File List

- `src/lib/kycTierTypes.ts` — KYC tier domain types
- `src/seeds/kyc_tier_configs.json` — KYC tier configuration seed
- `src/app/api/kyc-tiers/route.ts` — GET/PATCH tier config endpoint
- `src/app/api/kyc-tiers/evaluate/route.ts` — POST tier evaluation endpoint
- `src/app/admin/kyc-tiers/page.tsx` — KYC tier admin page with editing and tester
