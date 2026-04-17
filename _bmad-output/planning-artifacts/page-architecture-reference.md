# Everypay — Page Architecture Reference

**Created:** 2026-04-16
**Purpose:** Reference document for `everypay-prototype/` rearchitecture — organizes pages by user journey storylines, identifies gaps, and tracks implementation against epics.

**Scope:** `everypay-prototype/` is the canonical prototype. `prototype/` (HTML files) is a reference archive for visual/design borrowing only.

---

## 1. Role Definitions

Roles are **not mutually exclusive** — a single user can be both buyer and seller (e.g., imports from Brazil, exports to Southeast Asia). The dashboard adapts to show all relevant sections for the user's active roles.

| Role | Persona | Description |
|------|---------|-------------|
| **buyer** | Carlos (foreign importer) | Pays in local currency (BRL/ARS), tracks settlements, views counterparties, invoices, purchase ledger, KYC |
| **seller** | Wei Zhang (Chinese exporter with HK offshore) | Creates invoices, manages settlements, views sales ledger, counterparties, KYB |
| **approver** | CFO / Treasurer / Risk Manager | Approves high-value settlements, manages compliance, team, KYC tiers, admin |

**Demo user mapping:** `user-1` → buyer, `user-2` → seller, `user-3` → approver
*(In production, a single user would have multiple roles. The prototype assigns one role per demo user for simplicity.)*

**RBAC (FR3):** Platform supports Viewer, Operator, Approver, Compliance, Admin — prototype collapses to 3 visible roles.

---

## 2. User Journey Storylines

Stories organized by user journey, not by epic. Each journey is a complete flow from trigger to outcome.

### Legend
- **E:S#** = Epic:Story
- Page references use Next.js route paths
- Coverage: **Done** = page fully realizes story AC, **Partial** = page exists but gaps, **Missing** = no page or component

---

### Dashboard — `/`

All roles see all dashboard sections. A section shows empty/zeroed state when the user has no relevant data (e.g., a pure seller sees procurement section with zero outstanding).

| Section | Content | Key Stats | Source Pages |
|---------|---------|-----------|-------------|
| **Assets** | Current balance across all currencies | Total assets (USD equiv.), BRL/ARS holdings, USD/HKD offshore balance, USDT balance | FR82, FR83, FR19 |
| **Sales Awaiting Payment** | Outbound invoices sent to buyers, waiting for payment | Count outstanding, total value, aging buckets (0-30 / 31-60 / 60+ days), top 3 overdue | FR77, FR78, FR79, FR80 |
| **Procurement Awaiting Payment** | Active procurement orders created by buyer, awaiting seller response or payment | Count active, total value, upcoming due dates, top 3 soonest due | FR73, FR74, FR75 |
| **Active Settlements** | In-progress settlements with real-time status | Count active, total in-flight value, statuses (INITIATED / FIAT_RECEIVED / USDT_CONVERTED / TRANSFERRING) | FR31, FR18 |
| **Pending Approvals** | Settlements requiring approver review | Count pending, total value awaiting, oldest pending time | FR45, FR46 |
| **Recent Activity** | Chronological feed of recent events | Last 5-10 events: procurement created, invoice attached, payment made, settlement status changed, approval decision | — |
| **Stats** | Quick metrics across all domains | Trust score, counterparty count, settlement success rate, corridor exposure, compliance flags | FR71, FR84, FR85 |

**Current state:** Shows role-aware sections. Buyer sees procurement section; seller sees sales section.

---

### Journey 1: Carlos Procurement-to-Payment Flow (Buyer)

**Trigger:** Logs in → lands on Dashboard → creates or reviews procurement
**Outcome:** Payment terms negotiated & approved bilaterally → pre-payment made → cargo tracked → goods received → settlement confirmed

> **Cross-cutting:** Document interchange & sync runs through every step. **Bilateral approval chain** — both seller's and buyer's internal teams must approve terms before settlement proceeds. **Multi-round negotiation** — terms can go back and forth with counter-proposals, each potentially requiring re-approval from the counterposing party's team.

