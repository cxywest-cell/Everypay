# Sprint Change Proposal

**Date:** 2026-04-07
**Author:** Daniel
**Change Trigger:** Stakeholder feedback on business model shift
**Status:** Draft

---

## Section 1: Issue Summary

### Problem Statement

The original PRD specified that Chinese exporters (sellers) would receive **CNY settlement in mainland China bank accounts**. Based on stakeholder feedback, the business model has shifted:

**Current (Original):**
- Settlement currency: CNY
- Beneficiary account: Mainland China bank account
- Transfer mechanism: SAFE-compliant cross-border transfer via CITIC

**Proposed (Revised):**
- Settlement currency: USD or HKD
- Beneficiary account: Offshore Hong Kong bank account
- Transfer mechanism: HK-compliant bank transfer

### Evidence

Stakeholder feedback indicated that sellers (exporters based in mainland China) prefer to receive settlement in USD or HKD in their offshore Hong Kong bank accounts, rather than CNY in mainland accounts.

### Scope of Change

This change affects:
- PRD: Settlement flow, success criteria, functional requirements, non-functional requirements, user journeys
- Architecture: Settlement flow, FX conversion, bank integration
- UX Design: Status displays, account information, evidence pack

---

## Section 2: Impact Analysis

### Epic Impact

| Epic | Impact | Changes Needed |
|------|--------|---------------|
| Epic 5: Settlement Engine | High | FR29, FR30, FR65, FR66, FR67 require updates |
| Epic 11: USDT Balance & Liquidity | Medium | FR66, FR67 references updated |
| Epic 2: Seller Workflow | Medium | Journey 2 updated, new settlement configuration |
| Epic 16: Account Reconciliation | Low | FR78, FR83 updated |

### Artifact Conflicts

| Artifact | Sections Needing Updates |
|----------|------------------------|
| **PRD** | Success Criteria, Product Scope/MVP, Settlement Flow, Settlement Configuration Framework, Journeys, FRs, NFRs |
| **Architecture** | Settlement flow, FX conversion logic, bank integration |
| **UX Design** | Status displays, Wei's dashboard, evidence pack, rate lock card |

### Technical Impact

- FX Engine: USDT → USD or HKD (not CNY)
- Bank Rail: HK bank for USD/HKD (not CITIC for CNY)
- Compliance: HK offshore account (not SAFE/CBIRC mainland)
- Settlement receipt: USD/HKD amounts (not CNY)

---

## Section 3: Recommended Approach

### Selected Path: Direct Adjustment

**Rationale:**
1. This is a specification change based on stakeholder feedback, not a technical limitation
2. No completed implementation exists to rollback
3. Core settlement mechanism remains unchanged (BRL/ARS → USDT → milestone → release → FX → transfer)
4. MVP scope is still achievable with updated settlement model
5. Risk is minimal — documentation update only

**Effort:** Medium (documentation update across PRD, Architecture, UX)
**Timeline Impact:** Minimal
**Risk:** Low

---

## Section 4: Detailed Change Proposals

### PRD Changes Summary

| # | Section | Change Type |
|---|---------|-------------|
| 1 | Success Criteria - Wei Zhang | Update settlement to USD/HKD, HK offshore account |
| 2 | Product Scope - Settlement Flow | 3-currency chain, updated flow |
| 3 | Settlement Configuration Framework | NEW - Multi-dimensional model |
| 4 | Journey 2 - Wei Zhang | Prerequisites, escrow options, risk score |
| 5 | FR29 | CNY → USD or HKD |
| 6 | FR30 | Mainland → HK offshore account |
| 7 | FR65 | SETTLED + CNY_CONFIRMED → SETTLED + USD_HKD_CONFIRMED |
| 8 | FR66 | SAFE → HK offshore |
| 9 | FR67 | CITIC/CNY → HK bank/USD-HKD |
| 10 | FR78 | CNY equivalent → USD equivalent |
| 11 | FR83 | CNY → USD/HKD |
| 12 | NFR25 | SAFE/CBIRC → HK offshore |
| 13 | NFR31 | USDT→CNY → USDT→USD or HKD |
| 14 | NFR32 | CITIC/CNY → HK bank/USD-HKD |
| 15 | USDT Balance States | CNY delivered → USD/HKD delivered |
| 16 | Integration List | USDT→CNY → USDT→USD-HKD |
| 17 | Licensing Stack | SAFE/mainland → HK offshore |
| 18 | Success Criteria - Carlos | BRL→CNY → BRL→USD/HKD |
| 19 | Journey 1 - Carlos | Owes CNY → Owes USD equivalent |
| 20 | New FR-N series | Settlement configuration, risk score, dispute mechanism |

### New Functional Requirements Added

| FR | Description |
|----|-------------|
| FR-N1 | Multi-dimensional settlement configuration |
| FR-N2 | PRELOCK rate method |
| FR-N3 | INTIME rate method |
| FR-N4 | 48h SLA for INTIME negotiation |
| FR-N5 | Auto-escalation to third party |
| FR-N6-N9 | Escrow amount types (EXACT/OVER/UNDER) |
| FR-N10-N11 | Escrow structures (one-for-all/phased) |
| FR-N12-N14 | Risk Score system |
| FR-N15-N17 | Dispute mechanism, penalty escrow |
| FR-N18 | Payment initiation options |

### Architecture Changes Summary

| Area | Change |
|------|--------|
| Settlement Flow | USDT → USD or HKD, HK offshore transfer |
| FX Conversion | USDT → USD or HKD |
| Bank Integration | HK bank rails (not CITIC) |
| Compliance | HK offshore account (not SAFE/CBIRC) |

### UX Design Changes Summary

| Component | Change |
|-----------|--------|
| Project Vision | CNY → USD/HKD offshore |
| Wei's Description | CNY receipt → USD/HKD receipt |
| Success Moment | "CNY received" → "USD/HKD received" |
| StatusTracker | 5 steps ending in USD/HKD |
| RateLockCard | CNY amount → USD/HKD amount |
| Arrival Animation | USD/HKD received |

---

## Section 5: Implementation Handoff

### Change Scope: Moderate

This change requires coordination across multiple artifacts but does not fundamentally alter the implementation approach.

### Handoff Plan

| Role | Responsibility |
|------|---------------|
| **Product Manager (John)** | Update PRD document, validate FRs |
| **Architect (Winston)** | Update Architecture document |
| **UX Designer (Sally)** | Update UX specifications and mockups |
| **Development Team** | Await updated artifacts before implementation |

### Success Criteria

1. Revised PRD approved and published
2. Architecture document updated
3. UX design updated
4. Epics and stories reviewed for alignment
5. Sprint plan updated if necessary

---

## Appendix: Complete Revised PRD Location

**File:** `_bmad-output/planning-artifacts/prd-revised-2026-04-07.md`

**Changes incorporated:**
- Settlement currency: CNY → USD or HKD
- Beneficiary account: Mainland China → Offshore Hong Kong
- 3-currency chain: Local fiat → USDT → USD/HKD
- Multi-dimensional settlement configuration model
- Risk Score evaluation system
- Enhanced dispute mechanism
- INTIME negotiation with SLA and third-party escalation
- Under escrow shortfall handling
- Prerequisites (KYB, trading relationship, payment agreement)
