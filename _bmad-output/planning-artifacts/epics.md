---
stepsCompleted: ["step-01-validate-prerequisites"]
inputDocuments: ["_bmad-output/planning-artifacts/prd.md", "_bmad-output/planning-artifacts/architecture.md", "_bmad-output/planning-artifacts/ux-design-specification.md"]
---

# Everypay - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Everypay, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Platform users can register and complete KYC individual verification (government ID, liveness check, address verification, sanctions screening)
FR2: Business entities can complete KYB verification with beneficial ownership declaration (>10% shareholders), authorized signatories, business activity declaration
FR3: Platform can assign RBAC roles (Viewer, Operator, Approver, Compliance, Admin) per user
FR4: Team administrators can invite and manage team members within their organization
FR5: Seller can create invoice with attached contract and line items
FR6: Seller can propose trade payment agreement terms (rate method, escrow model, milestones, approval chain)
FR7: Seller can accept or reject terms proposed by buyer
FR8: Seller can configure approval chain for high-value settlements (CFO → Treasurer → Risk Manager)
FR9: Seller can configure auto-acceptance thresholds (rate move %, payment amount threshold)
FR10: Seller can download complete evidence pack for any settlement
FR11: Seller can configure default over-escrow buffer preferences
FR12: Seller can save invoice terms as reusable template for repeat trades with the same buyer
FR13: Buyer can view invoices received from sellers
FR14: Buyer can initiate payment in local currency (BRL or ARS per corridor)
FR15: Buyer can select rate method: PRELOCK (rate locked at payment initiation) or INTIME (rate at moment of payment)
FR16: Buyer can propose trade payment agreement terms to seller
FR17: Buyer can propose over-escrow buffer amount for seller's approval
FR18: Buyer can track real-time settlement status through entire chain
FR19: Buyer can withdraw unlocked USDT balance at any time
FR20: Buyer can view upfront exchange rate and fees before confirming payment
FR21: Platform supports Brazil BRL as settlement corridor with BCB regulatory compliance
FR22: Platform supports Argentina ARS as settlement corridor with BCRA regulatory compliance (including USDT usage restrictions and blue dollar premium handling)
FR23: Platform enforces corridor-specific compliance rules at each settlement leg
FR24: Platform displays settlement status in corridor-appropriate format
FR25: Platform converts buyer local currency (BRL/ARS) to USDT upon payment initiation
FR26: Platform holds USDT in Cregis escrow upon conversion
FR27: Platform releases USDT from escrow upon verified milestone confirmation from logistics oracle
FR28: Platform supports milestone-based tranche releases (Deposit → Shipped → Customs → Final)
FR29: Platform converts released USDT to CNY via Everypay HK entity
FR30: Platform transfers CNY to seller's mainland China bank account via SAFE-compliant cross-border transfer
FR31: Platform displays full settlement chain visibility to both parties at all times
FR32: Platform offers PRELOCK rate method (rate agreed at invoice, locked until settlement)
FR33: Platform offers INTIME rate method (rate set at moment of each tranche payment)
FR34: Platform displays exchange rate and fees upfront before buyer confirms payment
FR35: Platform locks PRELOCK rate upon buyer payment confirmation
FR36: Platform supports NOESCROW model for trusted seller-buyer relationships
FR37: Platform supports EXACT escrow model (USDT amount = exact CNY obligation)
FR38: Platform supports OVER escrow model (buffer above exact CNY obligation)
FR39: Buyer can propose over-escrow buffer amount
FR40: Seller can accept, reject, or counter-propose over-escrow amount
FR41: Over-escrow requires bilateral approval before being activated
FR42: Seller can configure approval chain per account (CFO → Treasurer → Risk Manager)
FR43: Platform auto-escalates settlement for review when configured thresholds exceeded (rate move %, payment amount, corridor volatility)
FR44: Platform enforces 48-hour acceptance SLA with auto-escalation to next reviewer
FR45: Approvers can approve or reject settlements with comments
FR46: Platform logs all approval decisions with timestamp, approver identity, and comments
FR47: Platform generates timestamped, tamper-evident evidence pack per settlement
FR48: Evidence pack includes: invoice, contract, logistics milestones (shipped, customs cleared), settlement receipt
FR49: Seller can download evidence pack at any time
FR50: Platform retains all evidence for minimum 7 years
FR51: Platform can produce evidence pack within 48 hours of regulator request
FR52: Platform screens all users against OFAC, UN, EU, and local sanctions lists
FR53: Cregis can enforce regulatory freeze orders as hard blocks with no override capability
FR54: Platform logs all freeze order events with issuer, timestamp, and amount frozen
FR55: Platform maintains KYC/KYB records per regulatory requirements
FR56: Platform handles ARS corridor BCRA-specific USDT restrictions with alternative settlement path documentation
FR57: Platform implements settlement failure state machine with defined states, transitions, and rollback procedures
FR58: Platform tracks USDT balance states: available, locked for settlement, in Cregis escrow, released to HK
FR59: Operations team can trigger manual milestone confirmation with full audit trail
FR60: Platform provides dispute deadlock resolution: escalation to neutral third party or automatic split-decision mechanism after 48hr escalation
FR61: Platform guarantees USDT conversion within T+0; if conversion delayed beyond T+0, compensation clause applies
FR62: Platform can retrieve and deliver evidence pack to regulators within 48 hours of request
FR63: Platform versions invoice templates when seller updates terms; in-flight invoices continue under original template version
FR64: Platform supports simplified KYC tier for low-value, low-risk buyers with reduced verification requirements
FR65: Settlement success is defined as: SETTLED state AND Wei confirms CNY received in mainland account. Success tracked as SETTLED + CNY_CONFIRMED
FR66: Everypay HK maintains SAFE cross-border CNY documentation requirements per settlement
FR67: Platform integrates with participating bank (CITIC or equivalent) for CNY cross-border clearing
FR68: Both parties can pause settlement and enter dispute state; funds remain in Cregis escrow until resolved
FR69: Seller can view all buyer counterparties with settlement history, trust score, and total volume traded
FR70: Buyer can view all seller counterparties with invoice history, delivery performance, and total volume
FR71: Platform calculates and displays trust indicators per counterparty (settlement success rate, average delivery time, dispute rate)
FR72: Platform maintains interaction history across all settlements per counterparty pair
FR73: Buyer can view all pending invoices with due dates and payment status
FR74: Buyer can track all outgoing payments across BRL and ARS corridors
FR75: Buyer sees running balance of total owed versus total paid per seller
FR76: Platform sends automated payment reminders to buyer before due dates
FR77: Seller can view all outstanding invoices with expected payment dates and collection status
FR78: Seller can track all incoming receivables across corridors in CNY equivalent
FR79: Seller sees running balance of total billed versus total received per buyer
FR80: Platform displays aging report for receivables (0-30 days, 31-60 days, 60+ days overdue)
FR81: Platform provides real-time view of USDT holdings: available balance, locked, in escrow, released to HK
FR82: Platform provides real-time view of BRL/ARS holdings in local currency
FR83: Platform provides real-time view of CNY receipts in seller's account
FR84: Platform calculates aggregated FX exposure per counterparty and per corridor
FR85: Seller can view total currency exposure across all open settlements
FR86: Seller can set a template as default for specific buyer counterparties
FR87: Platform applies risk-based KYC: higher payment thresholds require fuller KYC/KYB verification