| # | Step | Stories | Documents Involved | Coverage | Notes |
|---|------|---------|--------------------|----------|-------|
| 1 | **Dashboard** | — | — | Partial | Carlos sees all sections. Procurement populated (pending invoices, upcoming due dates). Sales may be empty if not a seller |
| 2 | **Create Procurement** | E2:S2.1 | Contract/PO (upload), counterparty (seller) selection, line items, optional: product specs, customs classification codes | Partial | Buyer-side procurement creation with contract/PO upload, counterparty (seller) selection, line items. Currently seller-only flow — needs buyer mode |
| 3 | **Sync Procurement Documents** | E2:S2.1, E4:S4.5, E9:S9.1 | Contract, invoice, PO, packing list, logistics documents (bill of lading, tracking), customs clearance docs, bank transfer confirmations, insurance certificates | Partial | Contract viewer exists. Needs: buyer-uploaded PO, logistics docs, customs docs attached and visible to both parties. **Every step in this journey may attach/require any of these documents** — the system must support a unified document exchange, not a page-per-document-type model |
| 4 | **Seller Proposes Payment Terms (Round 1)** | E2:S2.3, E5:S5.1 | Proforma invoice, rate lock quote, fee breakdown (FX, platform, corridor), proposed payment schedule/milestones, attached supporting docs from Step 3 | Partial | Wei proposes PRELOCK rate, fees. Rate deviation validation (5%), fee preview missing |
| 4a | **Seller Internal Approval — Round 1** *(cross-cutting, J3)* | E8:S8.1, E8:S8.3, E8:S8.4 | All docs from Steps 2-4, internal risk assessment, counterparty profile snapshot, corridor exposure summary | Partial | Wei's internal team (CFO/Treasurer) must approve proposed terms before Carlos can see them |
| 5 | **Carlos Reviews & Counters (Round 1)** | E2:S2.4 | All docs from Steps 2-4, counter-proposal form with revised rate/terms, updated fee breakdown | Partial | Counter-propose action missing; decline flow missing. Fee breakdown (FX, platform, corridor) incomplete |
| 5a | **Buyer Internal Approval — Counter** *(cross-cutting, J3)* | E8:S8.1, E8:S8.3, E8:S8.4 | All docs from Steps 2-5, Carlos's counter-proposal, internal risk notes | Partial | Carlos's finance team must approve his counter-proposal before Wei sees it |
| 6 | **Negotiation Cycle (Round 2...N)** | E2:S2.4, E2:S2.3 | Each round: updated proposal version, diff from prior round, all attached docs, new counter-docs (revised contracts, updated POs, additional logistics proofs) | **Partial** | **Missing negotiation history/audit trail.** Each round: one party counters → their team approves → other party reviews → counters back. Needs: version history of all proposal rounds, diff view showing what changed (rate, fees, milestones), side-by-side comparison. Currently no tracking of prior proposal versions |
| 7 | **Terms Accepted** | E2:S2.4 | Final accepted proposal version (snapshot), all agreed-upon attached docs, both parties' last-approved version, signed/acknowledged contract | Partial | Accept CTA exists. Needs: final terms summary, both parties' last-approved version |
| 8 | **Confirm Payment & Rate Lock** | E2:S2.5, E5:S5.2, E5:S5.3, E7:S7.1 | Payment confirmation receipt, rate lock confirmation, NOESCROW badge/terms (if applicable), bank transfer proof | **Missing** | **Defining UX moment** — RateLockCard with celebratory micro-animation. Rate lock confirmation page needed after payment confirmation |
| 9 | **Cargo In Transit — Track Settlement** | E4:S4.1, E4:S4.2, E4:S4.4 | Bill of lading, tracking documents, customs clearance status, logistics milestone proofs (shipped, customs, arrived), insurance docs | Partial | 4-leg chain not fully displayed. Needs: logistics status overlay, cargo milestone tracking (shipped, customs, arrived). Crypto abstraction incomplete (Carlos should not see "USDT") |
| 10 | **Goods Received — Confirm Arrival** | E3:S3.5, E4:S4.3 | Goods receipt confirmation, non-receipt report with evidence (photos, inspection reports), warehouse receipt, delivery proof | Partial | "Confirm Receipt" CTA and "Report Non-Receipt" flow missing. Buyer marks cargo received → triggers settlement finalization |
| 11 | **Settlement Finalized** | E3:S3.5, E9:S9.2 | Final settlement confirmation, USD/HKD receipt proof, evidence pack (all docs from entire journey compiled), timestamped audit trail | Partial | Wei confirms USD/HKD receipt → evidence pack generated → both parties can download. Evidence Pack Download component missing |

