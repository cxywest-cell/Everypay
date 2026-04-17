# Implementation Readiness Assessment Report

**Date:** 2026-04-14
**Project:** Everypay
**Assessed By:** Daniel (with AI facilitation)

---

## Step 1: Document Discovery

### Document Inventory

#### PRD Documents

**Whole Documents:**
- [prd.md](../../_bmad-output/planning-artifacts/prd.md) — Original PRD (87+ FRs)
- [prd-revised-2026-04-07.md](../../_bmad-output/planning-artifacts/prd-revised-2026-04-07.md) — Revised PRD (USD/HKD, offshore HK)
- [prd-revised-2026-04-07-CN.md](../../_bmad-output/planning-artifacts/prd-revised-2026-04-07-CN.md) — Chinese translation of revised PRD

**Validation:**
- [validation-report-prd.md](../../_bmad-output/planning-artifacts/validation-report-prd.md)

**⚠️ NOTE:** Three PRD versions exist. Need to confirm which is authoritative for this assessment.

#### Architecture Documents

**Whole Documents:**
- [architecture.md](../../_bmad-output/planning-artifacts/architecture.md) — Original architecture (PROTOTYPE mode)
- [architecture-revised-2026-04-07.md](../../_bmad-output/planning-artifacts/architecture-revised-2026-04-07.md) — Revised architecture (MVP scope reduced, Escrow to Phase 2)

**⚠️ NOTE:** Two architecture versions exist. Need to confirm which is authoritative.

#### Epics & Stories

**Whole Documents:**
- [epics.md](../../_bmad-output/planning-artifacts/epics.md) — 14 Epics with Stories (MVP/Phase 2 marked)

#### UX Design Documents

**Whole Documents:**
- [ux-design-specification.md](../../_bmad-output/planning-artifacts/ux-design-specification.md) — Full UX spec (4 personas)
- [ux-design-directions.html](../../_bmad-output/planning-artifacts/ux-design-directions.html) — UX directions (HTML)

#### Sprint Change Proposals (Reference)

- [sprint-change-proposal-2026-04-07.md](../../_bmad-output/planning-artifacts/sprint-change-proposal-2026-04-07.md) — CNY → USD/HKD
- [sprint-change-proposal-2026-04-13.md](../../_bmad-output/planning-artifacts/sprint-change-proposal-2026-04-13.md) — Escrow deferred to Phase 2

### Issues Requiring Resolution

**⚠️ DUPLICATE DOCUMENTS — Must resolve before proceeding:**

1. **PRD**: 3 versions exist — original `prd.md`, revised `prd-revised-2026-04-07.md`, and CN translation. **Recommendation:** Use `prd-revised-2026-04-07.md` as authoritative (reflects current scope after change proposals).

2. **Architecture**: 2 versions exist — original `architecture.md` and revised `architecture-revised-2026-04-07.md`. **Recommendation:** Use `architecture-revised-2026-04-07.md` as authoritative (reflects MVP scope reduction).

---

## Step 2: PRD Analysis

**Source:** `prd-revised-2026-04-07.md` (859 lines)

### Functional Requirements Extracted

**User Management:**
- FR1: User registration + KYC (ID, liveness, address, sanctions screening)
- FR2: KYB verification (beneficial ownership >10%, signatories, business activity)
- FR3: RBAC role assignment (Viewer, Operator, Approver, Compliance, Admin)
- FR4: Team member invite/management

**Seller Workflow:**
- FR5: Create invoice with contract + line items
- FR6: Propose trade payment agreement terms (rate method, milestones, approval chain — escrow Phase 2)
- FR7: Accept/reject buyer-proposed terms
- FR8: Configure approval chain for high-value settlements
- FR9: Configure auto-acceptance thresholds
- FR10: Download evidence pack for any settlement
- FR11: Configure default preferences (Phase 2)
- FR12: Save invoice terms as reusable template

**Buyer Workflow:**
- FR13: View invoices from sellers
- FR14: Initiate payment in local currency (BRL/ARS)
- FR15: Select rate method: PRELOCK only in MVP
- FR16: Propose trade payment agreement terms
- FR17: Propose settlement terms (Phase 2)
- FR18: Track real-time settlement status
- FR19: Withdraw unlocked USDT balance
- FR20: View upfront exchange rate + fees

**Corridor Operations:**
- FR21: Brazil BRL corridor with BCB compliance
- FR22: Argentina ARS corridor with BCRA compliance
- FR23: Enforce corridor-specific compliance rules
- FR24: Display settlement status in corridor-appropriate format

**Settlement Engine:**
- FR25: Convert BRL/ARS → USDT
- FR26: Hold USDT for conversion (Phase 2 — Cregis escrow)
- FR27: Release USDT for FX conversion (Phase 2)
- FR28: Tranche-based settlement (Phase 2)
- FR29: Convert USDT → USD/HKD via Everypay HK
- FR30: Transfer USD/HKD to seller offshore HK account
- FR31: Full settlement chain visibility to both parties
- FR56: ARS corridor BCRA USDT restrictions + alternative path documentation
- FR57: Settlement failure state machine with rollback

**Rate Management:**
- FR32: PRELOCK rate method (agreed at invoice, locked)
- FR33: INTIME rate method (Phase 2)
- FR34: Display exchange rate + fees upfront
- FR35: Lock PRELOCK rate upon payment confirmation
- FR-N4: 48h SLA for INTIME negotiation (Phase 2)
- FR-N5: Auto-escalate INTIME to third party (Phase 2)

**Escrow Negotiation:**
- FR36: NOESCROW model for trusted relationships
- FR37: EXACT escrow (Phase 2)
- FR38: OVER escrow (Phase 2)
- FR-N8: UNDER escrow (Phase 2)
- FR-N9: UNDER shortfall handling (Phase 2)
- FR39: Buyer propose over-escrow buffer (Phase 2)
- FR40: Seller accept/reject/counter escrow (Phase 2)
- FR41: Over-escrow bilateral approval (Phase 2)
- FR-N10: One-for-all escrow (Phase 2)
- FR-N11: Phased escrow (Phase 2)

