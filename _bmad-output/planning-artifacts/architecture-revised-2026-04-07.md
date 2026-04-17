---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ["_bmad-output/planning-artifacts/prd-revised-2026-04-07.md", "_bmad-output/planning-artifacts/ux-design-specification.md", "_bmad-output/planning-artifacts/product-brief-Everypay-2026-04-01.md"]
workflowType: 'architecture'
project_name: 'Everypay'
user_name: 'Daniel'
date: '2026-04-02'
prototypeMode: true
revision: '2026-04-13'
revisionNote: 'MVP scope reduced: escrow/Cregis/milestone deferred to Phase 2; simplified settlement flow; Wei Zhang 4 conversion paths'
status: 'complete'
completedAt: '2026-04-13'
---

# Architecture Decision Document — Everypay

_Revised: MVP scope simplified — escrow deferred to Phase 2; 4-conversion-path settlement; PRELOCK only_

## Revision History

| Date | Revision | Changes |
|------|----------|---------|
| 2026-04-02 | 1.0 | Initial architecture |
| 2026-04-07 | 1.1 | Settlement currency and beneficiary account updated per PRD revision |
| 2026-04-13 | 1.2 | MVP scope reduced: escrow/milestone/INTIME deferred to Phase 2; simplified settlement flow; Wei Zhang 4 conversion paths |

---

## Project Context Analysis

### Requirements Overview

**Functional Requirements:** 87+ FRs across 17 categories (see PRD for full detail)

**Prototype Focus:** Subset of FRs for UI validation:
- Seller Workflow (FR5–FR12): Invoice creation, payment agreement, evidence pack
- Buyer Workflow (FR13–FR20): Payment initiation, rate lock, settlement tracking
- Approval Workflow (FR42–FR46): CFO approval queue
- Sales Ledger (FR77–FR80): Seller dashboard
- Purchase Ledger (FR73–FR76): Buyer dashboard
- Counterparty CRM (FR69–FR72): Counterparty profiles

### Scale & Complexity

- **Complexity:** Prototype — UI validation focus, no backend
- **Primary domain:** Frontend web application
- **Users:** 4 personas (Carlos/buyer, Wei/seller, CFO/approver, Ops team)

### Settlement Model (Revised MVP)

**4-Conversion-Path Chain:**
```
fiat → stablecoins → stablecoins → fiat → fiat(main)
```
- fiat → stablecoins: Buyer deposits local fiat, converted to stablecoins
- stablecoins → stablecoins: Single stablecoin transfer (same coin type)
- stablecoins → fiat: Seller receives stablecoins, converted to USD or HKD
- fiat → fiat(main): USD or HKD delivered to seller's mainland-connected offshore account

**Simplified MVP Settlement Flow (No Escrow):**
1. Settlement initiated by seller (most common) or buyer
2. Each tranche may have associated documents as negotiated between parties
3. Buyer transfers local fiat (BRL/ARS) to Everypay collection account
4. Everypay converts local currency → USDT
5. Everypay HK converts USDT → USD or HKD
6. USD or HKD transferred to Wei's offshore Hong Kong bank account
7. Wei receives evidence pack (per tranche)

**Note:** Cregis escrow, milestone tracking (shipped, customs), INTIME rate negotiation are all **Phase 2**.

---

## Step 4 — Core Prototype Architectural Decisions

### State Management: Zustand (Transient UI State Only)

**Decision:** Use Zustand for transient UI state only — NOT as source of truth.

- Seed JSON files are the canonical data source
- Zustand stores manage: form state, filter/pagination, UI toggles, active tab
- Do NOT duplicate seed data into Zustand — read from seed files via API Route Handlers
- Store slices named `use[Domain]Store` (e.g., `useApprovalStore`, `useRateLockStore`)

**Rationale:** Keeps prototype simple while establishing patterns that survive post-prototype. Source of truth stays in seed JSON, making it trivial to swap for real API later.

### Mock API Layer

**Decision:** Thin service layer over Next.js Route Handlers.

```
/src/lib/api.ts          — Shared fetch wrapper + mockDelay utility
/src/app/api/*/route.ts  — Route Handlers returning seed JSON
/src/seeds/*.json        — Canonical mock data
```

**Conventions:**
- Each Route Handler co-locates with its seed JSON file
- `mockDelay(ms)` utility simulates network latency (default 300-800ms)
- Include error simulation: random 5% timeout, 2% 500 responses
- API shapes must match real backend contract expectations (documented in PRD FRs)

### Component Architecture

**Decision:** Start with `use client` everywhere, optimize boundaries later.

- All page components default to `"use client"` to avoid Server/Client boundary friction during rapid prototyping
- Extract Server Components only when optimizing (post-prototype)
- Headless UI locked to `@headlessui/react@^2.1.0` for React 19 compatibility
- Component file structure mirrors UX spec sections

### Type System (Single Source of Truth)

**Decision:** `src/lib/types.ts` is the canonical type definition file.

- All domain types (Invoice, Settlement, Approval, Counterparty, etc.) defined here
- API response types co-located with types
- First story in development MUST establish types + mock API contract before any UI work

### 4 Mandatory Conventions (Pre-Commit)

These conventions are non-negotiable before the first commit:

