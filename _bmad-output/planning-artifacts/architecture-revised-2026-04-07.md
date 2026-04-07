---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: ["_bmad-output/planning-artifacts/prd.md", "_bmad-output/planning-artifacts/ux-design-specification.md", "_bmad-output/planning-artifacts/product-brief-Everypay-2026-04-01.md"]
workflowType: 'architecture'
project_name: 'Everypay'
user_name: 'Daniel'
date: '2026-04-02'
prototypeMode: true
revision: '2026-04-07'
revisionNote: 'Settlement currency changed from CNY/mainland to USD or HKD/offshore HK'
---

# Architecture Decision Document — Everypay

_Revised based on stakeholder feedback: Settlement currency CNY → USD or HKD; beneficiary account mainland China → offshore Hong Kong_

## Revision History

| Date | Revision | Changes |
|------|----------|---------|
| 2026-04-02 | 1.0 | Initial architecture |
| 2026-04-07 | 1.1 | Settlement currency and beneficiary account updated per PRD revision |

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

### Settlement Model (Revised)

**3-Currency Chain:**
```
Local Fiat (BRL/ARS) → USDT Stablecoin → USD or HKD
```

**Settlement Flow:**
1. Buyer transfers local fiat (BRL/ARS) to Everypay collection account
2. Everypay converts local currency → USDT internally
3. USDT held in Cregis escrow (if enabled)
4. Logistics partner provides milestone data (shipped, customs cleared)
5. Cregis releases USDT to Everypay HK
6. Everypay HK converts USDT → USD or HKD
7. USD or HKD transferred to Wei's offshore Hong Kong bank account

**Key Change:** Settlement currency is USD or HKD (not CNY). Beneficiary is offshore HK account (not mainland China).

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

## Settlement Configuration Architecture

### Multi-Dimensional Model

| Dimension | Options | Implementation |
|-----------|---------|---------------|
| Escrow | Required / Not Required | `escrow_required` boolean flag |
| Rate Method | PRELOCK / INTIME | `rate_method` enum |
| Escrow Amount | EXACT / OVER / UNDER | `escrow_amount_type` enum |
| Escrow Structure | One-for-all / Phased | `escrow_structure` enum |
| Initiation | Seller / Buyer / System | `initiated_by` enum |

### Rate Exposure Management

| Scenario | Rate Protection | Mechanism |
|----------|----------------|-----------|
| Escrow + PRELOCK | Rate locked at initiation | Buyer protected; seller bears risk until release |
| Escrow + INTIME | Negotiation | 48h SLA; rate penalty; auto-escalation to third party |
| No Escrow | Bilateral agreement | No automated protection |

### Risk Score System

**Risk Score Calculation (0-100):**

| Risk Factor | Weight | Score Impact |
|-------------|--------|--------------|
| Escrow enabled | High | -30 if enabled |
| Rate method | Medium | PRELOCK: -15, INTIME: -5, None: 0 |
| Escrow amount type | High | EXACT: -20, OVER: -10, UNDER: +10 |
| Escrow structure | Medium | Phased: -10, One-for-all: 0 |
| Dispute history | High | +20 per prior dispute |
| Payment size | Medium | +1 per $10k above threshold |
| Corridor volatility | Medium | Varies by corridor |

---

## Real Backend Integration (Future)

When ready, connect real APIs:

| Partner | Integration Type | Purpose |
|---------|-----------------|---------|
| Cregis Custody | API + policy engine | USDT escrow, freeze orders, reserve management |
| Brazil Payment Partner | Local rails API | BRL collection, Brazilian payment infrastructure |
| Logistics Partner Oracle | Webhook/internal feed | Milestone data (shipped, customs cleared) |
| Everypay HK Entity | Internal FX engine | USDT → USD or HKD conversion, USD/HKD settlement to HK offshore account |

**Key Integration Notes:**
- Everypay HK FX Engine converts USDT → USD or HKD (not CNY)
- Settlement goes to Wei's offshore Hong Kong bank account (not mainland China)
- HK bank rails used for USD/HKD clearing (not CITIC for CNY)

---

## Deferred Decisions (Post-Prototype)

- Real authentication (JWT/OAuth)
- Real database (PostgreSQL)
- Real integrations (Cregis, Brazil payment partner, logistics oracle, Everypay HK)
- CI/CD pipeline
- Deployment infrastructure
- Server Component optimization
- Real Risk Score algorithm calibration

---

## Party Mode Validation

**Winston (Architect) findings:**
- Build thin `lib/api.ts` service layer even in prototype — enables drop-in swap for real APIs
- Error simulation (timeout, 500) in mock endpoints catches UI edge cases early
- Zustand for transient UI state only, seed JSON is source of truth
- Multi-dimensional settlement configuration requires flexible data model

**Amelia (Developer) findings:**
- Lock `@headlessui/react@^2.1.0` for React 19 compatibility
- First story must establish types.ts + mock API contract before any UI work
- `use client` default prevents Server/Client Component boundary debugging overhead
- Risk Score display should be incorporated into settlement views
