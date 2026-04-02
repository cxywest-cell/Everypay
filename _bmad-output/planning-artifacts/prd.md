---
stepsCompleted: ["step-01-init", "step-02-discovery", "step-03-success", "step-04-journeys", "step-05-domain", "step-06-innovation", "step-07-project-type", "step-08-scoping", "step-09-functional"]
inputDocuments: ["_bmad-output/planning-artifacts/product-brief-Everypay-2026-04-01.md"]
documentCounts:
  briefCount: 1
  researchCount: 0
  brainstormingCount: 0
  projectDocsCount: 0
workflowType: 'prd'
date: 2026-04-01
author: Daniel
classification:
  projectType: "Web App / SaaS B2B Platform"
  domain: "Fintech — Cross-Border Payment Settlement"
  complexity: "High"
  projectContext: "greenfield"
---

# Product Requirements Document - Everypay

**Author:** Daniel
**Date:** 2026-04-01

## Success Criteria

### User Success

**Carlos (Buyer) — Foreign Importer:**
- Completes BRL → CNY payment without needing to source USD himself
- At every step, Carlos sees full settlement chain visibility:
  - BRL received by Everypay
  - USDT purchased
  - Held in Cregis escrow
  - Released upon milestone confirmation
  - CNY delivered to supplier
- No crypto complexity visible — sees only: "Payment sent, supplier received."

**Wei Zhang (Exporter) — Chinese Mainland Seller:**
- Receives CNY settlement with full transparency at every stage:
  - Payment initiated by buyer
  - Fiat received
  - Stablecoin purchased
  - Escrowed with Cregis
  - Milestone confirmed (shipped, customs cleared)
  - CNY transferred to his mainland account
- Downloads complete evidence pack (invoice, contract, logistics milestones, settlement receipt) for tax/subsidy application

**Both Parties:**
- Real-time settlement status visible throughout the entire chain
- Both buyer segments served: informal traders (speed-first) and structured importers (compliance-first)

### Business Success

- Settlement completion rate >99% of initiated settlements reaching SETTLED state
- Evidence pack completeness at 100% for every settlement
- MVP Go/No-Go: 10 successful end-to-end settlements with positive user feedback
- Settlement speed target: stablecoin leg T+0 (full chain TBD)

### Technical Success

- Cregis escrow releases USDT only upon verified milestone confirmation from logistics partner
- Everypay HK converts USDT → CNY and transfers to Wei's mainland account with full timestamped audit trail
- Evidence pack is timestamped, tamper-evident, and retrievable on demand by regulators
- 100% regulatory compliance: HK/Dubai licensing + SAFE/CBIRC cross-border CNY delivery

### Compliance (Core / Non-Negotiable)

- Every settlement must produce a full, timestamped evidence pack as proof of trading activity for audit and monitoring
- 100% adherence to HK and Dubai licensing requirements
- Milestone data from logistics partner must be tamper-evident and timestamped

## Product Scope

### MVP — Minimum Viable Product

- **Anchor Markets**: Brazil BRL and Argentina ARS corridors (dual-corridor MVP)
- **Settlement Type**: Milestone-based deferred settlement (Deposit → Shipped → Customs → Final)
- **Settlement Flow**:
  1. Buyer initiates payment in BRL or ARS via Everypay console
  2. Everypay converts local currency → USDT internally
  3. Cregis Custody holds USDT in escrow
  4. Logistics partner provides milestone data (mechanism TBD) — shipped, customs cleared
  5. Cregis releases USDT to Everypay HK upon milestone confirmation
  6. Everypay HK converts USDT → CNY
  7. CNY transferred to Wei's mainland bank account
  8. Wei receives full evidence pack
- **Rate Lock**: Full implementation — both PRELOCK (rate agreed at invoice, locked) and INTIME (rate at moment of payment) methods available
- **Escrow Negotiation**: Full bilateral negotiation flow — both parties can propose over-escrow buffer, negotiate terms, and approve
- **Buyer Segments**: Both informal traders and structured importers
- **Platform**: Web-based UI only (no mobile app)
- **Logistics Integration**: Internal integration only (no external API for logistics partners in MVP)
- **Go/No-Go**: Minimum 10 successful settlements with positive user feedback