1. **`src/lib/types.ts`** — Single source of truth for all domain types
2. **Route Handler + Seed JSON co-location** — Each API route reads from its paired seed file
3. **Zustand store slice naming** — `use[Domain]Store` pattern enforced
4. **Shared `mockDelay.ts`** — Consistent latency simulation across all mock endpoints

---

## Settlement Configuration Architecture (Phase 2)

> **Note:** This section applies to Phase 2 when escrow and milestone tracking are implemented. MVP uses simplified configuration.

### MVP Configuration

| Dimension | Options | Implementation |
|-----------|---------|---------------|
| Rate Method | PRELOCK only | `rate_method: 'PRELOCK'` |
| Escrow | N/A | Phase 2 |
| Settlement Type | Simple deferred | fiat → USDT → USD/HKD |

### Phase 2 Multi-Dimensional Model

| Dimension | Options | Implementation |
|-----------|---------|---------------|
| Escrow | Required / Not Required | `escrow_required` boolean flag (Phase 2) |
| Rate Method | PRELOCK / INTIME | `rate_method` enum (INTIME: Phase 2) |
| Escrow Amount | EXACT / OVER / UNDER | `escrow_amount_type` enum (Phase 2) |
| Escrow Structure | One-for-all / Phased | `escrow_structure` enum (Phase 2) |
| Initiation | Seller / Buyer / System | `initiated_by` enum (Phase 2) |

### Rate Exposure Management

| Scenario | Rate Protection | MVP Status |
|----------|----------------|------------|
| PRELOCK | Rate locked at initiation | MVP ✅ |
| INTIME | Negotiation | Phase 2 |
| Escrow + PRELOCK | Buyer protected | Phase 2 |
| Escrow + INTIME | 48h SLA negotiation | Phase 2 |
| No Escrow | Bilateral agreement | MVP ✅ |

### Risk Score System (Phase 2)

> **Note:** Risk Score factors include escrow features which are Phase 2. MVP does not calculate Risk Score.

**Risk Score Calculation (0-100) — Phase 2:**

| Risk Factor | Weight | Score Impact |
|-------------|--------|--------------|
| Escrow enabled | High | -30 if enabled (Phase 2) |
| Rate method | Medium | PRELOCK: -15, INTIME: -5, None: 0 |
| Escrow amount type | High | EXACT: -20, OVER: -10, UNDER: +10 (Phase 2) |
| Escrow structure | Medium | Phased: -10, One-for-all: 0 (Phase 2) |
| Dispute history | High | +20 per prior dispute |
| Payment size | Medium | +1 per $10k above threshold |
| Corridor volatility | Medium | Varies by corridor |

---

## MVP Backend Integration

| Partner | Integration Type | MVP Status |
|---------|-----------------|------------|
| Brazil Payment Partner | Local rails API | MVP ✅ — BRL/ARS collection |
| Everypay HK Entity | Internal FX engine | MVP ✅ — USDT → USD/HKD conversion |
| Cregis Custody | API + policy engine | Phase 2 — escrow |
| Logistics Partner Oracle | Webhook/internal feed | Phase 2 — milestone tracking |

**MVP Integration Notes:**
- Everypay HK FX Engine converts USDT → USD or HKD
- Settlement goes to Wei's offshore Hong Kong bank account
- HK bank rails used for USD/HKD clearing

## Phase 2 Backend Integration

Additional integrations for Phase 2:

| Partner | Integration Type | Purpose |
|---------|-----------------|---------|
| Cregis Custody | API + policy engine | USDT escrow, freeze orders, reserve management |
| Logistics Partner Oracle | Webhook/internal feed | Milestone data (shipped, customs cleared) |

---

## Deferred Decisions (Post-Prototype)

### MVP Still Needed
- Real authentication (JWT/OAuth)
- Real database (PostgreSQL)
- Real Brazil payment partner integration
- Real Everypay HK FX engine integration
- CI/CD pipeline
- Deployment infrastructure
- Server Component optimization

### Phase 2 Features (Deferred)
- Real Cregis escrow integration
- Real logistics partner integration (milestone tracking)
- INTIME rate negotiation
- Risk Score algorithm and calibration
- Over/under escrow models
- Dispute resolution with escrow

---

## Party Mode Validation

**Winston (Architect) findings:**
- Build thin `lib/api.ts` service layer even in prototype — enables drop-in swap for real APIs
- Error simulation (timeout, 500) in mock endpoints catches UI edge cases early
- Zustand for transient UI state only, seed JSON is source of truth
- MVP simplified settlement: fiat → USDT → USD/HKD only (escrow/milestone Phase 2)
- Flexible data model supports document types negotiated between parties

**Amelia (Developer) findings:**
- Lock `@headlessui/react@^2.1.0` for React 19 compatibility
- First story must establish types.ts + mock API contract before any UI work
- `use client` default prevents Server/Client Component boundary debugging overhead
- Risk Score display not in MVP — defer to Phase 2

**Scope Change Summary:**
- ✅ MVP: Simple deferred settlement (no escrow), PRELOCK only, flexible documents
- ❌ Removed from MVP: Escrow/Cregis, milestone tracking, INTIME rate, Risk Score
