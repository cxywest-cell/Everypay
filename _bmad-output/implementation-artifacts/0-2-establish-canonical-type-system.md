---
story_id: 0.2
story_key: 0-2-establish-canonical-type-system
epic: 0
title: Establish Canonical Type System (types.ts)
status: review
created: 2026-04-14
source: epics.md (Story 0.2), architecture-revised-2026-04-07.md (ARCH-5, ARCH-7), ux-design-specification.md (UX-6)
---

# Story 0.2: Establish Canonical Type System (types.ts)

Status: review

## Story

As a developer,
I want all domain types defined in a single `src/lib/types.ts` file,
So that every component and API route shares the same type definitions.

## Acceptance Criteria

**AC1: Domain Types Defined**

**Given** the project has `src/lib/types.ts`
**When** domain types are defined
**Then** the file exports: `User`, `Organization`, `Role`, `Invoice`, `InvoiceLineItem`, `Settlement`, `SettlementLeg`, `TradePaymentAgreement`, `RateLock`, `EvidencePack`, `Counterparty`, `ApprovalChain`, `AuditLog`, `Corridor`, `KYCStatus`, `KYBStatus`, `InvoiceTemplate`, `Notification`

**AC2: API Response Types Defined**

**Given** each domain type is defined
**When** API response types are created
**Then** the file exports: `SettlementResponse`, `InvoiceResponse`, `RateLockResponse`, `EvidencePackResponse`, `CounterpartyResponse`, `ApprovalResponse`
**And** each response type includes a `status` field matching the domain entity states

**AC3: TypeScript Strict Mode Passes**

**Given** the type system is complete
**When** TypeScript compilation runs
**Then** `tsc --noEmit` passes with zero errors in strict mode
**And** no `any` types exist in `types.ts`

**AC4: Settlement Status Enum**

**Given** the `Settlement` type is defined
**When** settlement status enum is created
**Then** it includes: `INITIATED`, `FIAT_RECEIVED`, `USDT_CONFIRMED`, `FIAT_TO_USDT_COMPLETE`, `USDT_TO_FIAT_IN_PROGRESS`, `FIAT_CONVERSION_CONFIRMED`, `USD_HKD_READY`, `TRANSFER_IN_PROGRESS`, `TRANSFERRED`, `SETTLED_PENDING_CONFIRMATION`, `SETTLED`, `FAILED`, `DISPUTED`

**AC5: RateLock States Defined**

**Given** the `RateLock` type is defined
**When** rate lock states are created
**Then** it includes: `PROPOSED`, `ACCEPTED`, `LOCKED`, `EXPIRED`
**And** includes fields: `lockedRate`, `expiryAt`, `marketRateAtLock`

**AC6: InvoiceTemplate Versioning**

**Given** the `InvoiceTemplate` type is defined (per FR63)
**When** template versioning is supported
**Then** it includes: `version`, `isDefaultForBuyer`, `createdAt`, `supersededBy`

## Tasks / Subtasks

- [x] Task 1 (AC: 1, 3, 4, 5, 6) — Define all domain types and enums
  - [x] Define enums: `Role`, `KYCStatus`, `KYBStatus`, `SettlementStatus`, `RateLockStatus`
  - [x] Define core types: `User`, `Organization`, `Invoice`, `InvoiceLineItem`
  - [x] Define settlement types: `Settlement`, `SettlementLeg`, `TradePaymentAgreement`, `RateLock`
  - [x] Define supporting types: `EvidencePack`, `Counterparty`, `ApprovalChain`, `AuditLog`, `Corridor`, `InvoiceTemplate`, `Notification`
- [x] Task 2 (AC: 2) — Define API response wrapper types
  - [x] Define `SettlementResponse`, `InvoiceResponse`, `RateLockResponse`
  - [x] Define `EvidencePackResponse`, `CounterpartyResponse`, `ApprovalResponse`
- [x] Task 3 (AC: 3) — Verify strict TypeScript compilation
  - [x] Run `tsc --noEmit` and confirm zero errors
  - [x] Search for `any` in types.ts and replace with proper types

## Dev Notes

### Architecture Compliance

This story implements **ARCH-5** (Type System) and part of **ARCH-7** (4 Mandatory Conventions):

- `src/lib/types.ts` is the **single source of truth** for all domain types
- All API response types are co-located in the same file
- No `any` types allowed — every value must be explicitly typed
- This file is consumed by every future story — get it right

### Settlement Status Flow

```
INITIATED → FIAT_RECEIVED → USDT_CONFIRMED → FIAT_TO_USDT_COMPLETE
  → USDT_TO_FIAT_IN_PROGRESS → FIAT_CONVERSION_CONFIRMED → USD_HKD_READY
  → TRANSFER_IN_PROGRESS → TRANSFERRED → SETTLED_PENDING_CONFIRMATION → SETTLED
```

Error paths: Any state → `FAILED` or `DISPUTED`

### Key Domain Constraints

- **Corridor**: MVP supports `BRL` (Brazil) and `ARS` (Argentina) only
- **RateLock**: `lockedRate`, `expiryAt`, `marketRateAtLock` — no INTIME in MVP
- **Settlement**: `corridor` field (BRL/ARS), `currency` field (USD/HKD for seller)
- **InvoiceTemplate**: Must support versioning (FR63) — `version: number`, `supersededBy: string | null`

### What NOT to Do

- Do NOT implement mock API or seed JSON — that's Story 0.3
- Do NOT implement any UI components
- Do NOT define Zustand stores yet — that comes later

### References

- [Source: epics.md — Story 0.2](../../_bmad-output/planning-artifacts/epics.md)
- [Source: architecture-revised-2026-04-07.md — ARCH-5, ARCH-7](../../_bmad-output/planning-artifacts/architecture-revised-2026-04-07.md)
- [Source: prd-revised-2026-04-07.md — FR definitions (FR1-FR87, FR-N)](../../_bmad-output/planning-artifacts/prd-revised-2026-04-07.md)

## Dev Agent Record

### Agent Model Used

qwen3.6-plus

### Debug Log References

- Types defined directly in `src/lib/types.ts` replacing the placeholder `export {}`
- All 18 domain types + 6 API response types + generic `ApiResponse<T>` wrapper defined
- Used `Record<string, unknown>` (not `any`) for `AuditLog.metadata`

### Completion Notes List

- Defined 10 enums: Role, KYCStatus, KYBStatus, SettlementStatus, RateLockStatus, Corridor, SettlementCurrency, InvoiceStatus, TradePaymentAgreementStatus, EvidencePackStatus
- Defined 18 domain types: User, Organization, BeneficialOwner, InvoiceLineItem, Invoice, SettlementLeg, Settlement, RateLock, TradePaymentAgreement, FeeBreakdown, EvidencePack, EvidenceDocument, Counterparty, ApprovalChain, Approver, AuditLog, CorridorConfig, InvoiceTemplate, Notification
- Defined generic `ApiResponse<T>` + 6 concrete response types (SettlementResponse, InvoiceResponse, RateLockResponse, EvidencePackResponse, CounterpartyResponse, ApprovalResponse)
- `tsc --noEmit` passes with zero errors
- Zero `any` types in types.ts (verified with grep)
- `npm run lint` passes

### File List

Modified:
- `src/lib/types.ts` — all domain types, enums, and API response types (replaced stub)