**Document Sync Throughout:** At every step, both parties can upload/view: contracts, invoices, purchase orders, logistics documents, customs clearance docs, bank transfer confirmations, insurance certificates, inspection reports. **Implemented** — the document exchange is embedded in `/procurement/[id]`, providing a unified document-agnostic exchange layer that follows the transaction across its entire lifecycle. Invoices are one of many document types (not a standalone page).

**Bilateral Approval Summary:**
- **Seller side (Wei's team):** Steps 4 → 4a, also re-approves at step 6 if Wei counter-proposes Carlos's terms
- **Buyer side (Carlos's team):** Steps 5 → 5a, also re-approves at step 6 if Carlos counter-proposes Wei's terms
- Both approval flows share the same approval interface but with different data context (seller's queue vs buyer's queue)
- **Negotiation terminates when:** one party accepts, one party declines outright, or either party walks away

**Negotiation State Machine:**
```
PROPOSED → (seller's team approves) → SENT_TO_BUYER
SENT_TO_BUYER → Carlos accepts → ACCEPTED
SENT_TO_BUYER → Carlos counters → (buyer's team approves) → COUNTER_PROPOSED
COUNTER_PROPOSED → (buyer's team approves) → SENT_TO_SELLER
SENT_TO_SELLER → Wei accepts → ACCEPTED
SENT_TO_SELLER → Wei counters → (seller's team approves) → COUNTER_PROPOSED (loop)
```

---

### Journey 2: Wei Seller Flow — Invoice, Terms, Evidence (Seller)

**Trigger:** Logs in → lands on Dashboard → sees sales activities awaiting payment or procurement request from Carlos
**Outcome:** Invoice created → payment terms negotiated & approved bilaterally → pre-payment received → settlement tracked → evidence pack downloaded

> **Cross-cutting:** Document sync at every step. **Multi-round negotiation** — Wei proposes, Carlos counters, Wei counters back, until one accepts. Each counter may need re-approval from the proposing party's internal team.

| # | Step | Stories | Documents Involved | Coverage | Notes |
|---|------|---------|--------------------|----------|-------|
| 1 | **Dashboard — Sales Section** | E13:S13.1, E4:S4.1 | — | Partial | Dashboard should show: assets/balances, sales awaiting payment, recent settlements, stats. Currently only shows generic KPI cards and role nav |
| 2 | **Review Buyer Procurement** | E2:S2.1, E2:S2.2 | Buyer-uploaded PO, contract, product specs, customs codes, any attached supporting docs | Partial | Wei receives Carlos's procurement with contract/PO. Buyer-uploaded documents need to be visible in seller view |
| 3 | **Create Invoice / Propose Terms (Round 1)** | E2:S2.1, E2:S2.3, E5:S5.1 | Commercial invoice, proforma invoice, contract, corridor selector, template (if used), rate lock quote, fee breakdown, packing list | Partial | Contract upload, corridor selector, auto-populate from template missing. Rate deviation validation (5%), fee preview missing |
| 3a | **Seller Internal Approval Before Sending — Round 1** *(cross-cutting, J3)* | E8:S8.1, E8:S8.3, E8:S8.4 | All docs from Steps 2-3, internal risk assessment, counterparty profile, corridor exposure | Partial | Wei's CFO/Treasurer must approve terms proposal before it is sent to Carlos. If Wei counter-proposes Carlos's terms, may also need re-approval |
| 4 | **Carlos Counters (Round 1)** *(cross-cutting, mirrored from J1 step 5-5a)* | E2:S2.4 | Carlos's counter-proposal with revised terms, updated rate, any new docs attached by buyer | Partial | Carlos reviews Wei's terms, counters back. His internal team approves his counter before Wei sees it |
| 5 | **Negotiation Cycle (Round 2...N)** | E2:S2.4, E2:S2.3 | Each round: updated proposal version, diff from prior round, all attached docs, revised contracts, updated POs | **Partial** | Same gap as J1 step 6 — no negotiation history, no version diff, no side-by-side comparison of proposal rounds |
| 6 | **Terms Accepted** | E2:S2.4 | Final accepted proposal version, all agreed-upon attached docs, both parties' last-approved version | Partial | Wei accepts Carlos's final terms, or Carlos accepts Wei's |
| 7 | **Request Pre-Payment / Confirm Payment** | E2:S2.5, E5:S5.3 | Payment request, rate lock confirmation, bank transfer proof | Partial | Pre-payment request triggers buyer's payment flow. Rate lock confirmation page missing |
| 8 | **Save as Template** | E2:S2.6 | Template definition: invoice structure, line items, corridor, payment terms, default docs checklist | Partial | "Save as Template" from invoice missing. Version management, default-per-buyer (FR86) missing |
| 9 | **Track Settlement Status** | E4:S4.1, E4:S4.2, E4:S4.4 | Settlement chain docs: bank transfer confirmations, OTC conversion receipts, stablecoin transfer records, logistics docs | Partial | Real-time 30s updates (NFR2) not met. 4-leg chain detail incomplete. Wei sees full conversion chain including USDT (seller-facing, so crypto visible is OK) |
| 10 | **Confirm USD/HKD Receipt** | E3:S3.5, E4:S4.3 | Bank receipt confirmation (USD/HKD), goods receipt, non-receipt report if disputed | Partial | "Confirm Receipt" CTA and "Report Non-Receipt" flow missing |
| 11 | **View Sales Ledger** | E13:S13.1, E13:S13.2 | Invoice records, payment receipts, aging reports, running balance per buyer | Partial | Aging 0-30/31-60/60+ (S13.2), running balance per buyer (FR79) missing |
| 12 | **View FX Exposure** | E13:S13.3 | Holdings statement (BRL/ARS/USD/HKD/USDT), corridor exposure aggregation | Partial | Holdings view (FR82, FR83), corridor exposure aggregation (FR84) missing |
| 13 | **Download Evidence Pack** | E9:S9.2 | Complete evidence pack: all contracts, invoices, POs, logistics docs, customs docs, bank receipts, rate lock records, audit trail, settlement confirmation | **Missing** | No "Download Evidence Pack" button/widget. **Defining UX moment** — "One file. Everything I need." per UX spec |

**Cross-cutting:** E6:S6.1-6.2 (corridor formatting) at steps 6-9. E9:S9.1, S9.3, S9.4 (evidence generation, retention, audit log) are backend, triggered at step 7. **Document exchange** runs through every step — each interaction may attach, reference, or require viewing of multiple document types.

---

### Journey 3: Internal Approval Flow (Approver — Both Buyer & Seller Organizations)

**Trigger:** Payment terms are proposed, counter-proposed, or pre-payment requested that exceeds a configured threshold → routed to the approver's queue within that organization
**Outcome:** Terms approved/rejected with audit trail → proposal finalized or blocked

> **Intersection points:**
> - Journey 1 step 4a → **Seller's** team approves Wei's Round 1 proposal before Carlos sees it
> - Journey 1 step 5a → **Buyer's** team approves Carlos's counter before Wei sees it
> - Journey 1 step 6 (negotiation cycle) → Either side's team may re-approve counter-proposals at any round
> - Journey 2 step 3a → **Seller's** team approves before sending to Carlos
> - Journey 2 step 5 (negotiation cycle) → Same as J1 step 6, viewed from seller's perspective

| # | Step | Stories | Documents Involved | Coverage | Notes |
|---|------|---------|--------------------|----------|-------|
| 1 | **Dashboard — Approval Section** | E8:S8.3 | — | Partial | Dashboard should show: pending approval count, high-value alerts, team stats. Currently only shows generic KPI cards |
| 2 | **Open Approval Queue** | E8:S8.3 | Queue items with document previews: contracts, invoices, POs, rate lock quotes, fee breakdowns, counterparty profiles | Partial | Card-based queue exists but risk summary cards incomplete. Queue should distinguish: terms-to-approve vs pre-payment-to-approve |
| 3 | **Scan Risk Summary** | E8:S8.3, E11:S11.1 | Counterparty profile, trust indicators, corridor exposure summary, sanctions screening results, prior settlement history | Partial | Risk indicators (green/yellow/red), counterparty history, corridor exposure missing |
| 4 | **Review Documents** | E4:S4.5 | Full document set: contract, PO, invoice, proposed terms, rate lock details, all supporting attachments, negotiation history if applicable | Partial | Document viewer/panel missing — need to see contract, PO, invoice, proposed terms, rate lock details |
| 5 | **Approve or Reject** | E8:S8.4 | Approval record: approver identity, timestamp, comments, terms version snapshot | Partial | 1-click approve exists; mandatory rejection reason, audit logging incomplete |
| 6 | **Audit Trail Recorded** | E8:S8.4, E9:S9.4 | Immutable audit log: all prior approvals, rejections, comments, terms versions | **Missing** | No audit log viewer. Must capture: who approved, when, comments, terms version |
| 7 | **Bulk Review (optional)** | E8:S8.2 | Batch of approval items with summary docs | **Missing** | Bulk approve, multi-select not implemented |
| 8 | **Counter-Proposal Re-Approval** | E8:S8.1, E2:S2.4 | Updated proposal version, diff from prior approved version, all changed docs | Partial | If terms are counter-proposed after initial approval, may need re-approval cycle. Currently no tracking of approval version history, no negotiation state machine UI |

**Approval Scope by Organization:**
- **Seller's approvers:** Review Wei's outbound proposals — terms, rates, pre-payment requests. Concern: revenue risk, rate exposure, counterparty reliability.
- **Buyer's approvers:** Review Carlos's inbound commitments — payment amounts, locked rates, corridor fees. Concern: cash outflow, FX cost, supplier reliability.
- Same `/approvals` page, different data context. Both see: counterparty profile, terms, risk indicators, attached documents.

**Cross-cutting:** E8:S8.1 (approval chain config) is a prerequisite set by seller before step 1. E10:S10.1-10.2 (sanctions & KYC records) may be checked at step 2. E13:S13.3 (FX exposure) visible to CFO at step 2 as platform risk. **Document review** — approvers must see the full document set (contracts, POs, invoices, terms, rate locks, attachments) for each item in the queue.

---

### Journey 4: Onboarding & Identity Verification

**Trigger:** User registers for Everypay
**Outcome:** Verified identity with appropriate KYC/KYB tier, team access configured

| # | Step | Stories | Documents Involved | Coverage | Notes |
|---|------|---------|--------------------|----------|-------|
| 1 | **Register Account** | E1:S1.1 | Email, basic identity info | Partial | KYC initiation step not visible after registration |
| 2 | **Email Verification** | E1:S1.1 | Verification email link | **Missing** | Prototype — no email flow |
| 3 | **Individual KYC** | E1:S1.2, E10:S10.1 | Government ID (front/back), liveness check photo, proof of address (utility statement), sanctions screening results | Partial | 4-step flow (ID → Liveness → Address → Sanctions) not fully realized. Document upload missing |
| 4 | **Business KYB** | E1:S1.3, E10:S10.2 | Business registration certificate, articles of incorporation, beneficial ownership declaration (ownership %, IDs), authorized signatory list, business activity description | Partial | Beneficial ownership declaration, authorized signatories, business activity declaration missing |
| 5 | **KYC Tier Assignment** | E1:S1.6 | Tier evaluation report, threshold config, payment blocking rules | Partial | Threshold config, tier elevation prompts, payment blocking display missing |
| 6 | **Team Invitation** | E1:S1.5 | Invitation email, invitee role assignment | Partial | Invite flow with email link, revoke/cancel actions missing |
| 7 | **RBAC Role Assignment** | E1:S1.4 | Role definition, permission matrix, audit log entry | Partial | Role dropdown, permission validation, audit logging missing |

---

### Journey 5: Counterparty CRM (Buyer + Seller)

**Trigger:** User wants to review a trading partner before or after a settlement
**Outcome:** User assesses counterparty reliability and reviews interaction history

| # | Step | Stories | Documents Involved | Coverage | Notes |
|---|------|---------|--------------------|----------|-------|
| 1 | **View Counterparty List** | E11:S11.1 | Trust score summary, aggregate settlement volume, flag indicators | Partial | Trust indicators inline missing |
| 2 | **View Counterparty Profile** | E11:S11.1 | KYC/KYB status summary, settlement history records, compliance flags, trust score breakdown | Partial | Settlement history, success rate, volume display incomplete |
| 3 | **View Interaction History** | E11:S11.1 (FR72) | Timeline of all settlements, invoices, payment agreements, disputes, evidence pack availability | Partial | Chronological history timeline missing |

---

### Journey 6: Compliance & Admin Operations

**Trigger:** Regulatory event, sanctions flag, or compliance review
**Outcome:** Compliance issues resolved, records maintained

| # | Step | Stories | Documents Involved | Coverage | Notes |
|---|------|---------|--------------------|----------|-------|
| 1 | **View Compliance Queue** | E10:S10.1 | Flagged user profiles, sanctions screening results, KYC/KYB records requiring review | Partial | Sanctions queue, FLAGGED_FOR_REVIEW status display missing |
| 2 | **Review KYC/KYB Records** | E10:S10.2, E9:S9.3 | Full KYC/KYB document sets: IDs, business registrations, ownership declarations, screening reports, retention status | Partial | KYC record viewer, retention status, compliance access logging missing |
| 3 | **View Audit Log** | E9:S9.4 | Immutable audit trail: all approvals, rejections, terms versions, settlement state changes, document uploads/downloads | **Missing** | No audit log viewer page |

---

## 3. Page Inventory

Complete list of all Next.js pages in the prototype, grouped by sidebar section.

### Sidebar Structure

```
Everypay
├── Overview
│   └── Dashboard                  (all roles — shows sections per active role)
├── Procurement
│   ├── Procurement                (buyer)
│   └── Templates                  (seller)
├── Settlements
│   ├── Settlements                (buyer, seller)
│   ├── Payment Agreements         (buyer, seller)
│   └── Approvals                  (approver)
├── Ledger
│   ├── Purchase Ledger            (buyer)
│   ├── Sales Ledger               (seller)
│   └── Counterparties             (buyer, seller)
├── Compliance
│   ├── Compliance                 (approver)
│   ├── KYC                        (buyer)
│   ├── KYB                        (seller)
│   └── KYC Tiers                  (approver)
└── Team
    └── Team                       (approver)
```

**Key change:** The "Invoices" section was removed. Invoices are now treated as documents within the procurement workflow (uploaded by sellers as part of document exchange for a procurement), not as a standalone sidebar section. Buyers create procurements; sellers respond by attaching invoices to procurements.

A user with multiple roles (e.g., buyer + seller) sees the union of all role-visible pages. The dashboard shows role-aware sections: assets, sales awaiting payment, procurement awaiting payment, and statistics.

### Page List

| Route | Section | Roles | Journeys |
|-------|---------|-------|----------|
| `/login` | Auth | Public | J1, J2, J3 (auth gate) |
| `/register` | Auth | Public | J4 (auth gate) |
| `/` | Overview | All | J1:#1, J2:#1, J3:#1 |
| `/procurement` | Procurement | buyer | J1:#1, J1:#2 |
| `/procurement/create` | — | buyer | J1:#2 |
| `/procurement/[id]` | — | buyer, seller | J1:#2-7, J2:#2-3 (document exchange embedded) |
| `/payment-agreements/new` | Operations | buyer, seller | J2:#5 |
| `/payment-agreements/[id]/review` | — | buyer, seller | J1:#3-5, J2:#5 |
| `/templates` | Procurement | seller | J2:#4 |
| `/settlements` | Operations | buyer, seller | J1:#7, J2:#6 |
| `/settlements/[id]` | — | buyer, seller | J1:#7, J2:#6-7, J10 (should add evidence/audit tabs) |
| `/purchase-ledger` | Financial | buyer | J1:#8 |
| `/sales-ledger` | Financial | seller | J2:#8-9 |
| `/counterparties` | Financial | buyer, seller | J5:#1, J2:#2 |
| `/counterparties/[id]` | — | buyer, seller | J5:#2-3, J2:#2 |
| `/approvals` | Workflows | approver | J3:#2-5, J3:#7 |
| `/compliance` | Workflows | approver | J6:#1-2 |
| `/kyc` | Workflows | buyer | J4:#3 |
| `/kyb` | Workflows | seller | J4:#4 |
| `/team` | Administration | approver | J4:#6-7 |
| `/admin/kyc-tiers` | Administration | approver only | J4:#5 |

### Layout Components

| Component | File |
|-----------|------|
| Root Layout | `src/app/layout.tsx` |
| App Layout | `src/app/(app)/layout.tsx` |
| Auth Layout | `src/app/(auth)/layout.tsx` |
| Sidebar | `src/components/Sidebar.tsx` |
| Nav Config | `src/components/nav-config.ts` |
| Icons | `src/components/icons.tsx` |
| Demo User Switcher | `src/components/DemoUserSwitcher.tsx` |

---

## 4. Overloaded Pages — Suggested Sub-Navigation

### `/settlements/[id]` — 10+ stories, 3 journeys

| Tab | Content | Journeys |
|-----|---------|----------|
| Status | Current state, corridor format, rate lock | J1:#8, J2:#6 |
| Chain | 4-leg conversion detail | J1:#8, J2:#6 |
| Documents | Attached contracts, invoices | J3:#3 |
| Evidence | Download evidence pack | J2:#10 |
| Audit | Immutable audit trail | J3:#5, J6:#3 |

### `/sales-ledger` — 3 stories

| Tab | Content | Journey |
|-----|---------|---------|
| Invoices | Outstanding list, collection status | J2:#8 |
| Aging | 0-30/31-60/60+ report, running balance | J2:#8 |
| FX Exposure | Holdings, corridor exposure, reconciliation | J2:#9 |

### `/approvals` — 4 stories

| Tab | Content | Journey |
|-----|---------|---------|
| Queue | Pending approvals, approve/reject | J3:#1-4 |
| Settings | Approval chain config, auto-acceptance thresholds | J3 cross-cutting |

---

## 5. Gaps & Omissions

### 5.1 Missing Pages/Components

| What | Drives | Where It Should Go |
|------|--------|-------------------|
| **Rate Lock Confirmation page** | J1:#8 (E2:S2.5, E5:S5.2) — defining UX moment | New page or `/settlements/[id]` section with RateLockCard |
| **Evidence Pack Download** | J2:#13 (E9:S9.2) — defining UX moment | `/settlements/[id]` — Evidence tab |
| **Audit Log Viewer** | J3:#6, J6:#3 (E9:S9.4, E8:S8.4) | `/settlements/[id]` — Audit tab, or `/compliance` new tab |
| **Negotiation Version History** | J1:#6, J2:#5 (E2:S2.4) — multi-round term interchange | `/payment-agreements/[id]/review` — needs: version history list, diff view between rounds, side-by-side comparison |
| **NOESCROW Badge** | J1:#8 (E7:S7.1) | `/payment-agreements/new` |
| **Rate Lock Expiration UI** | J1:#9 edge case (E5:S5.4) | `/settlements/[id]` — Status tab |
| **USDT Balance/Withdrawal** | FR19 (no story) | Dashboard `/` or new `/balances` |
| **Payment Reminder Notifications** | FR76 (E12:S12.2) | Dashboard `/` — notification area |
| **Template Default-per-Buyer** | FR86 (E2:S2.6) | `/templates` — settings panel |

### 5.2 Missing Story Files

| Epic | Missing Stories | Impact |
|------|----------------|--------|
| E2 | S2.1-S2.6 (6 stories) | HIGH — core invoice/payment flow |
| E3 | S3.1-S3.5 (5 stories) | HIGH — settlement engine |
| E4 | S4.1-S4.5 (5 stories) | HIGH — settlement tracking UI |
| E5 | S5.1-S5.4 (4 stories) | MEDIUM — rate management |
| E6 | S6.1-S6.2 (2 stories) | LOW — corridor compliance |
| E7 | S7.1 (1 story) | LOW — NOESCROW |
| E9 | S9.1-S9.4 (4 stories) | MEDIUM — evidence & audit |

**27 of 46 stories (59%) have no story file.** Core settlement flow (Epics 2-7, E9) has Next.js pages but zero story files — pages were scaffolded without story-driven requirements.

---

## 6. Section Grouping Evaluation — Implemented

The proposed alternative grouping has been adopted. See Section 7 for rationale.

---

## 7. Decisions Made

1. **Section structure** — Adopted the proposed alternative: **Dashboard / Invoices / Settlements / Ledger / Compliance / Team**. Rationale: groups by actual user task rather than system concept. KYC/KYB moved to Compliance. Approvals moved to Settlements.
2. **Flat vs. deep** — Consolidated using sub-tabs: `/settlements/[id]` gets Status/Chain/Documents/Evidence/Audit tabs, `/approvals` gets Queue/Settings tabs, ledger pages get Invoices/Aging/FX tabs.
3. **Crypto page** — Keep crypto abstraction. No dedicated `/balances` page. Carlos never sees USDT. Wei sees settlement chain detail including USDT as part of the 4-leg flow, not a separate wallet.
4. **Public website** — Separate from the app. `prototype/website.html` remains reference archive only.
5. **KYC/KYB placement** — Moved to **Compliance** section (onboarding is a compliance function).
6. **Team visibility** — Remains approver-only for the prototype.
7. **Rate Lock page** — Embedded in `/settlements/[id]` Status tab rather than a dedicated page. The "defining UX moment" is represented by the progress bar and rate lock card within the settlement detail view.

---

## 8. Reference Files

| Purpose | File Path |
|---------|-----------|
| Sidebar | `everypay-prototype/src/components/Sidebar.tsx` |
| Nav Config | `everypay-prototype/src/components/nav-config.ts` |
| Icons | `everypay-prototype/src/components/icons.tsx` |
| App Layout | `everypay-prototype/src/app/(app)/layout.tsx` |
| Auth Layout | `everypay-prototype/src/app/(auth)/layout.tsx` |
| Root Layout | `everypay-prototype/src/app/layout.tsx` |
| Types | `everypay-prototype/src/lib/types.ts` |
| PRD | `_bmad-output/planning-artifacts/prd-revised-2026-04-07.md` |
| UX Spec | `_bmad-output/planning-artifacts/ux-design-specification.md` |
| Architecture | `_bmad-output/planning-artifacts/architecture-revised-2026-04-07.md` |
| Epics | `_bmad-output/planning-artifacts/epics.md` |
| Sprint Status | `_bmad-output/implementation-artifacts/sprint-status.yaml` |

---

## Appendix A — HTML Reference Archive

**Location:** `prototype/`
**Purpose:** Visual/design reference only. Not an active prototype. Use for borrowing UI patterns, content blocks, and visual treatments.

| File | Content Summary | Borrow For |
|------|----------------|------------|
| `console-payments.html` | Invoice list, payment agreement modal, signing overlay, 4-leg settlement chain | `/invoices`, `/payment-agreements/*`, `/settlements/[id]` |
| `console-collection.html` | Receivables, BRL/ARS holdings, settlement pipeline | `/sales-ledger`, `/settlements` |
| `console-partners.html` | Counterparty list with trust scores, profile detail, interaction history | `/counterparties`, `/counterparties/[id]` |
| `console-activities.html` | Approval queue, pending activities, activity timeline | `/approvals`, `/compliance` |
| `console-team.html` | Team list, add member flow, security key management | `/team` |
| `console-compliance.html` | AML/CTF screening, KYC record management, compliance rule config | `/compliance`, `/admin/kyc-tiers` |
| `console-crypto.html` | USDT/USDC wallet, affiliate crypto account, wallet linking | *No equivalent* — potential future page |
| `website.html` | Public marketing/landing page | *No equivalent* — separate from app |
| `login.html` / `register.html` | Auth forms | `/login`, `/register` |
| `index.html` | Dashboard hub | `/` |

### Structural Changes Already Applied (HTML → Next.js)

| HTML | Next.js Result | Change |
|------|---------------|--------|
| `console-payments.html` | `/invoices` + `/settlements` + `/payment-agreements` | **Split** into 3 pages |
| `console-collection.html` | `/purchase-ledger` + `/sales-ledger` | **Split** by role |
| `console-partners.html` | `/counterparties` | **Renamed** |
| `console-activities.html` | `/approvals` | **Mapped** — narrowed scope |
| `console-compliance.html` | `/compliance` + `/kyc` + `/kyb` | **Split** into 3 role-specific pages |
| `console-team.html` | `/team` | **Kept** — restricted to approver |
