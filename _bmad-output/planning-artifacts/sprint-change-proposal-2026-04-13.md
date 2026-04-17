# Sprint Change Proposal — Everypay PRD Revision

**Date:** 2026-04-13
**Author:** Daniel
**Trigger:** Need to update PRD for simplified MVP scope (no escrow in MVP)
**Mode:** Batch with incremental review

---

## 1. Issue Summary

The original PRD (prd-revised-2026-04-07.md) included escrow functionality (Cregis-based milestone escrow) as a core MVP feature. During planning review, it was decided that:

1. **Escrow implementation should be deferred to Phase 2** — complexity too high for initial launch
2. **Wei Zhang currency chain needed expansion** — from 3-currency to 4 conversion paths
3. **Document requirements for settlements needed clarification** — flexible, negotiated between parties

This change reduces MVP scope significantly, enabling faster time-to-market with a simpler, working product.

---

## 2. Impact Analysis

### Epic Impact
- No epics exist yet — PRD changes precede epic creation
- PRD changes will shape epic definitions

### Artifact Impact

| Artifact | Status | Changes Needed |
|----------|--------|----------------|
| PRD (this document) | ✅ Updated | Scope reduced, escrow deferred to Phase 2 |
| Epics & Stories | ⏳ Pending | Must be created with Phase 2 separation |
| Architecture | ⏳ Pending | Must exclude escrow components for MVP |
| UX Design | ⏳ Pending | Must exclude escrow UI flows |

### Technical Impact
- MVP no longer requires Cregis escrow integration
- Simplified settlement flow: fiat → USDT → USD/HKD
- INTIME rate negotiation deferred to Phase 2
- Risk Score evaluation deferred to Phase 2 (depends on escrow factors)

---

## 3. Recommended Approach

**Selected:** Direct Adjustment (Option 1)

- PRD updated to reflect MVP-only scope
- Clear separation of MVP vs Phase 2 features throughout document
- Low effort, low risk — targeted edits only

**Not Selected:**
- Rollback: N/A — no prior implementation
- PRD Review: Already incorporated in this change

---

## 4. Detailed Change Proposals

### 4.1 User Success — Wei Zhang (Carlos already updated earlier)

**Change:** Expanded currency chain from "3-currency" to "4 conversion paths"

**OLD:**
```
- 3-currency chain: Local fiat (BRL/ARS) → Stablecoins → USD or HKD
```

**NEW:**
```
- Full settlement chain with 4 conversion paths:
  - fiat → stablecoins (buyer deposits local fiat, converted to stablecoins)
  - stablecoins → stablecoins (single stablecoin transfer, same coin type)
  - stablecoins → fiat (seller receives stablecoins, converted to USD or HKD)
  - fiat → fiat(main) (USD or HKD delivered to seller's mainland-connected offshore account)
```

---

### 4.2 User Success — Both Parties (Carlos & Wei)

**Change:** Flexible document requirements per tranche, negotiated between parties

**Carlos — OLD:**
```
- Released upon milestone confirmation and required approval process
```

**Carlos — NEW:**
```
- Released upon payment confirmation and required approval process
- Payment approval process may require supporting documents (e.g., order, contract, invoice, logistics, customs). Document requirements negotiated between both parties.
```

**Wei Zhang — OLD:**
```
- Each payment tranche associated with seller-issued invoice
- Stablecoins received from Cregis escrow upon milestone confirmation and required approval process
```

**Wei Zhang — NEW:**
```
- Each payment tranche may be associated with various documents (e.g., order, contract, invoice, logistics, customs). Document requirements are negotiated between both parties — no mandatory single document type enforced.
- Stablecoins received and converted to USD or HKD via Everypay HK upon payment confirmation
```

---

### 4.3 MVP Section — Simplified Scope

**Change:** Removed escrow, milestone tracking, INTIME rate negotiation