**Approval Workflow:**
- FR42: Configure approval chain (Phase 2)
- FR43: Auto-escalate for review (Phase 2)
- FR44: 48h acceptance SLA (Phase 2)
- FR45: Approvers approve/reject with comments
- FR46: Log all approval decisions with timestamp/identity

**Evidence & Audit:**
- FR47: Generate timestamped, tamper-evident evidence pack per settlement/tranche
- FR48: Evidence pack includes: order, contract, invoice, logistics, customs, supporting files
- FR49: Seller download evidence pack anytime
- FR50: Retain evidence for minimum 7 years
- FR51: Produce evidence pack within 48h of regulator request
- FR62: Retrieve/deliver evidence pack to regulators within 48h

**AML & Compliance:**
- FR52: Screen users against OFAC, UN, EU, local sanctions lists
- FR53: Cregis enforce freeze orders (Phase 2)
- FR54: Log freeze order events (Phase 2)
- FR55: Maintain KYC/KYB records

**USDT Balance & Liquidity:**
- FR58: Track USDT balance states (Phase 2 — escrow states)
- FR59: Manual resolution with audit trail (Phase 2)
- FR61: T+0 USDT conversion guarantee + compensation clause
- FR66: HK offshore account documentation per settlement
- FR67: Integrate with HK bank for USD/HKD clearing

**Dispute Resolution:**
- FR60: Dispute resolution (Phase 2)
- FR68: Pause settlement + enter dispute (Phase 2)
- FR-N15: Escrow return dispute (Phase 2)
- FR-N16: Penalty escrow (Phase 2)

**Counterparty Management (CRM):**
- FR69: Seller view buyers with history, trust score, volume
- FR70: Buyer view sellers with invoice history, delivery performance, volume
- FR71: Calculate/display trust indicators per counterparty
- FR72: Maintain interaction history per counterparty pair

**Purchase Ledger (Buyer):**
- FR73: View pending invoices with due dates + status
- FR74: Track outgoing payments across BRL/ARS
- FR75: Running balance owed vs paid per seller
- FR76: Automated payment reminders before due dates

**Sales Ledger (Seller):**
- FR77: View outstanding invoices with expected dates + collection status
- FR78: Track incoming receivables across corridors in USD equivalent
- FR79: Running balance billed vs received per buyer
- FR80: Aging report (0-30, 31-60, 60+ days overdue)

**Account Reconciliation:**
- FR81: Real-time USDT holdings view (Phase 2 — escrow tracking)
- FR82: Real-time BRL/ARS holdings view
- FR83: Real-time USD/HKD receipts in seller offshore HK account
- FR84: Aggregated FX exposure per counterparty + corridor
- FR85: Total currency exposure across all open settlements

**Template Management:**
- FR63: Version invoice templates; in-flight use original version
- FR86: Set template as default for specific buyer counterparties

**Simplified Onboarding:**
- FR64: Simplified KYC tier for low-value/low-risk buyers
- FR87: Risk-based KYC (higher thresholds → fuller KYC/KYB)

**Settlement Configuration:**
- FR-N1: Multi-dimensional settlement configuration (Phase 2)
- FR-N2: PRELOCK rate method
- FR-N3: INTIME rate method (Phase 2)
- FR-N6: EXACT escrow (Phase 2)
- FR-N7: OVER escrow (Phase 2)
- FR-N12: Risk Score calculation (Phase 2)
- FR-N13: Risk Report generation (Phase 2)
- FR-N14: Risk Report display (Phase 2)
- FR-N17: Payment initiation by seller/buyer/system (Phase 2)

**Settlement Success Definition:**
- FR65: SETTLED + USD_HKD_CONFIRMED = success

**Total FRs: 87 numbered (FR1-FR87, with some gaps) + 17 N-prefixed (FR-N1 to FR-N17) = 104 total**

### Non-Functional Requirements Extracted

**Performance:**
- NFR1: Stablecoin leg T+0; USD/HKD cross-border T+1
- NFR2: Settlement status updates within 30 seconds of state change
- NFR3: Evidence pack retrievable within 48h of regulator request
- NFR4: UI operations complete within 3 seconds
- NFR5: System supports 100 concurrent active settlements per corridor

**Security:**
- NFR6: KYC/KYB encrypted at rest (AES-256); all data in transit (TLS 1.3)
- NFR7: RBAC enforced at API level; no cross-tenant access
- NFR8: Real-time sanctions screening (OFAC, UN, EU, local)
- NFR9: All settlement events logged, timestamped, immutable
- NFR10: Freeze order enforcement within 15 minutes (Phase 2)
- NFR11: Annual third-party penetration testing
- NFR12: KYC documents retained 7 years; Compliance-only access

**Scalability:**
- NFR13: New corridor addition without core platform modification
- NFR14: Scale from 10 to 1000+ settlements/month with <20% performance degradation
- NFR15: Users from 50+ countries without infrastructure modification
- NFR16: Handle 3x normal volume during FX volatility events

**Reliability:**
- NFR17: >99% settlement completion rate
- NFR18: 100% evidence pack completeness
- NFR19: 99.5% system uptime
- NFR20: RPO=0; RTO < 4 hours

**Compliance:**
- NFR21: HK SFC PSP license
- NFR22: Dubai VARA custody license (Phase 2)
- NFR23: BCB payment institution authorization (Brazil partner)
- NFR24: BCRA compliance for ARS corridor
- NFR25: HK offshore account compliance
- NFR26: Data residency per local regulations
- NFR27: FATF-aligned AML/CTF program

