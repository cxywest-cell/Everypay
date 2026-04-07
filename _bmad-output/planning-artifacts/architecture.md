---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: ["_bmad-output/planning-artifacts/prd.md", "_bmad-output/planning-artifacts/ux-design-specification.md", "_bmad-output/planning-artifacts/product-brief-Everypay-2026-04-01.md"]
workflowType: 'architecture'
project_name: 'Everypay'
user_name: 'Daniel'
date: '2026-04-02'
prototypeMode: true
---

# Architecture Decision Document — PROTOTYPE

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:** 87 FRs across 17 categories (see PRD for full detail)

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

## Starter Template Evaluation

### Primary Technology Domain

**Web Application (Prototype)** — Next.js + Tailwind UI + Seed Data

### Selected Stack: Next.js App Router

**Rationale:**
- Already specced in UX spec (Tailwind UI + Headless UI)
- App Router supports API routes for mock API simulation
- Good DX, fast iteration
- No backend required for prototype

**Initialization Command:**

```bash
npx create-next-app@latest everypay-prototype --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### Prototype Architecture Decisions

**Language & Runtime:**
- TypeScript (strict mode)
- Next.js 14+ App Router
- Node.js (for local dev)

**Styling Solution:**
- Tailwind CSS (as specced in UX spec)
- Headless UI (accessible components)

**Mock Data Layer:**
- JSON seed files in `/seeds/`
- In-memory state via React Context/Zustand
- Realistic delays simulated for API responses

**API Simulation:**
- Next.js Route Handlers (`/app/api/*`)
- Return static JSON mimicking real API shapes
- Simulate Cregis, payment partner, oracle responses

**Project Structure:**
```
/src
  /app          — Next.js App Router pages
  /components   — UI components (mirrors UX spec)
  /seeds        — Mock data JSON
  /lib          — Utilities, types
  /hooks        — Custom React hooks
```

**Real Backend Integration (Future):**
When ready, connect real APIs:
- Cregis: USDT escrow operations
- Brazil Payment Partner: BRL collection
- Logistics Oracle: Milestone webhooks
- Everypay HK: FX conversion, CNY rail

**Note:** Prototype mode — all architecture decisions focus on enabling rapid UI iteration. Backend, database, and infrastructure decisions deferred to post-prototype phase.

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

### Party Mode Validation (Step 4)

**Winston (Architect) findings:**
- Build thin `lib/api.ts` service layer even in prototype — enables drop-in swap for real APIs
- Error simulation (timeout, 500) in mock endpoints catches UI edge cases early
- Zustand for transient UI state only, seed JSON is source of truth

**Amelia (Developer) findings:**
- Lock `@headlessui/react@^2.1.0` for React 19 compatibility
- First story must establish types.ts + mock API contract before any UI work
- `use client` default prevents Server/Client Component boundary debugging overhead

### Deferred Decisions (Post-Prototype)

- Real authentication (JWT/OAuth)
- Real database (PostgreSQL)
- Real integrations (Cregis, Brazil payment partner, logistics oracle, Everypay HK)
- CI/CD pipeline
- Deployment infrastructure
- Server Component optimization
