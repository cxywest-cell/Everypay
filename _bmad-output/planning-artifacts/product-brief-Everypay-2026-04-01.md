---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments: []
date: 2026-04-01
author: Daniel
---

# Product Brief: Everypay

## Executive Summary

Everypay is a B2B cross-border settlement platform enabling Chinese mainland exporters to receive international payments via stablecoin rails, bridging volatile local currencies in developing markets to CNY. The platform integrates trade documentation, compliance evidence chains, and secure stablecoin custody, providing a compliant and efficient alternative to traditional settlement networks (SWIFT) for the developing world.

## Core Vision

### Problem Statement

Cross-border trade settlement for Chinese exporters selling to buyers in developing countries faces a fundamental infrastructure gap. Buyers in these markets — particularly in Africa, Southeast Asia, and Latin America — operate in weak local currencies with acute volatility and limited storage value. Their banking infrastructure is underdeveloped, SWIFT coverage is sparse, and the prevailing settlement networks carry inflexible, arbitrary sanctions risk. Meanwhile, Chinese exporters cannot accept volatile local currencies and need reliable, flexible settlement in CNY. The result is a broken payment chain that delays or blocks legitimate trade.

### Problem Impact

- Chinese exporters face prolonged payment delays and currency risk, impacting cash flow and financial planning
- Trade relationships are constrained by settlement uncertainty, limiting market reach
- Compliance and documentation requirements in mainland China (tax, subsidies, legal evidence chains) go unmet without proper record-keeping tied to payment milestones
- Existing solutions (SWIFT, correspondent banking) exclude developing markets and carry geopolitical risk

### Why Existing Solutions Fall Short

- **Traditional banking/SWIFT**: Limited coverage in developing nations, expensive, slow (T+3 or worse), and subject to geopolitical friction including sanctions
- **Crypto exchanges**: Do not integrate with trade procedures or provide regulatory-grade documentation; expose users to compliance risk
- **Informal channels**: No legal standing, no documentation trail, no protection for either party

### Proposed Solution

Everypay acts as the invisible settlement layer for international trade, using stablecoins (USDT/USDC) as the bridging mechanism between buyer's local currency and seller's CNY receipt. Key pillars:

1. **Stablecoin Settlement Rails** — Cregis Custody provides institutional-grade stablecoin vault and reserve management as the backbone, enabling T+0 settlement
2. **Trade Documentation Integration** — Payment milestones are tied to trade checkpoints (Deposit, Shipping, Final), generating compliance-ready evidence chains for mainland China tax and subsidy applications
3. **Policy-Based Authorization** — Secure signing through Cregis integration (Seal X) ensures tamper-proof, policy-enforced authorization of high-value settlements
4. **Regulatory Positioning** — HK-based business operations with Dubai custody licensing; aligned with Hong Kong's emerging stablecoin regulatory framework for legitimate businesses

### Key Differentiators

- **Trade-to-Payment Integration**: Unlike pure payment platforms, Everypay ties settlement to trade milestone documentation, providing legal-grade evidence chains
- **Institutional Custody Backbone**: Cregis Custody provides HSM/TEE-protected stablecoin storage with hardware-enforced policy checks — not a retail exchange
- **Geographically Inclusive**: Designed specifically for the developing world where SWIFT is weak, targeting B2B merchants excluded by traditional finance
- **Policy-Supported Jurisdiction**: HK regulatory alignment positions Everypay as a legitimate, compliant alternative backed by supportive policy
- **B2B Focus Only**: Pure business-to-business model ensures appropriate compliance, limits, and user experience for merchant users

## Target Users

### Primary Users

**User 1: Wei Zhang — Chinese Exporter Finance Manager**
- *Role*: Finance/treasury manager at a mid-size Chinese trading company exporting manufactured goods to buyers internationally
- *Context*: Wei's company sells goods internationally and needs reliable CNY settlement. His pain: buyers pay in volatile local currencies, banks are slow and unreliable, and the finance team must produce compliance-ready document chains for Chinese tax authorities and subsidy applications.
- *Goals*: Certainty of payment, auditable records, fast settlement, seamless compliance documentation
- *Problem Experience*: Currently relies on SWIFT or informal channels — both slow and lacking documentation trails. FX risk falls entirely on his company.
- *Success Vision*: One platform that handles payment, FX conversion, and delivers all documents needed for Chinese tax/subsidy filings. No more chasing buyers for payment proof.
- *Note*: May include CFO or compliance approver within Wei's organization for high-value settlement approvals.