### Out of Scope for MVP

- Additional corridors (Colombia COP, Peru PEN) — Phase 2
- Mobile application
- FX hedging instruments beyond rate locks (forward contracts, options)
- Subsidy document preparation service (evidence pack provided; application is Wei's responsibility)
- Partner/channel referral program
- API for third-party integrations
- Large institutional buyers (government procurement, SOEs)

### Growth Features (Post-MVP)

- Additional LatAm corridors: Colombia COP, Peru PEN
- Mobile application
- FX hedging instruments: forward contracts, options for enterprise users
- API for logistics partner webhook integration
- Subsidy document preparation automation
- Additional market expansion (Southeast Asia)

## User Journeys

### Journey 1: Carlos Mendez — Buyer (Success Path)

**Opening Scene:** Carlos owes a Chinese supplier 50,000 CNY. His customers paid him in BRL, but he cannot access USD to pay the supplier — a currency access gap, not a preference. He is anxious about BRL devaluing every hour.

**Rising Action:** Carlos logs into Everypay, enters 50,000 CNY equivalent in BRL. Everypay shows the exchange rate and fee upfront. Carlos confirms. He transfers BRL to Everypay's Brazilian collection account. The moment he completes the transfer, Everypay displays: "You've locked in X CNY for your supplier. Your BRL is now protected from market volatility." — Carlos feels **relief**, not just "transaction complete."

**Climax:** Carlos tracks the payment in real-time: BRL received → USDT purchased → Cregis escrow → Goods shipped → Customs cleared → CNY delivered to supplier. He sees "Payment complete — Supplier received CNY."

**Resolution:** Carlos's supplier got paid in CNY without Carlos ever sourcing USD. Carlos returns for his next payment. The emotional payoff is **anxiety → relief**.

---

### Journey 2: Wei Zhang — Exporter (Success Path)

**Opening Scene:** Wei's company sold goods to a Brazilian buyer. He needs reliable CNY settlement and must produce audit-ready documentation for Chinese tax authorities and subsidy applications.

**Rising Action:** Wei creates an invoice on Everypay, attaches the contract. The buyer pays via Everypay. Wei watches the status: Fiat received → USDT purchased → Escrowed → Shipped → Customs cleared → CNY received in his mainland account.

**Climax:** Wei downloads the complete evidence pack: invoice, contract, logistics milestones (shipped, customs cleared), settlement receipt — all timestamped, auditable, and formatted for Chinese regulatory submission. His first thought: "This is what I need for the tax bureau."

**Resolution:** Wei files the evidence pack. His next invoice is already in the system. The emotional payoff is **skepticism → trust** — Everypay immediately proved it could deliver compliance-ready documentation.

---

### Journey 3: Wei's CFO — Treasury & Risk Approver (High-Value Settlement)

**Opening Scene:** Wei submits a $250,000 settlement. Everypay policy flags it: "High-value — requires treasury review."

**Rising Action:** The CFO opens Everypay's approval queue and sees:
- Counterparty details: Carlos's company, Brazilian registration, trading history
- Settlement summary: $250,000, BRL → CNY corridor, exchange rate at initiation
- FX exposure: Current USDT/CNY rate and projected CNY amount at delivery
- Escrow amount under review
- Policy check: within single-transaction limit ✓

**Key Decision Points (Treasury Risk Management):**

1. **Rate Risk Check** — CFO evaluates: "At current USDT/CNY rate, can Everypay HK accept this payment without unacceptable FX exposure?"
2. **Liquidity Timing** — CFO decides: "Release USDT from escrow to HK now, or wait until pool threshold reached for efficient CNY conversion?"
3. **Escrow Amount Review** — If over-escrow was negotiated: CFO reviews and approves the buffer amount

**Escalation Policy (Configurable per Account):**
- CFO → Treasurer → Risk Manager (customer-defined chain)
- Auto-escalate if: rate moved >X% since initiation, payment >$X threshold, corridor volatility trigger
- Time limit: 48 hours; if no response: escalate to next reviewer

**Resolution:** CFO approves. Cregis releases → Everypay HK → CNY → Wei. Full audit trail: who approved, when, comments, rate at approval.

---

### Journey 4: Wei's Operations Team — Settlement Monitoring (Internal)

**Opening Scene:** Everypay's operations team monitors the settlement pipeline for issues.

**Rising Action:** Dashboard shows all active settlements: stages, any stuck payments, FX rates, escrow status. An alert fires — a milestone confirmation from the logistics partner failed to arrive.

**Climax:** Ops investigates: logistics partner system down? Data mismatch? Contacts the logistics partner, resolves the issue. If manual intervention required: Ops can trigger milestone confirmation with authorization.

**Resolution:** Settlement completes. Incident logged for audit. SLA breach flagged if applicable.

---

### Journey 5: Carlos — Rate Lock Scenario

**Opening Scene:** Carlos initiates a large payment. BRL is volatile — he wants FX protection.

**Rising Action:** Carlos sees the rate lock option before confirming. He locks the rate. BRL later devalues significantly. Carlos pays the locked rate — his supplier receives the agreed CNY amount.

**Resolution:** Carlos was protected from BRL devaluation. The supplier received the exact CNY agreed at invoice time. Carlos uses rate lock for all large payments going forward.

---

### Journey 6: Wei — Escrow Optional (Trusted Partner)

**Opening Scene:** Wei and Carlos have completed 20 successful settlements. Wei trusts Carlos's business.

**Rising Action:** Wei creates a new invoice and selects "No Escrow" for this shipment. Carlos receives the invoice, agrees to no-escrow terms. Wei approves.

**Flow:** Carlos pays BRL → Everypay converts → CNY → Wei directly. No milestone hold. No Cregis escrow.

**Resolution:** Faster settlement. Lower fees. Both parties benefit from established trust.

---

### Journey 7: Wei — Over-Escrow Negotiation

**Opening Scene:** USDT/CNY rate has been volatile. Wei wants protection against further movement.

**Rising Action:** Wei requests an over-escrow buffer of 5% above the exact CNY obligation. Carlos receives the request. Carlos proposes 3% instead. Wei accepts.

**Flow:** Carlos tops up escrow by 3%. Milestone confirmed. Wei accepts. Settlement proceeds.

**Resolution:** Both parties negotiated and agreed. Over-escrow is a transparent, agreed mechanism — not a penalty.

---

### Journey 8: Carlos — Milestone Dispute

**Opening Scene:** Logistics partner confirmed "shipped," but Wei claims goods were damaged in transit.

**Rising Action:** Wei disputes the milestone. Settlement is paused in Cregis escrow. Carlos and Wei negotiate. Logistics partner provides additional documentation.

**Resolution:** Both parties reach agreement. Funds released per new terms. Full dispute record logged for audit.

---

## Journey Requirements Summary

The journeys reveal the following capability requirements:

| Capability | From Journey |
|-----------|-------------|
| Real-time settlement status visibility | Carlos, Wei |
| Rate lock at payment initiation | Carlos |
| Milestone tracking (shipped, customs) | Carlos, Wei |
| Evidence pack generation | Wei |
| Treasury/approval workflow with configurable escalation | CFO |
| FX risk review before escrow release | CFO |
| Liquidity timing decision (batch/conversion) | CFO |
| Escrow optional (configurable per invoice) | Wei, Carlos |
| Over-escrow negotiation (propose + approve) | Wei, Carlos |
| Rate method: pre-lock vs. in-time | Carlos, Wei |
| Dispute pause and resolution flow | Wei, Carlos |
| Operations monitoring dashboard | Internal |
| 48-hour acceptance SLA with escalation | CFO |
| Withdraw unlocked USDT balance | Carlos |

## Trade Payment Agreement Framework

**Core Concept:**
Everypay facilitates **trade payment agreements** between buyers and sellers. The agreement is the core product object — not just a payment, but a structured, enforceable contract governing how settlement occurs.

### Agreement ↔ Trade Document Relationship

```
Trade Package (Full Record)
├── Contract (legal trade agreement between buyer and seller — external)
├── Invoice (seller-created, references contract)
├── Customs Documents (shipping, clearance — external)
├── Trade Payment Agreement (Everypay — NEW)
│   ├── Rate method: PRELOCK | INTIME
│   ├── Escrow terms: required | optional
│   ├── Escrow amount: exact | over
│   ├── Milestone tranches
│   ├── Approval chains
│   ├── References to Contract + Invoice
│   └── blockchain_ref (reserved for future on-chain mapping)
└── Amendments (versioned, both parties sign)
```

### Agreement Format

- **Structured data agreement** — machine-readable, auditable, timestamped
- Designed to serve as a **formal legal document** over time
- **Off-chain agreement** with reserved `blockchain_ref` field for future on-chain smart contract mapping
- Digital signatures from both parties provide legal weight

### Rate Determination — Two Methods

| Method | Description |
|--------|-------------|
| **Pre-Lock** | Rate agreed at invoice creation, locked regardless of market movement. Carlos protected if BRL devalues. Wei absorbs if USDT/CNY moves unfavorably. |
| **In-Time** | Rate set at moment of payment/tranche. Both parties see current market rate. Risk is shared. |

### Escrow — Three Models

| Model | Description |
|-------|-------------|
| **No Escrow** | High-trust relationships. Carlos pays BRL → Everypay converts → CNY → Wei directly. |
| **Exact Escrow** | USDT amount = exact CNY obligation at agreed rate. Held in Cregis until milestone confirmation. |
| **Over-Escrow** | Wei requests buffer above exact amount (for FX risk). Both parties negotiate and approve the over-amount. |

### Agreement Creation Flow

```
Wei creates Invoice
  → Attach Trade Payment Agreement as independent file
  OR
  → Embed payment tranche terms inside invoice

Agreement references:
  → Contract #CTR-XXX
  → Logistics milestones (from logistics partner oracle)
  → Customs reference

Agreement status: DRAFT → PROPOSED → NEGOTIATED → SIGNED → ACTIVE → FULFILLED / DISPUTED / CANCELLED
```

### Template Library

Everypay provides **platform-level agreement templates** (not seller-created):
- Template per corridor (Brazil BRL default template)
- Template per transaction size tier
- Template per relationship trust level

Wei saves completed agreements as **reusable templates** for repeat trades with the same buyer (e.g., "Wei ↔ Carlos Standard Terms"). Future invoices auto-populate from saved agreement template.

### Approval Chain (Configurable per Seller Account)

```
Policy Configuration (per account):
  ├── Auto-accept threshold: rate move < X%
  ├── Escrow required: always | never | threshold-based
  ├── Review chain: CFO → Treasurer → Risk Manager
  └── Time limit: 48 hours default

Settlement triggers review when:
  ├── Payment > $X threshold
  ├── Rate move > X% since initiation
  ├── Corridor volatility trigger
  └── Over-escrow amount exceeds Y%
```

### USDT Balance States

| State | Description | Carlos Can Withdraw? |
|-------|-------------|---------------------|
| Available balance | USDT held on platform, not committed | ✅ Yes, any time |
| Locked for settlement | Committed to a pending settlement | ❌ No |
| Escrow (Cregis) | Held in Cregis escrow, awaiting milestone | ❌ No |
| Released to HK | USDT released to Everypay HK for CNY conversion | ❌ No |
| Tranche fulfilled | CNY delivered to Wei, settlement complete | N/A |

### Platform Licensing (Enforceability)

Everypay must be **licensed** to operate as an enforceable trade payment platform:
- HK payment service provider license
- Dubai custody license (Cregis)
- Additional licenses as required by buyer-seller jurisdictions

The agreement is **legally binding** between buyer and seller through Everypay's licensed framework, digital signatures, and immutable audit log.

## Domain-Specific Requirements

### Per-Corridor Compliance Framework

Everypay operates across multiple jurisdictions with different legal and regulatory frameworks. The compliance architecture must be designed per corridor from inception:

| Corridor | Regulatory Authority | Key Requirements |
|----------|----------------------|------------------|
| Brazil (MVP) | BCB (Central Bank of Brazil) | Payment institution authorization, LGPD data privacy, CMN Resolution 4.966 |
| Argentina (MVP) | BCRA (Central Bank of Argentina) | FX control regulations, USDT usage restrictions, blue dollar premium |
| Colombia (Phase 2) | SFC / BanRep | Payment institution licensing, AML requirements |
| Peru (Phase 2) | SBS / BCRP | Payment service provider regulations |

**Architecture Implication:** Compliance logic must be corridor-aware. When a settlement moves between corridors (e.g., Carlos pays in BRL, but over-escrow involves USDT on Dubai/Cregis rail), the applicable rules from each jurisdiction apply at each leg.

### Licensing Stack

Everypay requires a multi-jurisdiction license structure to operate legally:

| Entity | License | Jurisdiction | Purpose |
|--------|---------|--------------|---------|
| Everypay HK | Payment Service Provider (PSP) license | Hong Kong | FX conversion engine, USDT → CNY |
| Cregis | Custody license | Dubai | USDT escrow, reserve management |
| Brazil Partner | Payment Institution (IP) / Payment Arranger | Brazil (BCB) | BRL collection, local rails |
| Everypay HK | SAFE/CBIRC compliance | Cross-border CNY delivery | Legal transfer to mainland China |

### KYC + KYB Requirements

Everypay is a B2B platform requiring dual verification:

| Verification | What | Who | Purpose |
|--------------|------|-----|---------|
| **KYC** (Know Your Customer) | Individual identity verification | All platform users | Anti-money laundering, fraud prevention |
| **KYB** (Know Your Business) | Business entity verification | Companies creating invoices or making large payments | Compliance with AML/CTF regulations, beneficial ownership |

**KYC Requirements:**
- Government-issued ID verification
- Facial recognition/liveness check
- Address verification
- Sanctions screening (OFAC, UN, EU, local lists)

**KYB Requirements:**
- Business registration verification (national ID, certificates)
- Beneficial ownership declaration (>10% shareholders)
- Authorized signatories list
- Business activity declaration
- AML/CTF risk classification

### AML Freeze Order Integration

**Critical Requirement:** Cregis must support regulatory freeze orders from competent authorities (FATF-aligned countries, G20 members). When a freeze order is issued:
1. Affected USDT is immediately frozen in Cregis escrow
2. No release until freeze lifted by issuing authority
3. Full audit trail: freeze order ID, issuer, timestamp, amount frozen
4. Notification to Everypay compliance team within 15 minutes

**Implementation:** Cregis Seal X policy engine must enforce freeze orders as hard blocks — no override capability even by Cregis administrators.

### Audit and Reporting Obligations

Everypay operates under strict audit requirements:

- **Evidence Pack Completeness:** 100% — every settlement must produce a complete, timestamped evidence pack
- **Document Retention:** 7 years minimum (aligned with financial record-keeping requirements)
- **Regulatory Reporting:** Ad-hoc report production within 48 hours of authority request
- **Audit Trail Immutability:** All settlement events logged with timestamp, actor, action, hash reference
- **Internal Audit:** Quarterly review of settlement records, freeze order handling, KYC/KYB compliance

### Data Classification and RBAC

| Data Class | Examples | Access Control |
|------------|----------|----------------|
| **Public** | Invoice number, settlement status | All authenticated users |
| **Internal** | FX rates, fee structure | Platform operations |
| **Confidential** | User identities, business details | Authorized personnel only |
| **Restricted** | KYC documents, freeze orders, audit logs | Compliance, legal, CTO only |

**Role-Based Access Control (RBAC):**
- **Viewer:** Read-only access to own settlements
- **Operator:** Create invoices, initiate payments
- **Approver:** Treasury/CFO review for high-value settlements
- **Compliance:** Access to KYC/KYB documents, freeze orders, audit logs
- **Admin:** Platform configuration, user management

## Innovation & Novel Patterns

### Detected Innovation Areas

**1. Trade-to-Payment Evidence Chain**
The evidence pack is the CORE product deliverable — not a compliance checkbox. Every settlement produces a complete, timestamped, tamper-evident evidence pack (invoice, contract, logistics milestones, settlement receipt) that Wei Zhang uses for Chinese tax/subsidy applications. This is the first platform where regulatory compliance *creates* user value rather than just protecting the platform. No direct equivalent in LatAm-to-China corridors.

**2. Stablecoin Escrow with Logistics Oracle**
Cregis holds USDT against a verifiable external condition — logistics milestone confirmation (shipped, customs cleared). Neither party can manipulate unilaterally. This is a trustless conditional release mechanism, not a simple escrow. Unique to Everypay in developing-market-to-China trade corridors.

**3. Per-Corridor Compliance Architecture**
Compliance logic is designed corridor-aware from Day 1. With Argentina ARS in MVP alongside Brazil BRL, Everypay implements dual-corridor compliance from inception — BCRA (Argentina) and BCB (Brazil) frameworks running in parallel. The BCRA's FX controls and USDT restrictions add complexity that must be handled differently from Brazil's approach.

**4. Dual-Compliance Framework**
HK PSP license + Dubai custody + Brazil payment institution + SAFE/CBIRC cross-border CNY delivery = 3-4 regulated entities working in concert. Creates a single-platform experience with multi-jurisdiction legal coverage. Competitors would need years to replicate this licensing stack — a durable competitive moat.

**5. Trade Payment Agreement Framework**
Complete trade relationship management inside the platform: rate methods (pre-lock vs. in-time), escrow models (none/exact/over), milestone tranches, approval chains, and configurable escalation policies. The Trade Payment Agreement is a structured data contract — not just a payment rail, but a negotiated, versioned trade relationship with full audit history.

### Validation Approach

- MVP validates with 10 successful BRL→CNY settlements with positive user feedback
- Evidence pack completeness at 100% for every settlement
- Settlement completion rate >99%
- Both informal traders and structured importers successfully onboarded

### Risk Mitigation

- **Corridor expansion risk:** Per-corridor compliance architecture allows incremental validation per market
- **Regulatory risk:** HK/Dubai licensing provides established regulatory standing; Brazil partner has BCB authorization
- **FX risk:** Rate lock mechanism protects Carlos during volatile BRL periods; over-escrow buffer for Wei
- **Technical risk:** Cregis provides institutional-grade custody infrastructure; proven stablecoin vault with policy-enforced signing

| Data Class | Examples | Access Control |
|------------|----------|----------------|
| **Public** | Invoice number, settlement status | All authenticated users |
| **Internal** | FX rates, fee structure | Platform operations |
| **Confidential** | User identities, business details | Authorized personnel only |
| **Restricted** | KYC documents, freeze orders, audit logs | Compliance, legal, CTO only |

**Role-Based Access Control (RBAC):**
- **Viewer:** Read-only access to own settlements
- **Operator:** Create invoices, initiate payments
- **Approver:** Treasury/CFO review for high-value settlements
- **Compliance:** Access to KYC/KYB documents, freeze orders, audit logs
- **Admin:** Platform configuration, user management

## SaaS B2B Specific Requirements

### Multi-Tenancy Model

| Tenant Type | Role | Description |
|-------------|------|-------------|
| **Seller tenant** | Wei Zhang + team | Creates invoices, receives CNY, manages trade agreements |
| **Buyer tenant** | Carlos Mendez + team | Initiates payments in BRL, tracks settlement status |
| **Platform operations** | Internal | Manages FX, liquidity, compliance, customer support |

**Tenant isolation:** Each settlement is isolated per seller-buyer pair. Settlement data is not shared across tenants without explicit agreement.

### RBAC Matrix

| Role | Wei (Seller) | Carlos (Buyer) | Use Case |
|------|-------------|----------------|----------|
| Viewer | View own invoices and settlements | View own payments | Day-to-day tracking |
| Operator | Create invoices, attach contracts | Initiate BRL payment | Core workflow |
| Approver | CFO/treasury review for high-value | N/A | Risk management |
| Compliance | Access KYC/KYB, freeze orders | N/A | Regulatory compliance |
| Admin | Platform configuration | N/A | System administration |

### Integration List

| Partner | Integration Type | Purpose |
|---------|-----------------|---------|
| Cregis Custody | API + policy engine | USDT escrow, freeze orders, reserve management |
| Brazil Payment Partner | Local rails API | BRL collection, Brazilian payment infrastructure |
| Logistics Partner Oracle | Webhook/internal feed | Milestone data (shipped, customs cleared) |
| Everypay HK Entity | Internal FX engine | USDT → CNY conversion, CNY cross-border transfer |

### Subscription Tiers

**MVP:** Single product tier serving both buyer segments:
- Informal traders: speed-first, minimal documentation
- Structured importers: compliance-first, full audit trail

No tiered pricing in MVP. Future (post-MVP): per-seat pricing or volume-based tiers.

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Functional Requirements

### User Management

- FR1: Platform users can register and complete KYC individual verification (government ID, liveness check, address verification, sanctions screening)
- FR2: Business entities can complete KYB verification with beneficial ownership declaration (>10% shareholders), authorized signatories, business activity declaration
- FR3: Platform can assign RBAC roles (Viewer, Operator, Approver, Compliance, Admin) per user
- FR4: Team administrators can invite and manage team members within their organization

### Seller Workflow

- FR5: Seller can create invoice with attached contract and line items
- FR6: Seller can propose trade payment agreement terms (rate method, escrow model, milestones, approval chain)
- FR7: Seller can accept or reject terms proposed by buyer
- FR8: Seller can configure approval chain for high-value settlements (CFO → Treasurer → Risk Manager)
- FR9: Seller can configure auto-acceptance thresholds (rate move %, payment amount threshold)
- FR10: Seller can download complete evidence pack for any settlement
- FR11: Seller can configure default over-escrow buffer preferences
- FR12: Seller can save invoice terms as reusable template for repeat trades with the same buyer

### Buyer Workflow

- FR13: Buyer can view invoices received from sellers
- FR14: Buyer can initiate payment in local currency (BRL or ARS per corridor)
- FR15: Buyer can select rate method: PRELOCK (rate locked at payment initiation) or INTIME (rate at moment of payment)
- FR16: Buyer can propose trade payment agreement terms to seller
- FR17: Buyer can propose over-escrow buffer amount for seller's approval
- FR18: Buyer can track real-time settlement status through entire chain
- FR19: Buyer can withdraw unlocked USDT balance at any time
- FR20: Buyer can view upfront exchange rate and fees before confirming payment

### Corridor Operations

- FR21: Platform supports Brazil BRL as settlement corridor with BCB regulatory compliance
- FR22: Platform supports Argentina ARS as settlement corridor with BCRA regulatory compliance (including USDT usage restrictions and blue dollar premium handling)
- FR23: Platform enforces corridor-specific compliance rules at each settlement leg
- FR24: Platform displays settlement status in corridor-appropriate format

### Settlement Engine

- FR25: Platform converts buyer local currency (BRL/ARS) to USDT upon payment initiation
- FR26: Platform holds USDT in Cregis escrow upon conversion
- FR27: Platform releases USDT from escrow upon verified milestone confirmation from logistics oracle
- FR28: Platform supports milestone-based tranche releases (Deposit → Shipped → Customs → Final)
- FR29: Platform converts released USDT to CNY via Everypay HK entity
- FR30: Platform transfers CNY to seller's mainland China bank account via SAFE-compliant cross-border transfer
- FR31: Platform displays full settlement chain visibility to both parties at all times
- FR56: Platform handles ARS corridor BCRA-specific USDT restrictions with alternative settlement path documentation
- FR57: Platform implements settlement failure state machine with defined states, transitions, and rollback procedures

### Rate Management

- FR32: Platform offers PRELOCK rate method (rate agreed at invoice, locked until settlement)
- FR33: Platform offers INTIME rate method (rate set at moment of each tranche payment)
- FR34: Platform displays exchange rate and fees upfront before buyer confirms payment
- FR35: Platform locks PRELOCK rate upon buyer payment confirmation

### Escrow Negotiation

- FR36: Platform supports NOESCROW model for trusted seller-buyer relationships
- FR37: Platform supports EXACT escrow model (USDT amount = exact CNY obligation)
- FR38: Platform supports OVER escrow model (buffer above exact CNY obligation)
- FR39: Buyer can propose over-escrow buffer amount
- FR40: Seller can accept, reject, or counter-propose over-escrow amount
- FR41: Over-escrow requires bilateral approval before being activated

### Approval Workflow

- FR42: Seller can configure approval chain per account (CFO → Treasurer → Risk Manager)
- FR43: Platform auto-escalates settlement for review when configured thresholds exceeded (rate move %, payment amount, corridor volatility)
- FR44: Platform enforces 48-hour acceptance SLA with auto-escalation to next reviewer
- FR45: Approvers can approve or reject settlements with comments
- FR46: Platform logs all approval decisions with timestamp, approver identity, and comments

### Evidence & Audit

- FR47: Platform generates timestamped, tamper-evident evidence pack per settlement
- FR48: Evidence pack includes: invoice, contract, logistics milestones (shipped, customs cleared), settlement receipt
- FR49: Seller can download evidence pack at any time
- FR50: Platform retains all evidence for minimum 7 years
- FR51: Platform can produce evidence pack within 48 hours of regulator request
- FR62: Platform can retrieve and deliver evidence pack to regulators within 48 hours of request

### AML & Compliance

- FR52: Platform screens all users against OFAC, UN, EU, and local sanctions lists
- FR53: Cregis can enforce regulatory freeze orders as hard blocks with no override capability
- FR54: Platform logs all freeze order events with issuer, timestamp, and amount frozen
- FR55: Platform maintains KYC/KYB records per regulatory requirements

### USDT Balance & Liquidity

- FR58: Platform tracks USDT balance states: available, locked for settlement, in Cregis escrow, released to HK
- FR59: Operations team can trigger manual milestone confirmation with full audit trail
- FR61: Platform guarantees USDT conversion within T+0; if conversion delayed beyond T+0, compensation clause applies
- FR66: Everypay HK maintains SAFE cross-border CNY documentation requirements per settlement
- FR67: Platform integrates with participating bank (CITIC or equivalent) for CNY cross-border clearing

### Dispute Resolution

- FR60: Platform provides dispute deadlock resolution: escalation to neutral third party or automatic split-decision mechanism after 48hr escalation
- FR68: Both parties can pause settlement and enter dispute state; funds remain in Cregis escrow until resolved

### Counterparty Management (CRM)

- FR69: Seller can view all buyer counterparties with settlement history, trust score, and total volume traded
- FR70: Buyer can view all seller counterparties with invoice history, delivery performance, and total volume
- FR71: Platform calculates and displays trust indicators per counterparty (settlement success rate, average delivery time, dispute rate)
- FR72: Platform maintains interaction history across all settlements per counterparty pair

### Purchase Ledger (Buyer)

- FR73: Buyer can view all pending invoices with due dates and payment status
- FR74: Buyer can track all outgoing payments across BRL and ARS corridors
- FR75: Buyer sees running balance of total owed versus total paid per seller
- FR76: Platform sends automated payment reminders to buyer before due dates

### Sales Ledger (Seller)

- FR77: Seller can view all outstanding invoices with expected payment dates and collection status
- FR78: Seller can track all incoming receivables across corridors in CNY equivalent
- FR79: Seller sees running balance of total billed versus total received per buyer
- FR80: Platform displays aging report for receivables (0-30 days, 31-60 days, 60+ days overdue)

### Account Reconciliation

- FR81: Platform provides real-time view of USDT holdings: available balance, locked, in escrow, released to HK
- FR82: Platform provides real-time view of BRL/ARS holdings in local currency
- FR83: Platform provides real-time view of CNY receipts in seller's account
- FR84: Platform calculates aggregated FX exposure per counterparty and per corridor
- FR85: Seller can view total currency exposure across all open settlements

### Template Management

- FR63: Platform versions invoice templates when seller updates terms; in-flight invoices continue under original template version
- FR86: Seller can set a template as default for specific buyer counterparties

### Simplified Onboarding (Informal Traders)

- FR64: Platform supports simplified KYC tier for low-value, low-risk buyers with reduced verification requirements
- FR87: Platform applies risk-based KYC: higher payment thresholds require fuller KYC/KYB verification

### Settlement Success Definition

- FR65: Settlement success is defined as: SETTLED state reached in system AND Wei confirms CNY received in mainland account. Success metric tracked as SETTLED + CNY_CONFIRMED.

<!-- Content will be appended sequentially through collaborative workflow steps -->
