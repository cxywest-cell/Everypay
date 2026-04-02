---
stepsCompleted: ["step-01-init", "step-02-discovery", "step-03-success", "step-04-journeys", "step-05-domain"]
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

- **Anchor Market**: Brazil BRL as sole corridor — no additional corridors until MVP validated
- **Settlement Type**: Milestone-based deferred settlement (Deposit → Shipped → Customs → Final)
- **Settlement Flow**:
  1. Carlos initiates BRL payment via Everypay console
  2. Everypay converts BRL → USDT internally
  3. Cregis Custody holds USDT in escrow
  4. Logistics partner provides milestone data (mechanism TBD) — shipped, customs cleared
  5. Cregis releases USDT to Everypay HK upon milestone confirmation
  6. Everypay HK converts USDT → CNY
  7. CNY transferred to Wei's mainland bank account
  8. Wei receives full evidence pack
- **Rate Lock**: Available at payment initiation to protect Carlos from FX movement during settlement window
- **Buyer Segments**: Both informal traders and structured importers
- **Platform**: Web-based UI only (no mobile app)
- **Logistics Integration**: Internal integration only (no external API for logistics partners in MVP)
- **Go/No-Go**: Minimum 10 successful settlements with positive user feedback

### Out of Scope for MVP

- Additional corridors (Argentina ARS, Colombia COP, Peru PEN) — Phase 2
- Mobile application
- FX hedging instruments beyond rate locks (forward contracts, options)
- Subsidy document preparation service (evidence pack provided; application is Wei's responsibility)
- Partner/channel referral program
- API for third-party integrations
- Large institutional buyers (government procurement, SOEs)

### Growth Features (Post-MVP)

- Argentina ARS corridor (high-volatility proof point)
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
| Argentina (Phase 2) | BCRA (Central Bank of Argentina) | FX control regulations, USDT usage restrictions |
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

<!-- Content will be appended sequentially through collaborative workflow steps -->