### NonFunctional Requirements

NFR1: Settlement Processing — Stablecoin leg (USDT conversion) completes T+0; CNY cross-border transfer completes T+1
NFR2: Real-Time Status — Settlement status updates visible to both parties within 30 seconds of state change
NFR3: Evidence Pack Retrieval — Complete evidence pack retrievable within 48 hours of regulator request
NFR4: System Response — UI operations (invoice creation, payment initiation, status check) complete within 3 seconds
NFR5: Concurrent Users — System supports 100 concurrent active settlements per corridor without performance degradation
NFR6: Data Encryption — All KYC/KYB documents encrypted at rest (AES-256); all data encrypted in transit (TLS 1.3)
NFR7: Access Control — RBAC enforced at API level; no cross-tenant data access possible
NFR8: Sanctions Screening — All users screened against OFAC, UN, EU, and local sanctions lists in real-time
NFR9: Audit Logging — All settlement events logged with timestamp, actor, action, and hash reference; immutable
NFR10: Freeze Order Enforcement — Cregis enforces freeze orders as hard blocks within 15 minutes of receipt
NFR11: Penetration Testing — Annual third-party penetration testing required
NFR12: KYC Data Retention — KYC documents retained for 7 years minimum; accessible only to Compliance role
NFR13: Corridor Expansion — Platform architecture supports new corridor addition without core platform modification
NFR14: User Growth — System scales from MVP (10 settlements) to 1000+ settlements/month with <20% performance degradation
NFR15: Geographic Distribution — Supports users from 50+ countries without infrastructure modification
NFR16: Volume Spikes — Handles 3x normal settlement volume during market volatility periods (BRL/ARS FX events)
NFR17: Settlement Completion Rate — >99% of initiated settlements reach SETTLED state
NFR18: Evidence Pack Completeness — 100% of settlements produce complete evidence pack
NFR19: System Uptime — 99.5% uptime (excluding scheduled maintenance)
NFR20: Disaster Recovery — RPO = 0; RTO < 4 hours
NFR21: HK PSP License — Everypay HK operates under HK SFC payment service provider license
NFR22: Dubai Custody License — Cregis operates under Dubai VARA custody license
NFR23: BCB Compliance (Brazil) — Brazil payment partner maintains BCB payment institution authorization
NFR24: BCRA Compliance (Argentina) — Platform implements BCRA Resolution 8430/2020 requirements for ARS corridor
NFR25: SAFE/CBIRC Compliance — Everypay HK maintains cross-border FX registration with SAFE; CNY transfers via CITIC or equivalent
NFR26: Data Residency — KYC/KYB documents stored in jurisdiction-appropriate data centers per local regulations
NFR27: AML Compliance — FATF-aligned AML/CTF program; suspicious activity reporting within regulatory timeframes
NFR28: Cregis API — 99.9% uptime for escrow operations; <1 second response time for release commands
NFR29: Brazil Payment Partner API — 99% uptime; real-time BRL confirmation
NFR30: Logistics Oracle — Webhook delivery with retry logic (3 attempts, exponential backoff); manual override for ops team
NFR31: Everypay HK FX Engine — Real-time USDT→CNY conversion; batch CNY transfer to mainland bank
NFR32: Bank Rail (CITIC/equivalent) — T+1 CNY settlement confirmation; ISO 20022 message format