**OLD:**
```
- **Anchor Markets**: Brazil BRL and Argentina ARS corridors (dual-corridor MVP)
- **Settlement Type**: Milestone-based deferred settlement (Deposit → Shipped → Customs → Final)
- **Settlement Flow**:
  1. Settlement initiated by seller (most common), buyer, or system (escrow + scheduled only)
  2. Each tranche tied to seller-issued invoice
  3. Buyer transfers local fiat (BRL/ARS) to Everypay collection account
  4. Everypay converts local currency → USDT internally
  5. USDT held in Cregis escrow (if enabled)
  6. Logistics partner provides milestone data — shipped, customs cleared
  7. Cregis releases USDT to Everypay HK upon milestone confirmation
  8. Everypay HK converts USDT → USD or HKD
  9. USD or HKD transferred to Wei's offshore Hong Kong bank account
  10. Wei receives full evidence pack (per tranche)
- **Settlement Chain**: 3-Currency Chain: Local fiat (BRL/ARS) → USDT stablecoin → USD or HKD
- **Rate Lock**: Full implementation — both PRELOCK and INTIME methods
- **Escrow Negotiation**: Full bilateral negotiation flow
- **Escrow Amount Types**: EXACT, OVER, UNDER with shortfall handling
- **Logistics Integration**: Internal integration only
```

**NEW:**
```
- **Anchor Markets**: Brazil BRL and Argentina ARS corridors (dual-corridor MVP)
- **Settlement Type**: Simple deferred settlement (no escrow in MVP)
- **Settlement Flow**:
  1. Settlement initiated by seller (most common) or buyer
  2. Each tranche may be associated with documents as negotiated between parties
  3. Buyer transfers local fiat (BRL/ARS) to Everypay collection account
  4. Everypay converts local currency → USDT
  5. Everypay HK converts USDT → USD or HKD
  6. USD or HKD transferred to Wei's offshore Hong Kong bank account
  7. Wei receives full evidence pack (per tranche)
- **Settlement Chain**: fiat → stablecoins → fiat (offshore HK)
- **Rate Lock**: PRELOCK only (rate agreed at invoice, locked)
- **Logistics Integration**: N/A in MVP
```

---

### 4.4 Out of Scope for MVP

**Added items:**
- Escrow/Cregis integration — Phase 2
- Milestone tracking (shipped, customs cleared) — Phase 2
- INTIME rate negotiation — Phase 2
- Logistics partner integration (external API) — Phase 2

---

### 4.5 Settlement Configuration Model

**Change:** Entire section marked as Phase 2

Added note: "This section applies to Phase 2 when escrow and milestone tracking are implemented."

Rate Exposure table: INTIME row annotated as "(Phase 2)"
Risk Score table: Escrow rows annotated as "(Phase 2 — not in MVP)"
Dispute Mechanism: Marked as Phase 2

---

### 4.6 User Journeys — Phase 2 Marking

**Journeys marked as Phase 2:**
- Journey 3: CFO Treasury & Risk Approver (removed escrow references)
- Journey 4: Operations Team (removed milestone tracking)
- Journey 6: Escrow Optional (marked Phase 2)
- Journey 7: Over-Escrow Negotiation (marked Phase 2)
- Journey 8: INTIME Rate Negotiation (marked Phase 2)
- Journey 9: Milestone Dispute (marked Phase 2)

**Journey Requirements Summary:** Added MVP/Phase 2 column

---

### 4.7 Trade Payment Agreement Framework

**Changes:**
- Rate method: PRELOCK (MVP), INTIME (Phase 2)
- Escrow terms, milestone tranches, approval chains marked as Phase 2
- Agreement status: Removed "NEGOTIATED" step (not needed for PRELOCK only)
- Agreement references: Simplified to Contract + Invoice only

---

### 4.8 USDT Balance States

Removed "Escrow (Cregis)" state row

---

### 4.9 Dispute Resolution

Marked as Phase 2; simplified for non-escrow MVP

---

### 4.10 Platform Licensing / Integration List / AML Freeze Order

Cregis license and freeze order integration marked as Phase 2

---