**User 2: Carlos Mendez — Foreign Importer (Buyer)**
- *Role*: Import business owner in a South American market (Brazil, Argentina, etc.)
- *Context*: Carlos buys goods from Chinese exporters. His customers pay him in local currency (BRL, ARS, etc.), but accessing USD or CNY to pay Chinese suppliers is difficult, expensive, and often unavailable in sufficient quantities due to capital controls and FX scarcity. This is a **currency access gap** — he literally cannot get enough USD/CNY through official channels. His own BRL account is the starting point; he pushes BRL into Everypay to settle with Wei.
- *Goals*: Pay suppliers in CNY without needing to source USD himself. Keep his business moving without being blocked by FX scarcity.
- *Problem Experience*: Current alternatives are informal FX dealers (risky, no documentation), or waiting weeks for bank transfers that may not clear. Everypay bridges this gap.
- *Success Vision*: A simple interface where he pays in BRL and the Chinese supplier receives CNY — no crypto complexity visible to him. Fast, reliable, with full visibility.
- *Segmentation*: Two distinct buyer types — (a) **informal traders** (smaller volume, speed-first) and (b) **structured importers** (larger volume, compliance and documentation matter more). Both use Everypay but with different priorities.

**Payment Flow (Confirmed):**
```
Carlos (BRL) 
  → Everypay Platform (BRL collection, internal FX conversion to USDT)
  → Cregis Custody (USDT escrow, milestone-triggered release)
  → Everypay HK Entity (USDT → CNY conversion, HK free FX market)
  → Wei's mainland CNY bank account (via legal cross-border transfer)
```
- Logistics partner provides milestone data (shipped, customs cleared) as a trusted data oracle — not a platform user
- Everypay owns the FX conversion layer; HK entity serves as the FX engine for USDT↔CNY conversion
- Large institutional buyers (government procurement, SOEs) are out of scope for MVP

### Secondary Users

- **Cregis Custody** — Infrastructure partner providing stablecoin vault, reserve management, and policy-enforced signing. Critical trust and compliance anchor for the stablecoin escrow leg.
- **Everypay HK Entity** — FX conversion engine. Holds USDT, converts to CNY, executes legal cross-border transfer to mainland. Licensed under HK stablecoin framework.
- **Logistics Partner** — Trusted third-party freight forwarder/customs broker providing milestone confirmation data. Delivers tamper-evident, timestamped data to Everypay to trigger settlement release.
- **Compliance/Treasury Approvers** — Optional approvers within Wei's organization who review high-value settlements through the Everypay console before final authorization.

### User Journey

**Wei Zhang's Journey:**
1. *Onboarding*: Wei registers on Everypay, completes business KYC, links his mainland China bank account
2. *Invoice Creation*: Wei creates a new invoice for a foreign buyer, attaching the contract
3. *Payment Link*: Everypay generates a payment link/method for the buyer
4. *Status Monitoring*: Wei sees real-time status — "Fiat received → Stablecoin purchased → Escrowed with Cregis → Goods confirmed → CNY sent to account"
5. *Aha Moment*: Wei sees all trade milestones logged with timestamps and document hashes, and downloads a complete "evidence pack" for tax filing and subsidy applications
6. *Long-term*: Treasury dashboard becomes part of Wei's daily workflow — monitoring open invoices, settlement speed SLAs, and corridor performance

**Carlos Mendez's Journey:**
1. *Onboarding*: Carlos receives a payment link from Wei's invoice, or discovers Everypay independently
2. *Payment Initiation*: Carlos enters the amount in BRL — Everypay shows the CNY equivalent Wei will receive, with exchange rate and fees shown upfront
3. *Local Currency Transfer*: Carlos transfers BRL to Everypay's Brazilian collection account
4. *Settlement*: Everypay converts BRL → USDT internally; USDT enters Cregis escrow; logistics partner confirms milestones (shipped, customs); Cregis releases USDT to Everypay HK; Everypay HK converts USDT → CNY and transfers to Wei's mainland account
5. *Aha Moment*: Carlos sees "Payment complete — Supplier received CNY" — no USD sourcing needed, no crypto complexity, just simple BRL → CNY settlement
6. *Long-term*: Returns to Everypay for every supplier payment

**FX Risk Exposure Matrix:**

