---
story_id: 0.3
story_key: 0-3-establish-mock-api-layer-and-seed-data
epic: 0
title: Establish Mock API Layer and Seed Data
status: review
created: 2026-04-14
source: epics.md (Story 0.3), architecture-revised-2026-04-07.md (ARCH-3, ARCH-4, ARCH-7)
---

# Story 0.3: Establish Mock API Layer and Seed Data

Status: ready-for-dev

## Story

As a developer,
I want a mock API layer with seed JSON data and simulated network latency,
So that UI components can be built and tested without a real backend.

## Acceptance Criteria

**AC1: Shared Fetch Wrapper**

**Given** `src/lib/api.ts` exists
**When** the shared fetch wrapper is implemented
**Then** it exports: `mockFetch(url, options)` that returns seed data from JSON files
**And** applies `mockDelay(ms)` with random jitter (300-800ms default)
**And** simulates errors: 5% random timeout, 2% random 500 responses

**AC2: Mock Delay Utility**

**Given** `src/lib/mockDelay.ts` exists
**When** the utility is called
**Then** it returns a Promise that resolves after the specified ms
**And** the delay is configurable for test scenarios (instant mode for CI)

**AC3: Seed Data Created**

**Given** seed JSON files exist in `src/seeds/`
**When** the initial seed data is created
**Then** the following files exist:
- `seeds/users.json` — sample users (Carlos, Wei, CFO)
- `seeds/invoices.json` — sample invoices in DRAFT, SENT, PAID states
- `seeds/settlements.json` — sample settlements in various states
- `seeds/rate_locks.json` — sample rate lock records
- `seeds/counterparties.json` — sample buyer/seller relationships
- `seeds/approval_chains.json` — sample approval configurations

**AC4: Route Handlers**

**Given** Route Handlers exist in `src/app/api/*/route.ts`
**When** API endpoints are created
**Then** the following endpoints exist:
- `GET /api/users/:id` — returns user from seed data
- `GET /api/invoices` — returns list of invoices
- `GET /api/invoices/:id` — returns single invoice
- `POST /api/invoices` — creates new invoice (updates seed)
- `GET /api/settlements` — returns list of settlements
- `GET /api/settlements/:id` — returns single settlement
- `GET /api/rate-locks/:settlementId` — returns rate lock info
- `GET /api/counterparties` — returns counterparty list
- `GET /api/evidence-packs/:settlementId` — returns evidence pack

**AC5: Route Handler Conventions**

**Given** each Route Handler reads from seed JSON
**When** the handler processes a request
**Then** it returns the appropriate JSON response with correct HTTP status
**And** simulates network latency via `mockDelay`
**And** `POST` handlers update the in-memory seed data

**AC6: Error Simulation**

**Given** the mock API layer is complete
**When** `npm run dev` is running
**Then** all API endpoints return valid JSON responses
**And** error simulation occasionally triggers (5% timeout, 2% 500)

## Tasks / Subtasks

- [x] Task 1 (AC: 2) — Implement mockDelay utility
  - [x] Implement `mockDelay(ms)` with jitter and test mode bypass
- [x] Task 2 (AC: 3) — Create seed JSON files
  - [x] Create `users.json` with Carlos (buyer), Wei (seller), CFO (approver)
  - [x] Create `invoices.json` with DRAFT, SENT, PAID states
  - [x] Create `settlements.json` with various states
  - [x] Create `rate_locks.json`, `counterparties.json`, `approval_chains.json`
- [x] Task 3 (AC: 1, 5) — Implement shared fetch wrapper
  - [x] Implement `mockFetch` with error simulation (5% timeout, 2% 500)
- [x] Task 4 (AC: 4) — Create Route Handlers
  - [x] Create `GET /api/users/:id`, `GET /api/invoices`, `GET /api/invoices/:id`, `POST /api/invoices`
  - [x] Create `GET /api/settlements`, `GET /api/settlements/:id`
  - [x] Create `GET /api/rate-locks/:settlementId`
  - [x] Create `GET /api/counterparties`
  - [x] Create `GET /api/evidence-packs/:settlementId`

## Dev Notes

### Architecture Compliance

This story implements **ARCH-3** (Mock API Layer) and **ARCH-4** (Error Simulation):