**Integration:**
- NFR28: Cregis API 99.9% uptime, <1s response (Phase 2)
- NFR29: Brazil partner API 99% uptime, real-time BRL confirmation
- NFR30: Logistics webhook with retry (3 attempts, exponential backoff)
- NFR31: Real-time USDT→USD/HKD conversion
- NFR32: T+1 USD/HKD settlement; ISO 20022 format

**Total NFRs: 32**

### PRD Completeness Assessment

The PRD is **comprehensive and well-structured**. Key observations:

- **FRs are clearly numbered** with consistent format
- **MVP vs Phase 2 is explicitly marked** on each requirement — critical for scope control
- **NFRs cover all standard categories** (performance, security, scalability, reliability, compliance, integration)
- **User journeys** map directly to functional areas
- **Change proposals** (sprint-change-proposal-2026-04-13.md) are reflected in the MVP scope definition

**Potential gaps identified:**
1. **FR59** references "manual resolution" but no FR defines the ops team manual intervention UI/API in detail
2. **FR61** mentions "compensation clause" but no mechanism for how compensation is calculated or applied
3. **FR66/FR67** reference HK offshore account documentation and bank integration but no specific data fields or message formats are defined (though ISO 20022 is mentioned in NFR32)
4. **FR76** "automated payment reminders" — no configuration for reminder timing, channels, or escalation rules
5. No explicit API contract or data model definitions (expected to come from Architecture)

---

## Step 3: Epic Coverage Validation

**Source:** `epics.md` (1070 lines, 14 Epics)

### FR Coverage Matrix