### 4.11 Innovation & Novel Patterns

Items 2, 3, 4 marked as Phase 2 (escrow/milestone/Risk Score)

---

### 4.12 Functional Requirements — Phase 2 Marking (40+ FRs)

The following FRs marked as "Phase 2 — not in MVP":

| FR | Description |
|----|-------------|
| FR6 | Escrow model in trade agreement terms |
| FR11 | Over-escrow buffer preferences |
| FR15 | INTIME rate method |
| FR17 | Over/under escrow proposal |
| FR26 | Hold USDT in Cregis escrow |
| FR27 | Release USDT upon milestone confirmation |
| FR28 | Milestone-based tranche releases |
| FR33 | INTIME rate method |
| FR37 | EXACT escrow model |
| FR38 | OVER escrow model |
| FR-N4 | INTIME 48h SLA |
| FR-N5 | INTIME auto-escalation |
| FR-N8 | UNDER escrow model |
| FR-N9 | UNDER shortfall handling |
| FR39 | Propose over-escrow buffer |
| FR40 | Accept/reject escrow amount |
| FR41 | Bilateral over-escrow approval |
| FR-N10 | One-for-all escrow |
| FR-N11 | Phased escrow |
| FR42 | Approval chain config |
| FR43 | Auto-escalate thresholds |
| FR44 | 48h SLA escalation |
| FR53 | Cregis freeze orders |
| FR54 | Freeze order logging |
| FR58 | USDT balance with escrow state |
| FR59 | Manual milestone confirmation |
| FR60 | Dispute escalation |
| FR68 | Pause with escrow |
| FR-N1 | Multi-dimensional config |
| FR-N3 | INTIME rate method |
| FR-N6 | EXACT escrow |
| FR-N7 | OVER escrow |
| FR-N12 | Risk Score |
| FR-N13 | Risk Report |
| FR-N14 | Risk Report display |
| FR-N15 | Escrow return dispute |
| FR-N16 | Penalty escrow |
| FR-N17 | System payment initiation |
| FR81 | USDT balance with escrow |

---

### 4.13 NFRs

| NFR | Change |
|-----|--------|
| Freeze Order Enforcement | Marked Phase 2 |
| Dubai Custody License | Marked Phase 2 |
| Cregis API | Marked Phase 2 |

---

## 5. Implementation Handoff

### Scope Classification: **Moderate**

### MVP Deliverables (in scope)
- Simple deferred settlement: fiat → USDT → USD/HKD
- PRELOCK rate method only
- Flexible document requirements per tranche
- Evidence pack generation
- Brazil BRL + Argentina ARS corridors

### Phase 2 Features (out of scope for MVP)
- Escrow/Cregis integration
- Milestone tracking (shipped, customs)
- INTIME rate negotiation
- Risk Score evaluation
- Over/under escrow models
- Logistics partner integration
- Dispute resolution with escrow

### Handoff Recipients
| Role | Responsibility |
|------|----------------|
| Product Manager | Finalize PRD approval, communicate scope change to stakeholders |
| Architect | Design MVP architecture excluding escrow; Phase 2 architecture separate |
| Scrum Master | Create epics/stories with MVP vs Phase 2 separation |
| Development Team | Implement MVP scope only |

### Success Criteria
- PRD approved with MVP/Phase 2 separation
- Epics/stories created with clear MVP boundary
- Architecture validates MVP simplicity

---

## 6. Files Modified

| File | Status |
|------|--------|
| `_bmad-output/planning-artifacts/prd-revised-2026-04-07.md` | ✅ Updated |

---

## 7. Next Steps

1. **Approve** this Sprint Change Proposal
2. **Communicate** scope change to stakeholders (escrow deferred to Phase 2)
3. **Proceed** to Create Architecture with MVP-only scope
4. **Create Epics & Stories** with clear MVP/Phase 2 separation
5. **Plan Phase 2** after MVP launch

---

**Prepared by:** Correct Course Workflow
**Date:** 2026-04-13