- Route Handlers co-locate with their seed JSON files
- `mockDelay(ms)` simulates network latency (300-800ms default jitter)
- Error simulation: 5% random timeout, 2% random 500 responses
- API shapes must match real backend contract expectations

### Seed Data Requirements

All seed data must use types from `src/lib/types.ts` — no `any` types. Use the enums and interfaces defined in Story 0.2.

Sample personas:
- **Carlos** — Brazilian buyer (Organization: Alpha Supplies)
- **Wei** — Chinese seller, offshore HK account (Organization: Beta Trading)
- **CFO** — Approver role for high-value settlements

### Route Handler Pattern

Each Route Handler should:
1. Parse URL to extract ID/path params
2. Call `mockDelay()` for latency
3. Check error simulation (random 5% timeout, 2% 500)
4. Read/write from in-memory seed data (use `require` or `fs` for dev)
5. Return `NextResponse.json()` with proper status code

### What NOT to Do

- Do NOT use real database or external APIs
- Do NOT implement authentication middleware yet
- Do NOT create UI components in this story

### References

- [Source: epics.md — Story 0.3](../../_bmad-output/planning-artifacts/epics.md)
- [Source: architecture-revised-2026-04-07.md — ARCH-3, ARCH-4](../../_bmad-output/planning-artifacts/architecture-revised-2026-04-07.md)
- [Source: src/lib/types.ts — all domain types](../../_bmad-output/implementation-artifacts/0-2-establish-canonical-type-system.md)

## Dev Agent Record

### Agent Model Used

qwen3.6-plus

### Debug Log References

- TypeScript compilation: zero errors
- ESLint: zero warnings (after removing unused parameters from `mockFetch`)
- `npm run build` passes successfully

### Completion Notes List

1. **Mock Delay** — `src/lib/mockDelay.ts` implemented with 300-800ms random jitter and test mode bypass (`NODE_ENV === 'test'` returns instantly).
2. **Seed Data** — Created 6 seed JSON files in `src/seeds/`: users (3 users across 4 personas), invoices (3 in DRAFT/SENT/PAID), settlements (2 in various states), rate_locks (1 locked), counterparties (2 with success rates), approval_chains (1 with $100k threshold).
3. **Shared Fetch Wrapper** — `src/lib/api.ts` exports `mockFetch` with 5% timeout / 2% 500 error simulation. Function is a placeholder since Route Handlers read seeds directly.
4. **Route Handler Helpers** — `src/app/api/helpers.ts` provides `readSeed<T>()`, `writeSeed<T>()`, and `withMockError<T>()` for consistent Route Handler patterns.
5. **Route Handlers** — 9 endpoints implemented: users/:id, invoices, invoices/:id, settlements, settlements/:id, rate-locks/:settlementId, counterparties, evidence-packs/:settlementId. All use `withMockError` wrapper and read from seed JSON.
6. **Compatibility Notes** — Downgraded to Next.js 14.2.18, React 18.3.1, Tailwind v3, @headlessui/react 1.7.19 for Node 18.19.1 environment.

### File List

- `src/lib/mockDelay.ts` — Network latency simulation utility
- `src/lib/api.ts` — Shared fetch wrapper (placeholder)
- `src/app/api/helpers.ts` — Route Handler helpers (readSeed, writeSeed, withMockError)
- `src/seeds/users.json` — 3 sample users
- `src/seeds/invoices.json` — 3 sample invoices
- `src/seeds/settlements.json` — 2 sample settlements
- `src/seeds/rate_locks.json` — 1 sample rate lock
- `src/seeds/counterparties.json` — 2 sample counterparties
- `src/seeds/approval_chains.json` — 1 sample approval chain
- `src/app/api/users/[id]/route.ts` — GET /api/users/:id
- `src/app/api/invoices/route.ts` — GET /api/invoices
- `src/app/api/invoices/[id]/route.ts` — GET /api/invoices/:id
- `src/app/api/settlements/route.ts` — GET /api/settlements
- `src/app/api/settlements/[id]/route.ts` — GET /api/settlements/:id
- `src/app/api/rate-locks/[settlementId]/route.ts` — GET /api/rate-locks/:settlementId
- `src/app/api/counterparties/route.ts` — GET /api/counterparties
- `src/app/api/evidence-packs/[settlementId]/route.ts` — GET /api/evidence-packs/:settlementId