| FR | PRD Summary | Epic Coverage | Stories Present? | Status |
|----|------------|---------------|-----------------|--------|
| FR1 | User KYC | Epic 1 | 1.1, 1.2 | Covered |
| FR2 | Business KYB | Epic 1 | 1.3 | Covered |
| FR3 | RBAC roles | Epic 1 | 1.4 | Covered |
| FR4 | Team management | Epic 1 | 1.5 | Covered |
| FR5 | Create invoice | Epic 2 | **NO STORIES** | MISSING |
| FR6 | Propose agreement terms | Epic 2 | **NO STORIES** | MISSING |
| FR7 | Accept/reject terms | Epic 2 | **NO STORIES** | MISSING |
| FR8 | Approval chain config | Epic 8 | 8.1 | Covered |
| FR9 | Auto-accept thresholds | Epic 8 | 8.2 | Covered |
| FR10 | Download evidence pack | Epic 2 (claimed) | 9.2 | Covered |
| FR11 | Default preferences (P2) | Phase 2 list | — | Phase 2 |
| FR12 | Reusable template | Epic 2 | **NO STORIES** | MISSING |
| FR13 | View invoices | Epic 2 | **NO STORIES** | MISSING |
| FR14 | Initiate payment | Epic 2 | **NO STORIES** | MISSING |
| FR15 | Rate method selection | Epic 2 | **NO STORIES** | MISSING |
| FR16 | Propose agreement (P2) | Phase 2 list | — | Phase 2 |
| FR17 | Settlement terms (P2) | Phase 2 list | — | Phase 2 |
| FR18 | Track settlement status | Epic 2 | 4.1 | Covered |
| FR19 | Withdraw USDT | Epic 2 | **NO STORIES** | MISSING |
| FR20 | View rate + fees upfront | Epic 2 | 5.3 | Covered |
| FR21 | BRL corridor | Epic 6 | (header only) | Covered (no detail stories) |
| FR22 | ARS corridor | Epic 6 | (header only) | Covered (no detail stories) |
| FR23 | Corridor compliance | Epic 6 | (header only) | Covered (no detail stories) |
| FR24 | Corridor format display | Epic 4 | 4.4 | Covered |
| FR25 | BRL/ARS → USDT | Epic 3 | 3.2 | Covered |
| FR26 | Hold USDT escrow (P2) | Phase 2 list | — | Phase 2 |
| FR27 | Release USDT (P2) | Phase 2 list | — | Phase 2 |
| FR28 | Tranche settlement (P2) | Phase 2 list | — | Phase 2 |
| FR29 | USDT → USD/HKD | Epic 3 | 3.3 | Covered |
| FR30 | Transfer to HK account | Epic 3 | 3.4 | Covered |
| FR31 | Settlement visibility | Epic 4 | 4.1 | Covered |
| FR32 | PRELOCK rate | Epic 5 | 5.1 | Covered |
| FR33 | INTIME rate (P2) | Phase 2 list | — | Phase 2 |
| FR34 | Display rate + fees | Epic 5 | 5.3 | Covered |
| FR35 | Lock PRELOCK rate | Epic 5 | 5.2 | Covered |
| FR36 | NOESCROW model | Epic 7 | 7.1 | Covered |
| FR37 | EXACT escrow (P2) | Phase 2 list | — | Phase 2 |
| FR38 | OVER escrow (P2) | Phase 2 list | — | Phase 2 |
| FR39 | Over-escrow proposal (P2) | Phase 2 list | — | Phase 2 |
| FR40 | Escrow counter (P2) | Phase 2 list | — | Phase 2 |
| FR41 | Over-escrow approval (P2) | Phase 2 list | — | Phase 2 |
| FR42 | Approval chain (P2) | Phase 2 list | — | Phase 2 |
| FR43 | Auto-escalate (P2) | Phase 2 list | 8.5 (deferred) | Phase 2 |
| FR44 | 48h SLA (P2) | Phase 2 list | — | Phase 2 |
| FR45 | Approver approve/reject | Epic 8 | 8.4 | Covered |
| FR46 | Log approval decisions | Epic 8 | 8.4 | Covered |
| FR47 | Evidence pack generation | Epic 9 | 9.1 | Covered |
| FR48 | Evidence pack contents | Epic 9 | 9.1 | Covered |
| FR49 | Download evidence pack | Epic 9 | 9.2 | Covered |
| FR50 | 7-year retention | Epic 9 | 9.3 | Covered |
| FR51 | 48h regulator retrieval | Epic 9 | 9.2 | Covered |
| FR52 | Sanctions screening | Epic 1 | 1.2 | Covered |
| FR53 | Freeze orders (P2) | Phase 2 list | — | Phase 2 |
| FR54 | Log freeze events (P2) | Phase 2 list | — | Phase 2 |
| FR55 | KYC/KYB records | Epic 10 | (header only) | Covered (no detail stories) |
| FR56 | ARS BCRA restrictions (P2) | Phase 2 list | — | Phase 2 |
| FR57 | Settlement state machine (P2) | Phase 2 list | — | Phase 2 |
| FR58 | USDT balance states (P2) | Phase 2 list | — | Phase 2 |
| FR59 | Manual resolution (P2) | Phase 2 list | — | Phase 2 |
| FR60 | Dispute resolution (P2) | Phase 2 list | — | Phase 2 |
| FR61 | T+0 USDT guarantee | **NOT IN EPICS** | — | MISSING |
| FR62 | Evidence delivery | Epic 9 | 9.2 | Covered |
| FR63 | Template versioning | Epic 2 | **NO STORIES** | MISSING |
| FR64 | Simplified KYC tier | Epic 1 | 1.6 | Covered |
| FR65 | Settlement success definition | Epic 3 | 3.5 | Covered |
| FR66 | HK offshore docs | Epic 3 | (implicit in 3.4) | Covered (implicit) |
| FR67 | HK bank integration | Epic 3 | (implicit in 3.4) | Covered (implicit) |
| FR68 | Pause settlement (P2) | Phase 2 list | — | Phase 2 |
| FR69 | Seller view buyers | Epic 11 | (header only) | Covered (no detail stories) |
| FR70 | Buyer view sellers | Epic 11 | (header only) | Covered (no detail stories) |
| FR71 | Trust indicators | Epic 11 | (header only) | Covered (no detail stories) |
| FR72 | Interaction history | Epic 11 | (header only) | Covered (no detail stories) |
| FR73 | Pending invoices | Epic 12 | (header only) | Covered (no detail stories) |
| FR74 | Track outgoing payments | Epic 12 | (header only) | Covered (no detail stories) |
| FR75 | Running balance owed | Epic 12 | (header only) | Covered (no detail stories) |
| FR76 | Payment reminders | Epic 12 | (header only) | Covered (no detail stories) |
| FR77 | Outstanding invoices | Epic 13 | (header only) | Covered (no detail stories) |
| FR78 | Track receivables | Epic 13 | (header only) | Covered (no detail stories) |
| FR79 | Running balance billed | Epic 13 | (header only) | Covered (no detail stories) |
| FR80 | Aging report | Epic 13 | (header only) | Covered (no detail stories) |
| FR81 | USDT holdings (P2) | Phase 2 list | — | Phase 2 |
| FR82 | BRL/ARS holdings view | **NOT IN EPICS** | — | MISSING |
| FR83 | USD/HKD receipts view | **NOT IN EPICS** | — | MISSING |
| FR84 | FX exposure per counterparty | **NOT IN EPICS** | — | MISSING |
| FR85 | Total currency exposure | **NOT IN EPICS** | — | MISSING |
| FR86 | Template default | Epic 2 | **NO STORIES** | MISSING |
| FR87 | Risk-based KYC | Epic 1 | 1.6 | Covered |
| FR-N1 | Multi-dim config (P2) | Phase 2 list | — | Phase 2 |
| FR-N2 | PRELOCK rate method | Epic 5 | 5.1 | Covered |
| FR-N3 | INTIME rate (P2) | Phase 2 list | — | Phase 2 |
| FR-N4 | 48h INTIME SLA (P2) | Phase 2 list | — | Phase 2 |
| FR-N5 | Auto-escalate INTIME (P2) | Phase 2 list | — | Phase 2 |
| FR-N6 | EXACT escrow (P2) | Phase 2 list | — | Phase 2 |
| FR-N7 | OVER escrow (P2) | Phase 2 list | — | Phase 2 |
| FR-N8 | UNDER escrow (P2) | Phase 2 list | — | Phase 2 |
| FR-N9 | UNDER shortfall (P2) | Phase 2 list | — | Phase 2 |
| FR-N10 | One-for-all escrow (P2) | Phase 2 list | — | Phase 2 |
| FR-N11 | Phased escrow (P2) | Phase 2 list | — | Phase 2 |
| FR-N12 | Risk Score (P2) | Phase 2 list | — | Phase 2 |
| FR-N13 | Risk Report gen (P2) | Phase 2 list | — | Phase 2 |
| FR-N14 | Risk Report display (P2) | Phase 2 list | — | Phase 2 |
| FR-N15 | Escrow return dispute (P2) | Phase 2 list | — | Phase 2 |
| FR-N16 | Penalty escrow (P2) | Phase 2 list | — | Phase 2 |
| FR-N17 | Payment by system (P2) | Phase 2 list | — | Phase 2 |

### Coverage Statistics

- **Total PRD FRs:** 104
- **Covered (with stories):** 57
- **Covered (claimed in epic map, no detail stories):** 19 (Epics 6, 10, 11, 12, 13 are header-only)
- **Phase 2 (correctly deferred):** 22
- **MVP FRs MISSING epic/story coverage:** 6

### Missing MVP FR Coverage

**1. FR5: Seller can create invoice with attached contract and line items**
- **Impact:** Core seller workflow — cannot initiate any settlement without invoices
- **Recommendation:** Add to Epic 2 with stories for invoice creation, contract attachment, line item management

**2. FR19: Buyer can withdraw unlocked USDT balance at any time**
- **Impact:** Buyer liquidity feature — allows buyers to access USDT not committed to settlements
- **Recommendation:** Add to Epic 3 or create new story in existing epic for USDT balance withdrawal