### Additional Requirements

ARCH-1: Starter Template — Next.js App Router with TypeScript (strict mode), Tailwind CSS, Headless UI. Project initialized via: npx create-next-app@latest everypay-prototype --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
ARCH-2: State Management — Zustand for transient UI state only; seed JSON files are canonical data source (NOT Zustand). Store slices named use[Domain]Store (e.g., useApprovalStore, useRateLockStore)
ARCH-3: Mock API Layer — Thin service layer over Next.js Route Handlers: /src/lib/api.ts (shared fetch wrapper + mockDelay), /src/app/api/*/route.ts (Route Handlers returning seed JSON), /src/seeds/*.json (canonical mock data)
ARCH-4: Error Simulation — Mock endpoints include error simulation: random 5% timeout, 2% 500 responses to catch UI edge cases early
ARCH-5: Type System — src/lib/types.ts is canonical type definition file; all domain types (Invoice, Settlement, Approval, Counterparty) defined here; API response types co-located
ARCH-6: Component Architecture — All page components default to "use client" to avoid Server/Client boundary friction during prototyping. Extract Server Components only when optimizing post-prototype
ARCH-7: 4 Mandatory Conventions — (1) src/lib/types.ts as single source of truth, (2) Route Handler + Seed JSON co-location per API route, (3) Zustand store slice naming use[Domain]Store, (4) Shared mockDelay.ts utility
UX-1: Design System — Tailwind UI + Headless UI @headlessui/react@^2.1.0 for React 19 compatibility
UX-2: Responsive Strategy — Web-only MVP (no mobile app). Carlos (buyer): mobile-browser accessible, responsive. Wei (seller): desktop-first. CFO: desktop-first dashboard
UX-3: Custom Components — RateLockCard (celebratory confirmation), StatusTracker (multi-step progress), ApprovalCard (CFO risk summary + 1-click), EvidencePackDownload (single-click), EscrowBadge (branches on escrow_required flag), RiskSummaryRow (green/yellow/red indicators)
UX-4: Animation Tokens — rate-lock celebration: 600ms spring; fast: 150ms; normal: 250ms; slow: 400ms
UX-5: Color Palette — Trust Blue (#1E3A5F), Success Green (#10B981), Warning Amber (#F59E0B), Danger Red (#EF4444)
UX-6: Typography — Inter for UI, JetBrains Mono for amounts/rates/IDs
UX-7: Rate Lock State Machine — 0-44h active (green), 44-48h warning (amber), 48h+ expired (re-quote flow)
UX-8: Progressive Disclosure — Default view simple (e.g., "Funds secured"); tap reveals detail (e.g., "USDT held in Cregis escrow, Dubai")
UX-9: Accessibility — WCAG Level AA, 44×44px touch targets, prefers-reduced-motion respected

### FR Coverage Map

| FR | Epic |
|----|------|
| FR1-FR4 | Epic 1: User Management & Onboarding |
| FR5-FR12, FR63, FR86 | Epic 2: Seller Workflow |
| FR13-FR20 | Epic 3: Buyer Workflow |
| FR21-FR24 | Epic 4: Corridor Operations |
| FR25-FR31, FR56-FR57 | Epic 5: Settlement Engine |
| FR32-FR35 | Epic 6: Rate Management |
| FR36-FR41 | Epic 7: Escrow Negotiation |
| FR42-FR46 | Epic 8: Approval Workflow |
| FR47-FR51, FR62 | Epic 9: Evidence & Audit |
| FR52-FR55 | Epic 10: AML & Compliance |
| FR58-FR59, FR61, FR66-FR67 | Epic 11: USDT Balance & Liquidity |
| FR60, FR68 | Epic 12: Dispute Resolution |
| FR69-FR72 | Epic 13: Counterparty CRM |
| FR73-FR76 | Epic 14: Purchase Ledger |
| FR77-FR80 | Epic 15: Sales Ledger |
| FR81-FR85 | Epic 16: Account Reconciliation |
| FR64, FR87 | Epic 17: Simplified Onboarding |
| FR65 | Epic 5: Settlement Engine (cross-cutting) |

## Epic List

{{epics_list}}

<!-- Repeat for each epic in epics_list (N = 1, 2, 3...) -->

## Epic {{N}}: {{epic_title_N}}

{{epic_goal_N}}

<!-- Repeat for each story (M = 1, 2, 3...) within epic N -->

### Story {{N}}.{{M}}: {{story_title_N_M}}

As a {{user_type}},
I want {{capability}},
So that {{value_benefit}}.

**Acceptance Criteria:**

<!-- for each AC on this story -->

**Given** {{precondition}}
**When** {{action}}
**Then** {{expected_outcome}}
**And** {{additional_criteria}}

<!-- End story repeat -->