| Stage | Risk Bearer | Mitigation |
|-------|-------------|------------|
| BRL → USDT conversion | Carlos (buyer) | Rate lock at payment initiation, accelerated settlement |
| USDT escrow (Cregis) | Everypay (platform) | Policy-enforced release via milestone confirmation |
| USDT → CNY conversion | Everypay HK | Centralized FX management, liquidity pool |
| CNY → mainland transfer | Everypay HK | Legal channel, SAFE/CBIRC compliant |

## Success Metrics

### User Success Metrics

- **Settlement Completion Rate** — % of initiated settlements reaching SETTLED state (target: >99%)
- **Settlement Speed** — Time from Carlos initiating payment → Wei receiving CNY (TBD)
- **Document Completeness** — % of settlements with full evidence pack delivered to Wei before deadline (target: 100%)
- **User Retention** — Repeat usage rate for both Carlos and Wei (TBD)

### Business Objectives

- **Monthly Settlement Volume** — USD equivalent settled per month (TBD)
- **FX Spread Margin** — Revenue vs. cost on currency conversion (TBD)
- **Settlement Success Rate** — Target: >99% of initiated settlements complete successfully
- **User Acquisition** — New users onboarded per month (TBD)

### Key Performance Indicators

| KPI | Target | Status |
|-----|--------|--------|
| Settlement completion rate | >99% | Fixed |
| Settlement speed | TBD | Pending |
| Document completeness | 100% | Fixed |
| Monthly volume | TBD | Pending |
| FX margin | TBD | Pending |
| User retention | TBD | Pending |

### Compliance Metrics (Core)

- **Evidence Pack Completeness** — Every settlement must produce a full, timestamped evidence pack including invoice, contract, logistics milestones (shipped, customs cleared), and settlement receipt. This is non-negotiable — it is the primary proof of trading activity for audit and monitoring by authorities.
- **Audit Pass Rate** — % of internal/external audits with no critical findings related to document integrity or settlement records
- **Document Retrieval SLA** — Time to produce complete evidence pack upon request from regulators or authorities (TBD)
- **Regulatory Compliance** — 100% adherence to HK and Dubai licensing requirements; SAFE/CBIRC cross-border transfer compliance for mainland CNY delivery
- **Milestone Data Integrity** — Logistics partner data must be tamper-evident and timestamped; % of settlements with verified milestone data (target: 100%)

## MVP Scope

### Anchor Market
Brazil BRL as the sole corridor. No additional corridors until MVP is validated.

### Core Features

**Settlement Flow:**
- Carlos (buyer) initiates BRL payment via Everypay console
- Everypay converts BRL → USDT internally
- Cregis Custody holds USDT in escrow
- Logistics partner provides milestone data (shipped, customs cleared) — mechanism TBD
- Upon milestone confirmation, Cregis releases USDT to Everypay HK
- Everypay HK converts USDT → CNY and transfers to Wei's mainland bank account
- Wei receives CNY with full evidence pack

**Milestone-Based Deferred Settlement:**
- Supports payment tranches tied to trade milestones (Deposit → Shipped → Customs → Final)
- Each milestone triggers partial release from Cregis escrow
- Rate lock available at payment initiation to protect Carlos from FX movement during settlement window

**Buyer Segments (Both):**
- Informal traders: smaller volume, speed-first UX
- Structured importers: larger volume, compliance and documentation-first UX

**Platform:**
- Web-based UI only (no mobile app in MVP)
- No external API for logistics partners in MVP — internal integration only

### Out of Scope for MVP

- Additional corridors (Argentina ARS, Colombia COP, Peru PEN, etc.) — Phase 2
- Mobile application
- FX hedging instruments beyond rate locks (forward contracts, options)
- Subsidy document preparation service (evidence pack provided; application is Wei's responsibility)
- Partner/channel referral program
- API for third-party integrations
- Large institutional buyers (government procurement, SOEs)

### MVP Success Criteria

- First successful end-to-end BRL → CNY settlement completed
- Evidence pack produced for every settlement with 100% completeness
- Settlement completion rate >99%
- Both buyer segments (informal + structured) successfully onboarded and transacting
- Go/No-Go milestone: Minimum 10 successful settlements with positive user feedback

### Future Vision (Post-MVP)

- **Corridor Expansion**: Argentina ARS (high-volatility proof point), Colombia COP, Peru PEN
- **Platform**: Mobile application
- **FX Products**: Forward contracts, options for enterprise users requiring advanced hedging
- **Integration**: API for logistics partner webhook integration
- **Services**: Subsidy document preparation automation for Wei
- **Markets**: Additional Latin American and Southeast Asian corridors

<!-- Content will be appended sequentially through collaborative workflow steps -->