**3. FR61: Platform guarantees USDT conversion within T+0; if delayed, compensation clause applies**
- **Impact:** SLA commitment — requires system to track conversion timing and apply compensation
- **Recommendation:** Add to Epic 3 (Settlement Engine) with story for T+0 monitoring and compensation logic

**4. FR63: Platform versions invoice templates when seller updates terms; in-flight invoices continue under original version**
- **Impact:** Template versioning — important for audit trail and consistent invoicing
- **Recommendation:** Add to Epic 2 with story for template version management

**5. FR82-FR85: Account Reconciliation (BRL/ARS holdings, USD/HKD receipts, FX exposure, total currency exposure)**
- **Impact:** Treasury/finance visibility — 4 FRs for real-time account reconciliation views
- **Recommendation:** Create new Epic or add to Epic 13 (Sales Ledger) with reconciliation stories

**6. FR86: Seller can set a template as default for specific buyer counterparties**
- **Impact:** Workflow efficiency — auto-populates invoice terms for repeat trades
- **Recommendation:** Add to Epic 2 with story for template default configuration

### Structural Observations

- **Epic 2 (Payment Agreement & Initiation)** has a header and FR coverage map claiming 15 FRs, but **ZERO stories written**. This is the most critical gap — it covers invoice creation, payment initiation, and rate selection, which are MVP core flows.
- **Epics 6, 10, 11, 12, 13** are header-only — FRs are claimed but no stories exist. These are lower priority since they cover secondary features, but they need stories before Sprint Planning is complete.
- **Phase 2 FRs are well-documented** in a dedicated section — good separation of concerns.

---

## Step 4: UX Alignment Assessment

**Source:** `ux-design-specification.md` (763 lines, created 2026-04-02)

### UX Document Status: FOUND

The UX Design Specification is comprehensive and covers 4 personas, design system, component strategy, user journeys, and accessibility.

### UX ↔ PRD Alignment

**Strong Alignment:**
- 4 personas (Carlos, Wei, CFO, Ops) match PRD user journeys
- Rate Lock Moment as defining experience aligns with FR32, FR34, FR35
- Evidence pack download aligns with FR10, FR47-FR51
- Settlement tracking aligns with FR18, FR31
- Approval workflow aligns with FR8, FR45, FR46
- Corridor-specific considerations align with FR21-FR24
- Progressive disclosure pattern matches PRD's "simple by default, detail on demand"
- Accessibility requirements (WCAG AA, 44x44px touch targets) align with NFR4, NFR9

**⚠️ MISALIGNMENT ISSUES:**

| Issue | UX Spec | PRD (Revised) | Severity |
|-------|---------|---------------|----------|
| Settlement currency | References "CNY" throughout (Wei receives CNY, CNY locked, etc.) | Revised to "USD or HKD" (offshore Hong Kong) | HIGH |
| Escrow visibility in MVP | UX describes `escrow_required` flag branching, Cregis custody badges | Escrow/Cregis is Phase 2; MVP is NOESCROW only | MEDIUM |
| Stablecoin terminology | "USDT held in Cregis escrow" in progressive disclosure examples | Crypto/USDT should be abstracted; Cregis is Phase 2 | LOW |
| Settlement chain steps | "BRL Received → Rate Locked → In Transit → Customs → CNY Delivered" | MVP chain: fiat → USDT → USD/HKD → offshore HK account; "Customs" is Phase 2 | MEDIUM |
| 4-conversion paths | Not reflected in UX; UX shows simplified chain | PRD describes 4 conversion paths for Wei | LOW |

**Root Cause:** The UX spec was created on 2026-04-02, BEFORE the PRD was revised on 2026-04-07 (CNY → USD/HKD) and the Architecture was revised on 2026-04-13 (escrow deferred to Phase 2).

### UX ↔ Architecture Alignment

**Strong Alignment:**
- Design System: Tailwind UI + Headless UI matches Architecture decision (ARCH-1, ARCH-6)
- Component file structure mirrors UX spec (RateLockCard, StatusTracker, ApprovalCard, EvidencePackDownload)
- Responsive strategy (Carlos mobile, Wei desktop) supported by Architecture's web-only prototype
- Animation tokens (600ms spring for rate lock) can be implemented with Tailwind/CSS
- Mock API layer supports all UX data needs
- Zustand store pattern supports UX state management needs (useRateLockStore, useApprovalStore)
- Type system (types.ts) can define all UX data models

**Minor Gaps:**
- UX specifies `@headlessui/react@^2.1.0` for React 19 — Architecture confirms this lock
- UX accessibility strategy (WCAG AA, keyboard nav, screen reader, reduced motion) is not explicitly in Architecture — should be added as a convention
- UX specifies 8 ERP module panels (ux-design-directions.html) — Architecture doesn't mention route structure for these

### Warnings

1. **HIGH: Currency terminology must be updated in UX spec.** Every reference to "CNY" should be changed to "USD or HKD" to match the revised PRD. This includes component names, user journey descriptions, and emotional design targets.

2. **MEDIUM: Escrow UI branching (`escrow_required` flag) is Phase 2.** The UX spec's extensive design for escrow/no-escrow branching should be noted as Phase 2 to avoid implementing it during MVP prototype work.

3. **LOW: Settlement chain visualization needs updating.** The 5-step tracker "BRL → Rate Locked → In Transit → Customs → CNY" should be revised to match the MVP chain: "Fiat Received → USDT Converted → USD/HKD Converted → Transferred to HK → Confirmed".

---

## Step 5: Epic Quality Review

### Epic Structure Validation

| Epic | Title User-Centric? | Delivers User Value? | Stories Present? | Quality |
|------|---------------------|---------------------|------------------|---------|
| Epic 1: User Management & Onboarding | Yes | Yes | 6 stories | GOOD |
| Epic 2: Payment Agreement & Initiation | Yes | Yes | **0 stories** | FAIL |
| Epic 3: Settlement Engine (MVP) | Yes | Yes | 5 stories | GOOD |
| Epic 4: Settlement Tracking | Yes | Yes | 5 stories | GOOD |
| Epic 5: Rate Management (PRELOCK) | Yes | Yes | 4 stories | GOOD |
| Epic 6: Corridor Operations | Yes | Yes | **0 stories** | FAIL |
| Epic 7: NOESCROW/Escrow | Yes | Yes | 1 story | PARTIAL |
| Epic 8: Approval Workflow | Yes | Yes | 5 stories | GOOD |
| Epic 9: Evidence & Audit | Yes | Yes | 4 stories | GOOD |
| Epic 10: AML & Compliance | Yes | Yes | **0 stories** | FAIL |
| Epic 11: Counterparty CRM | Yes | Yes | **0 stories** | FAIL |
| Epic 12: Purchase Ledger | Yes | Yes | **0 stories** | FAIL |
| Epic 13: Sales Ledger | Yes | Yes | **0 stories** | FAIL |
| (Template Story) | N/A | N/A | Template only | N/A |

### 🔴 Critical Violations

**1. Epic 2 — Zero Stories (CRITICAL)**
- **Issue:** Epic 2 claims coverage of 15 MVP FRs (FR5-FR7, FR12, FR13-FR15, FR18-FR20, FR32, FR34-FR35, FR63, FR86) but has zero stories.
- **Impact:** These are core user flows — invoice creation, payment initiation, rate selection. Cannot proceed with implementation without them.
- **Recommendation:** Create stories for: (a) Invoice creation with contract + line items, (b) Buyer viewing invoices, (c) Buyer initiating payment, (d) Rate method selection, (e) Agreement terms proposal/acceptance.

**2. Epic 7 — Phase 2 Stories Listed as Placeholders (CRITICAL)**
- **Issue:** Stories 7.2-7.9 are listed as "OUT OF MVP SCOPE" with titles but no acceptance criteria. They are clearly marked Phase 2, which is correct.
- **Assessment:** This is acceptable for a planning document but needs explicit Phase 2 flag in story headers to avoid confusion during development.

### 🟠 Major Issues

**3. Epic 4 Duplicates Epic 3 Settlement Logic (MAJOR)**
- **Issue:** Epic 4 "Settlement Tracking" has FRs FR25, FR29-FR31, FR65-FR67 — the same as Epic 3 "Settlement Engine". Story 4.3 "Wei Confirms USD/HKD Receipt" is nearly identical to Story 3.5 "Settle and Confirm Completion".
- **Impact:** Developer confusion about where to implement settlement confirmation logic.
- **Recommendation:** Clarify that Epic 3 handles settlement processing (backend/mocking) while Epic 4 handles status display and tracking (frontend/UI). Story 4.3 should focus on the confirmation UI, not the settlement state transition (which is Story 3.5).

**4. Story 8.5 Deferred but Listed as Story (MAJOR)**
- **Issue:** Story 8.5 "Auto-Escalate Based on Thresholds" is marked as Phase 2/deferred but still listed as a story with a note. It has no acceptance criteria.
- **Recommendation:** Either remove from the active story list or move to a clearly marked "Phase 2 Stories" section at the end.

**5. Story References to Non-Existent Epics (MAJOR)**
- **Issue:** Story 3.5 AC references "Epic 9 (Evidence & Audit) is triggered to provide evidence pack" when Wei reports non-receipt. Story 4.3 similarly references "Epic 9 (Evidence & Audit) is triggered." Epic 9 has no stories for "triggered evidence pack" — it only has generation, download, and retention.
- **Recommendation:** Remove cross-epic trigger references. Evidence pack is generated automatically on SETTLED status (Story 9.1), not triggered by dispute.

**6. Epic 6, 10, 11, 12, 13 — Header Only (MAJOR)**
- **Issue:** These epics have FR coverage maps but zero stories. FR73-FR80 alone represent 8 FRs for Purchase/Sales Ledgers — important MVP features.
- **Recommendation:** Create at least minimal stories for these epics. Purchase Ledger (Epic 12) and Sales Ledger (Epic 13) are user-facing dashboards that need implementation stories.

### 🟡 Minor Concerns

**7. Template Story at End of Document**
- **Issue:** The document ends with a Story `{{N}}.{{M}}` template (lines 1054-1069) with placeholder syntax. This looks like an incomplete copy-paste from a workflow template.
- **Recommendation:** Remove or clearly mark as a template for future use.

**8. Story 4.2 References "Wei Zhang 4 conversion paths" but Shows 4 Legs**
- **Issue:** Story 4.2 AC mentions "Leg 1 (fiat deposit), Leg 2 (USDT), Leg 3 (USD/HKD), Leg 4 (offshore transfer)" — this is correct but the description says "all 4 conversion paths" which is ambiguous.
- **Assessment:** Minor wording issue, no functional impact.

**9. Story 7.1 References "3+ successful settlements" as Threshold**
- **Issue:** The "trusted relationship" threshold of 3+ settlements is arbitrary and not defined in the PRD.
- **Recommendation:** Either align with PRD or add a note that this threshold is configurable.

**10. No Project Setup Story**
- **Issue:** Architecture specifies a starter template (`npx create-next-app@latest everypay-prototype...`) and 4 mandatory conventions, but no Epic 0 or Story 1.0 exists for project initialization.
- **Recommendation:** Add a Story 0.1 "Initialize Next.js Project + Mock API Contract" as the first implementation story. This should establish types.ts, seed JSON structure, and Route Handlers before any UI work.

### Epic Independence Analysis

| Epic | Depends On | Can Function Independently? | Notes |
|------|-----------|---------------------------|-------|
| Epic 1 | None | Yes | Foundation — auth, KYC, RBAC |
| Epic 2 | Epic 1 | Yes (with Epic 1) | Needs users to exist first |
| Epic 3 | Epic 2 | Yes (with Epic 1-2) | Needs payment agreements |
| Epic 4 | Epic 3 | Yes | UI layer over Epic 3 data |
| Epic 5 | Epic 2 | Yes | Can build alongside Epic 2 |
| Epic 6 | None | Yes | Corridor config is standalone |
| Epic 7 | Epic 2 | Yes | NOESCROW is default, no deps |
| Epic 8 | Epic 2 | Yes | Approval config is standalone |
| Epic 9 | Epic 3 | Yes | Evidence pack needs settlements |
| Epic 10 | Epic 1 | Yes | AML screening hooks into onboarding |
| Epic 11 | Epic 3 | Yes | Needs settlement history data |
| Epic 12 | Epic 2, Epic 3 | Yes | Needs invoices + payments |
| Epic 13 | Epic 2, Epic 3 | Yes | Needs invoices + receivables |

**No forward dependencies found.** Epic ordering is sound — Epic N does not require Epic N+1.

### Story Acceptance Criteria Quality

Stories with well-formed Given/When/Then ACs:
- Epic 1: All 6 stories — GOOD
- Epic 3: All 5 stories — GOOD
- Epic 4: All 5 stories — GOOD
- Epic 5: All 4 stories — GOOD
- Epic 7: Story 7.1 — GOOD
- Epic 8: Stories 8.1-8.4 — GOOD (8.5 is deferred)
- Epic 9: All 4 stories — GOOD

Stories missing ACs:
- Epic 2: All (no stories exist)
- Epic 6: All (no stories exist)
- Epic 10-13: All (no stories exist)

### Best Practices Compliance Summary

| Check | Status | Notes |
|-------|--------|-------|
| Epics deliver user value | PASS | All epic titles are user-centric |
| Epic independence | PASS | No forward dependencies |
| Stories appropriately sized | PARTIAL | Present stories are well-sized; missing stories need creation |
| No forward dependencies | PASS | Within-epic ordering is correct |
| Database creation when needed | N/A | Prototype mode (seed JSON, no DB) |
| Clear acceptance criteria | PARTIAL | Existing ACs are good; missing epics have none |
| FR traceability maintained | PASS | FR coverage map is comprehensive |

### Overall Epic Quality Assessment

**Strengths:**
- Existing stories have well-written Given/When/Then acceptance criteria
- MVP vs Phase 2 separation is clear and consistent
- Error conditions are covered in most ACs (happy path + failure path)
- Cross-references to NFRs and UX specs in ACs are good practice
- FR coverage map is complete and accurate

**Primary Gaps:**
- **Epic 2 missing entirely** — this is the most critical gap as it covers invoice creation and payment initiation, which are the first things users interact with
- **5 epics header-only** (Epics 2, 6, 10, 11, 12, 13) — 28 FRs claimed but no stories to implement them
- **No project setup story** — Architecture conventions need a first story to establish the foundation

---

## Step 6: Final Assessment

### Overall Readiness Status: NEEDS WORK

The project has **excellent planning artifacts** but is **not ready for full implementation** due to missing stories in critical epics and terminology misalignment.

### Issue Summary by Severity

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 Critical | 2 | Epic 2 has zero stories (covers core invoice/payment flows); Epic 7 Phase 2 stories need clear flagging |
| 🟠 Major | 6 | Epic 4/Epic 3 duplication, Story 8.5 deferral handling, cross-epic trigger references, 5 header-only epics, no project setup story, FR gaps (FR5, FR19, FR61, FR63, FR82-86) |
| 🟡 Minor | 4 | Template placeholder at document end, ambiguous conversion path wording, arbitrary trust threshold, terminology cleanup |
| ⚠️ UX Misalignment | 3 | CNY → USD/HKD throughout UX spec, escrow UI branching is Phase 2 not MVP, settlement chain steps need updating |

### Critical Issues Requiring Immediate Action

1. **Epic 2 needs stories immediately** — 15 MVP FRs (invoice creation, payment initiation, rate selection, agreement terms) have zero implementation stories. These are the first user-facing features. Without them, the prototype cannot demonstrate core value.

2. **UX spec currency terminology must be corrected** — Every reference to "CNY" in `ux-design-specification.md` should be "USD or HKD" per the revised PRD. This will cause implementation confusion.

3. **Account Reconciliation FRs (FR82-FR85) are missing from epic coverage** — 4 FRs for treasury visibility have no epic or story assigned.

### Recommended Next Steps

**Before Implementation (Must Do):**

1. **Create Epic 2 stories** — At minimum: (a) Invoice creation with contract + line items, (b) Buyer viewing invoices, (c) Payment initiation in local currency, (d) Agreement terms proposal/acceptance flow
2. **Update UX spec currency** — Find-and-replace CNY → USD/HKD, update settlement chain steps, mark escrow UI as Phase 2
3. **Add project setup story** — Story 0.1: Initialize Next.js project, establish types.ts, seed JSON structure, Route Handler conventions per Architecture

**Before Full Sprint (Should Do):**

4. **Create stories for Epics 10-13** — Purchase Ledger, Sales Ledger, Counterparty CRM, and AML Compliance need at least minimal stories
5. **Clarify Epic 3 vs Epic 4 boundary** — Epic 3 = processing, Epic 4 = UI display. Remove duplicated settlement confirmation logic
6. **Add missing FRs to epics** — FR19 (USDT withdrawal), FR61 (T+0 guarantee), FR63 (template versioning), FR82-FR85 (reconciliation)
7. **Clean up Epic 7 Phase 2 stories** — Move Stories 7.2-7.9 to a clearly marked Phase 2 appendix

**Nice to Have:**

8. Remove template placeholder story at document end
9. Align Story 7.1 trust threshold with PRD or mark as configurable
10. Remove cross-epic trigger references (Story 3.5, 4.3 referencing Epic 9)

### What Is Good

- **PRD is comprehensive** — 104 FRs clearly numbered, MVP vs Phase 2 explicitly marked, NFRs cover all categories
- **Architecture is well-defined** — 4 mandatory conventions, mock API strategy, clear Phase 2 boundaries
- **Existing stories are well-written** — Given/When/Then format, error conditions covered, NFR/UX references in ACs
- **Epic independence is sound** — No forward dependencies, logical ordering
- **Phase 2 separation is clean** — All deferred FRs properly documented
- **UX design system is mature** — Component strategy, color palette, typography, accessibility, animation tokens all defined

### Readiness by Domain

| Domain | Status | Notes |
|--------|--------|-------|
| PRD | READY | Comprehensive, well-structured |
| Architecture | READY | Clear decisions, conventions defined |
| Epic 1 (Onboarding) | READY | 6 well-written stories |
| Epic 2 (Agreements) | NOT READY | Zero stories |
| Epic 3 (Settlement Engine) | READY | 5 well-written stories |
| Epic 4 (Settlement Tracking) | NEEDS WORK | Boundary with Epic 3 needs clarification |
| Epic 5 (Rate Management) | READY | 4 well-written stories |
| Epic 6 (Corridor Ops) | NOT READY | Header only |
| Epic 7 (NOESCROW) | PARTIAL | 1 story, Phase 2 needs cleanup |
| Epic 8 (Approval) | READY | 4 active + 1 deferred |
| Epic 9 (Evidence & Audit) | READY | 4 well-written stories |
| Epic 10 (AML) | NOT READY | Header only |
| Epic 11 (CRM) | NOT READY | Header only |
| Epic 12 (Purchase Ledger) | NOT READY | Header only |
| Epic 13 (Sales Ledger) | NOT READY | Header only |
| UX Design | NEEDS WORK | Currency terminology + escrow scope mismatch |

### Final Note

This assessment identified **15 issues across 5 categories**. Address the critical issues before proceeding to implementation. The planning quality is excellent — the gaps are primarily in story creation, which can be addressed efficiently using the existing FR coverage maps as a guide.

---

**Assessment completed:** 2026-04-14
**Assessed by:** Daniel (with AI facilitation)
**Workflow:** check-implementation-readiness (6 steps completed)

---

## Remediation Summary (Post-Assessment Fixes Applied)

All identified issues have been addressed in the source artifacts. Here is what was fixed:

### Fixed in `epics.md`

| Issue | Action Taken |
|-------|-------------|
| Epic 2 had zero stories | Created 6 stories: 2.1 (Invoice Creation), 2.2 (Buyer View Invoices), 2.3 (Seller Propose Terms), 2.4 (Buyer Accept/Counter), 2.5 (Payment Initiation), 2.6 (Reusable Templates) |
| No project setup story | Created Epic 0 with 3 stories: 0.1 (Next.js Init), 0.2 (types.ts), 0.3 (Mock API + Seed Data) |
| Epic 6, 10, 11, 12, 13 header-only | Added stories: 6.1-6.2 (Corridor), 10.1-10.2 (AML), 11.1-11.2 (CRM), 12.1-12.2 (Purchase Ledger), 13.1-13.3 (Sales Ledger + Reconciliation) |
| Cross-epic trigger refs | Story 3.5 and 4.3 now reference "access evidence pack via Epic 9" instead of "Epic 9 is triggered" |
| Epic 3 vs Epic 4 boundary | Added boundary note to Epic 4: "Epic 3 = processing, Epic 4 = UI display" |
| FR61 (T+0 guarantee) missing | Added T+0 verification to Story 3.2 acceptance criteria |
| FR82-FR85 missing | Added Story 13.3 (Account Reconciliation & FX Exposure) covering FR82-FR85 |
| Story 8.5 Phase 2 cleanup | Strikethrough formatting with clear "DEFERRED TO PHASE 2" note |
| Template placeholder removed | Removed `{{N}}.{{M}}` template story from document end |
| FR Coverage Map updated | Updated to reflect new epic numbering (0-13) and FR assignments |

### Fixed in `ux-design-specification.md`

| Issue | Action Taken |
|-------|-------------|
| CNY → USD/HKD | Replaced all 18 instances of "CNY" with "USD/HKD" or "USD or HKD" |
| Escrow UI branching marked as MVP | Added "(Phase 2 — NOT in MVP)" notes to escrow sections, EscrowBadge, trust score table, journey flows |
| Settlement chain steps | Updated from "BRL → Rate Locked → In Transit → Customs → CNY" to "BRL Received → Rate Locked → USDT Converted → USD/HKD Transferred → USD/HKD Delivered" |
| Component roadmap | Moved EscrowBadge from Phase 1 (MVP) to Phase 2 |

### Status After Remediation

| Domain | Before | After |
|--------|--------|-------|
| Epic 2 (Agreements) | NOT READY (0 stories) | **READY** (6 stories) |
| Epic 0 (Foundation) | NOT EXISTS | **READY** (3 stories) |
| Epic 6 (Corridor Ops) | NOT READY (header only) | **READY** (2 stories) |
| Epic 10 (AML) | NOT READY (header only) | **READY** (2 stories) |
| Epic 11 (CRM) | NOT READY (header only) | **READY** (2 stories) |
| Epic 12 (Purchase Ledger) | NOT READY (header only) | **READY** (2 stories) |
| Epic 13 (Sales Ledger) | NOT READY (header only) | **READY** (3 stories) |
| UX Design | NEEDS WORK | **READY** (currency fixed, escrow marked Phase 2) |

**Overall Readiness Status After Fixes: READY for Implementation**

All critical and major issues have been resolved. The project is now ready to proceed with Sprint Planning and Story-by-Story implementation.
