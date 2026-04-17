---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories", "step-04-final-validation"]
inputDocuments: ["_bmad-output/planning-artifacts/prd-revised-2026-04-07.md", "_bmad-output/planning-artifacts/architecture-revised-2026-04-07.md", "_bmad-output/planning-artifacts/ux-design-specification.md"]
status: 'complete'
completedAt: '2026-04-14'
---

# Everypay - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Everypay, decomposing the requirements from the PRD (revised 2026-04-13), Architecture, and UX Design into implementable stories.

**MVP Scope Note:** Escrow/Cregis, milestone tracking, and INTIME rate negotiation are **Phase 2**. MVP epics focus on simplified settlement: fiat → USDT → USD/HKD with PRELOCK only.

## Requirements Inventory

### Functional Requirements (MVP-Focused)

**MVP Core FRs:**

FR1: Platform users can register and complete KYC individual verification (government ID, liveness check, address verification, sanctions screening)
FR2: Business entities can complete KYB verification with beneficial ownership declaration (>10% shareholders), authorized signatories, business activity declaration
FR3: Platform can assign RBAC roles (Viewer, Operator, Approver, Compliance, Admin) per user
FR4: Team administrators can invite and manage team members within their organization
FR5: Seller can create invoice with attached contract and line items
FR6: Seller can propose trade payment agreement terms (rate method PRELOCK, milestones — escrow features Phase 2)
FR7: Seller can accept or reject terms proposed by buyer
FR8: Seller can configure approval chain for high-value settlements (CFO → Treasurer → Risk Manager)
FR9: Seller can configure auto-acceptance thresholds (rate move %, payment amount threshold)
FR10: Seller can download complete evidence pack for any settlement
FR12: Seller can save invoice terms as reusable template for repeat trades with the same buyer
FR13: Buyer can view invoices received from sellers
FR14: Buyer can initiate payment in local currency (BRL or ARS per corridor)
FR15: Buyer can select rate method: PRELOCK only in MVP (INTIME — Phase 2)
FR18: Buyer can track real-time settlement status through entire chain
FR19: Buyer can withdraw unlocked USDT balance at any time
FR20: Buyer can view upfront exchange rate and fees before confirming payment
FR21: Platform supports Brazil BRL as settlement corridor with BCB regulatory compliance
FR22: Platform supports Argentina ARS as settlement corridor with BCRA regulatory compliance (including USDT usage restrictions and blue dollar premium handling)
FR23: Platform enforces corridor-specific compliance rules at each settlement leg
FR24: Platform displays settlement status in corridor-appropriate format
FR25: Platform converts buyer local currency (BRL/ARS) to USDT upon payment initiation
FR29: Platform converts USDT to USD or HKD via Everypay HK entity
FR30: Platform transfers USD or HKD to seller's offshore Hong Kong bank account via HK-compliant bank transfer
FR31: Platform displays full settlement chain visibility to both parties at all times
FR32: Platform offers PRELOCK rate method (rate agreed at invoice, locked until settlement)
FR34: Platform displays exchange rate and fees upfront before buyer confirms payment
FR35: Platform locks PRELOCK rate upon buyer payment confirmation
FR36: Platform supports NOESCROW model for trusted seller-buyer relationships (MVP default)
FR45: Approvers can approve or reject settlements with comments
FR46: Platform logs all approval decisions with timestamp, approver identity, and comments
FR47: Platform generates timestamped, tamper-evident evidence pack per settlement per tranche
FR48: Evidence pack includes: order, contract, invoice, logistics documents, customs clearance documents, and other supporting files as negotiated between parties
FR49: Seller can download evidence pack at any time
FR50: Platform retains all evidence for minimum 7 years
FR51: Platform can produce evidence pack within 48 hours of regulator request
FR52: Platform screens all users against OFAC, UN, EU, and local sanctions lists
FR55: Platform maintains KYC/KYB records per regulatory requirements
FR61: Platform guarantees USDT conversion within T+0; if conversion delayed beyond T+0, compensation clause applies
FR63: Platform versions invoice templates when seller updates terms; in-flight invoices continue under original template version
FR64: Platform supports simplified KYC tier for low-value, low-risk buyers with reduced verification requirements
FR65: Settlement success is defined as: SETTLED state reached in system AND Wei confirms USD or HKD received in offshore HK account. Success metric tracked as SETTLED + USD_HKD_CONFIRMED.
FR66: Everypay HK maintains HK offshore account documentation requirements per settlement
FR67: Platform integrates with Hong Kong bank for USD/HKD clearing and settlement
FR69: Seller can view all buyer counterparties with settlement history, trust score, and total volume traded
FR70: Buyer can view all seller counterparties with invoice history, delivery performance, and total volume
FR71: Platform calculates and displays trust indicators per counterparty (settlement success rate, average delivery time, dispute rate)
FR72: Platform maintains interaction history across all settlements per counterparty pair
FR73: Buyer can view all pending invoices with due dates and payment status
FR74: Buyer can track all outgoing payments across BRL and ARS corridors
FR75: Buyer sees running balance of total owed versus total paid per seller
FR76: Platform sends automated payment reminders to buyer before due dates
FR77: Seller can view all outstanding invoices with expected payment dates and collection status
FR78: Seller can track all incoming receivables across corridors in USD equivalent
FR79: Seller sees running balance of total billed versus total received per buyer
FR80: Platform displays aging report for receivables (0-30 days, 31-60 days, 60+ days overdue)
FR82: Platform provides real-time view of BRL/ARS holdings in local currency
FR83: Platform provides real-time view of USD/HKD receipts in seller's offshore HK account
FR84: Platform calculates aggregated FX exposure per counterparty and per corridor
FR85: Seller can view total currency exposure across all open settlements
FR86: Seller can set a template as default for specific buyer counterparties
FR87: Platform applies risk-based KYC: higher payment thresholds require fuller KYC/KYB verification
FR-N2: Platform supports PRELOCK rate method (rate locked at payment initiation)

**Phase 2 FRs (Not in MVP):**

FR11: Seller can configure default preferences (Phase 2 — over-escrow not in MVP)
FR16: Buyer can propose trade payment agreement terms to seller (Phase 2)
FR17: Buyer can propose settlement terms (Phase 2 — escrow negotiation not in MVP)
FR26: Platform holds USDT in Cregis escrow (Phase 2)
FR27: Platform releases USDT upon milestone confirmation (Phase 2)
FR28: Platform supports milestone-based tranche releases (Phase 2)
FR33: Platform offers INTIME rate method (Phase 2)
FR37: Platform supports EXACT escrow model (Phase 2)
FR38: Platform supports OVER escrow model (Phase 2)
FR39: Buyer can propose over-escrow buffer (Phase 2)
FR40: Seller can accept, reject, or counter-propose escrow amount (Phase 2)
FR41: Over-escrow requires bilateral approval (Phase 2)
FR42: Seller can configure approval chain (Phase 2)
FR43: Platform auto-escalates settlement for review (Phase 2)
FR44: Platform enforces 48-hour acceptance SLA (Phase 2)
FR53: Cregis can enforce regulatory freeze orders (Phase 2)
FR54: Platform logs all freeze order events (Phase 2)
FR56: Platform handles ARS corridor BCRA-specific USDT restrictions (Phase 2)
FR57: Platform implements settlement failure state machine (Phase 2)
FR58: Platform tracks USDT balance states with escrow (Phase 2)
FR59: Operations team can trigger manual milestone confirmation (Phase 2)
FR60: Platform provides dispute resolution (Phase 2)
FR68: Both parties can pause settlement with escrow (Phase 2)
FR81: Platform provides real-time view of USDT holdings with escrow (Phase 2)
FR-N1: Platform supports multi-dimensional settlement configuration (Phase 2)
FR-N3: Platform supports INTIME rate method (Phase 2)
FR-N4: Platform enforces 48h SLA for INTIME rate negotiation (Phase 2)
FR-N5: Platform auto-escalates INTIME negotiation (Phase 2)
FR-N6: Platform supports EXACT escrow amount type (Phase 2)
FR-N7: Platform supports OVER escrow amount type (Phase 2)
FR-N8: Platform supports UNDER escrow model (Phase 2)
FR-N9: Platform handles UNDER shortfall (Phase 2)
FR-N10: Platform supports one-for-all escrow (Phase 2)
FR-N11: Platform supports phased escrow (Phase 2)
FR-N12: Platform calculates Risk Score (Phase 2)
FR-N13: Platform generates Risk Report (Phase 2)
FR-N14: Platform displays Risk Report (Phase 2)
FR-N15: Platform supports escrow return dispute (Phase 2)
FR-N16: Platform supports penalty escrow (Phase 2)
FR-N17: Platform supports payment initiation by system (Phase 2)

### Non-Functional Requirements

NFR1: Settlement Processing — Stablecoin leg (USDT conversion) completes T+0; USD/HKD cross-border transfer completes T+1
NFR2: Real-Time Status — Settlement status updates visible to both parties within 30 seconds of state change
NFR3: Evidence Pack Retrieval — Complete evidence pack retrievable within 48 hours of regulator request
NFR4: System Response — UI operations (invoice creation, payment initiation, status check) complete within 3 seconds
NFR5: Concurrent Users — System supports 100 concurrent active settlements per corridor without performance degradation
NFR6: Data Encryption — All KYC/KYB documents encrypted at rest (AES-256); all data encrypted in transit (TLS 1.3)
NFR7: Access Control — RBAC enforced at API level; no cross-tenant data access possible
NFR8: Sanctions Screening — All users screened against OFAC, UN, EU, and local sanctions lists in real-time
NFR9: Audit Logging — All settlement events logged with timestamp, actor, action, and hash reference; immutable
NFR10: Freeze Order Enforcement — Cregis enforces freeze orders as hard blocks within 15 minutes of receipt (Phase 2)
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
NFR22: Dubai Custody License — Cregis operates under Dubai VARA custody license (Phase 2 — not required for MVP)
NFR23: BCB Compliance (Brazil) — Brazil payment partner maintains BCB payment institution authorization
NFR24: BCRA Compliance (Argentina) — Platform implements BCRA Resolution 8430/2020 requirements for ARS corridor
NFR25: HK Offshore Compliance — Everypay HK maintains HK offshore account compliance; USD/HKD transfers via HK bank rails
NFR26: Data Residency — KYC/KYB documents stored in jurisdiction-appropriate data centers per local regulations
NFR27: AML Compliance — FATF-aligned AML/CTF program; suspicious activity reporting within regulatory timeframes
NFR28: Cregis API — 99.9% uptime for escrow operations (Phase 2); <1 second response time for release commands
NFR29: Brazil Payment Partner API — 99% uptime; real-time BRL confirmation
NFR30: Everypay HK FX Engine — Real-time USDT→USD or HKD conversion; USD/HKD transfer to HK offshore account
NFR31: Bank Rail (HK bank) — T+1 USD/HKD settlement confirmation; ISO 20022 message format

### Additional Requirements (from Architecture)

ARCH-1: Starter Template — Next.js App Router with TypeScript (strict mode), Tailwind CSS, Headless UI. Project initialized via: `npx create-next-app@latest everypay-prototype --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
ARCH-2: State Management — Zustand for transient UI state only; seed JSON files are canonical data source. Store slices named `use[Domain]Store`
ARCH-3: Mock API Layer — Thin service layer: `/src/lib/api.ts` (shared fetch wrapper + mockDelay), `/src/app/api/*/route.ts` (Route Handlers returning seed JSON), `/src/seeds/*.json` (canonical mock data)
ARCH-4: Error Simulation — Mock endpoints include: random 5% timeout, 2% 500 responses
ARCH-5: Type System — `src/lib/types.ts` is canonical type definition file; all domain types defined here
ARCH-6: Component Architecture — All page components default to `"use client"`; extract Server Components only when optimizing
ARCH-7: 4 Mandatory Conventions — (1) `types.ts` single source of truth, (2) Route Handler + Seed JSON co-location, (3) Zustand store slice naming, (4) Shared `mockDelay.ts` utility
ARCH-8: MVP Settlement Flow — fiat → USDT → USD/HKD only; escrow/milestone Phase 2
ARCH-9: PRELOCK Only — MVP rate method is PRELOCK; INTIME is Phase 2

### Additional Requirements (from UX)

UX-1: Design System — Tailwind UI + Headless UI `@headlessui/react@^2.1.0` for React 19 compatibility
UX-2: Responsive Strategy — Web-only MVP. Carlos (buyer): mobile-browser accessible, responsive. Wei (seller): desktop-first
UX-3: Custom Components — RateLockCard, StatusTracker (multi-step progress), ApprovalCard, EvidencePackDownload, SettlementCard
UX-4: Animation Tokens — rate-lock celebration: 600ms spring; fast: 150ms; normal: 250ms; slow: 400ms
UX-5: Color Palette — Trust Blue (#1E3A5F), Success Green (#10B981), Warning Amber (#F59E0B), Danger Red (#EF4444)
UX-6: Typography — Inter for UI, JetBrains Mono for amounts/rates/IDs
UX-7: Rate Lock State Machine — 0-44h active (green), 44-48h warning (amber), 48h+ expired (re-quote flow)
UX-8: Progressive Disclosure — Default view simple; tap reveals detail
UX-9: Accessibility — WCAG Level AA, 44×44px touch targets, prefers-reduced-motion respected

### FR Coverage Map

| FR | Epic |
|----|------|
| FR1-FR4, FR64, FR87, FR52 | Epic 0: Project Foundation (setup), Epic 1: User Management & Onboarding |
| FR5-FR7, FR12-FR13, FR15-FR16, FR18-FR20, FR32, FR34-FR35, FR63, FR86 | Epic 2: Documents & Review Workflow |
| FR25, FR29-FR31, FR61, FR65-FR67 | Epic 3: Settlement Engine (MVP) |
| FR25, FR29-FR31, FR65-FR67 | Epic 4: Settlement Tracking |
| FR32, FR34-FR35, FR-N2 | Epic 5: Rate Management (PRELOCK) |
| FR21-FR24 | Epic 6: Corridor Operations |
| FR36 (MVP), FR37-FR41, FR-N6-FR-N11 (Phase 2) | Epic 7: NOESCROW/Escrow |
| FR8-FR9, FR42-FR46 | Epic 8: Approval Workflow |
| FR47-FR51, FR62 | Epic 9: Evidence & Audit |
| FR52-FR55 | Epic 10: AML & Compliance |
| FR69-FR72 | Epic 11: Counterparty CRM |
| FR73-FR76 | Epic 12: Purchase Ledger |
| FR77-FR80, FR82-FR85 | Epic 13: Sales Ledger |
| FR58-FR59, FR81 (Phase 2) | Epic 7: NOESCROW/Escrow (Phase 2) |

**FRs with pending story coverage:**
- FR19 (Buyer withdraw unlocked USDT balance) — needs story in Epic 3 or new epic

## Epic List

### Epic 0: Project Foundation & Mock API Contract
Initialize Next.js project, establish type system, mock API layer, and seed data structure per Architecture conventions
**FRs covered:** ARCH-1 through ARCH-9 (Architecture requirements)
**Lifecycle Phase:** Setup
**Notes:** This epic must be completed before any UI work begins

#### Story 0.1: Initialize Next.js Project with TypeScript and Tailwind

As a developer,
I want to initialize the Next.js project with the agreed technology stack and conventions,
So that the team can start building UI components with a consistent foundation.

**Acceptance Criteria:**

**Given** an empty project directory
**When** the project is initialized via `npx create-next-app@latest everypay-prototype --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
**Then** the project has: Next.js App Router structure, TypeScript strict mode enabled, Tailwind CSS configured, ESLint rules active

**Given** the project is initialized
**When** dependencies are installed
**Then** the following packages are present: `zustand`, `@headlessui/react@^2.1.0`, `tailwindcss`, `eslint`, `typescript`
**And** `package.json` scripts include: `dev`, `build`, `lint`, `start`

**Given** dependencies are installed
**When** `npm run dev` is executed
**Then** the development server starts on localhost:3000
**And** the default landing page loads without errors

**Given** the project structure is established
**When** the directory layout is created
**Then** the following directories exist:
- `src/lib/` — types.ts, api.ts, mockDelay.ts
- `src/app/api/` — Route Handlers for mock data
- `src/seeds/` — canonical mock data JSON files
- `src/components/` — reusable UI components
- `src/stores/` — Zustand store slices
- `src/app/` — page routes

---

#### Story 0.2: Establish Canonical Type System (types.ts)

As a developer,
I want all domain types defined in a single `src/lib/types.ts` file,
So that every component and API route shares the same type definitions.

**Acceptance Criteria:**

**Given** the project has `src/lib/types.ts`
**When** domain types are defined
**Then** the file exports: `User`, `Organization`, `Role`, `Invoice`, `InvoiceLineItem`, `Settlement`, `SettlementLeg`, `TradePaymentAgreement`, `RateLock`, `EvidencePack`, `Counterparty`, `ApprovalChain`, `AuditLog`, `Corridor`, `KYCStatus`, `KYBStatus`, `InvoiceTemplate`, `Notification`

**Given** each domain type is defined
**When** API response types are created
**Then** the file exports: `SettlementResponse`, `InvoiceResponse`, `RateLockResponse`, `EvidencePackResponse`, `CounterpartyResponse`, `ApprovalResponse`
**And** each response type includes a `status` field matching the domain entity states

**Given** the type system is complete
**When** TypeScript compilation runs
**Then** `tsc --noEmit` passes with zero errors in strict mode
**And** no `any` types exist in `types.ts`

**Given** the `Settlement` type is defined
**When** settlement status enum is created
**Then** it includes: `INITIATED`, `FIAT_RECEIVED`, `USDT_CONFIRMED`, `FIAT_TO_USDT_COMPLETE`, `USDT_TO_FIAT_IN_PROGRESS`, `FIAT_CONVERSION_CONFIRMED`, `USD_HKD_READY`, `TRANSFER_IN_PROGRESS`, `TRANSFERRED`, `SETTLED_PENDING_CONFIRMATION`, `SETTLED`, `FAILED`, `DISPUTED`

**Given** the `RateLock` type is defined
**When** rate lock states are created
**Then** it includes: `PROPOSED`, `ACCEPTED`, `LOCKED`, `EXPIRED`
**And** includes fields: `locked_rate`, `expiry_at`, `market_rate_at_lock`

**Given** the `InvoiceTemplate` type is defined (per FR63)
**When** template versioning is supported
**Then** it includes: `version`, `is_default_for_buyer`, `created_at`, `superseded_by`

---

#### Story 0.3: Establish Mock API Layer and Seed Data

As a developer,
I want a mock API layer with seed JSON data and simulated network latency,
So that UI components can be built and tested without a real backend.

**Acceptance Criteria:**

**Given** `src/lib/api.ts` exists
**When** the shared fetch wrapper is implemented
**Then** it exports: `mockFetch(url, options)` that returns seed data from JSON files
**And** applies `mockDelay(ms)` with random jitter (300-800ms default)
**And** simulates errors: 5% random timeout, 2% random 500 responses

**Given** `src/lib/mockDelay.ts` exists
**When** the utility is called
**Then** it returns a Promise that resolves after the specified ms
**And** the delay is configurable for test scenarios (instant mode for CI)

**Given** seed JSON files exist in `src/seeds/`
**When** the initial seed data is created
**Then** the following files exist:
- `seeds/users.json` — sample users (Carlos, Wei, CFO)
- `seeds/invoices.json` — sample invoices in DRAFT, SENT, PAID states
- `seeds/settlements.json` — sample settlements in various states
- `seeds/rate_locks.json` — sample rate lock records
- `seeds/counterparties.json` — sample buyer/seller relationships
- `seeds/approval_chains.json` — sample approval configurations

**Given** Route Handlers exist in `src/app/api/*/route.ts`
**When** API endpoints are created
**Then** the following endpoints exist:
- `GET /api/users/:id` — returns user from seed data
- `GET /api/invoices` — returns list of invoices
- `GET /api/invoices/:id` — returns single invoice
- `POST /api/invoices` — creates new invoice (updates seed)
- `GET /api/settlements` — returns list of settlements
- `GET /api/settlements/:id` — returns single settlement
- `GET /api/rate-locks/:settlementId` — returns rate lock info
- `GET /api/counterparties` — returns counterparty list
- `GET /api/evidence-packs/:settlementId` — returns evidence pack

**Given** each Route Handler reads from seed JSON
**When** the handler processes a request
**Then** it returns the appropriate JSON response with correct HTTP status
**And** simulates network latency via `mockDelay`
**And** `POST` handlers update the in-memory seed data

**Given** the mock API layer is complete
**When** `npm run dev` is running
**Then** all API endpoints return valid JSON responses
**And** error simulation occasionally triggers (5% timeout, 2% 500)
Users can register, complete KYC/KYB verification, manage profiles, and configure team access
**FRs covered:** FR1-FR4, FR64, FR87
**Lifecycle Phase:** Setup
**Notes:** Documents embedded as user identity verification docs

#### Story 1.1: User Registration with Email

As a prospective user,
I want to register on the platform using my email address,
So that I can access the Everypay platform and begin the onboarding process.

**Acceptance Criteria:**

**Given** a prospective user has a valid email address
**When** they complete the registration form with email, password, and basic profile information
**Then** the system creates a user account with PENDING verification status
**And** sends a verification email to the provided email address
**And** logs the registration timestamp

**Given** the user clicks the verification link in the email
**When** the link is valid and not expired
**Then** the user's email is marked as verified
**And** the user can proceed to KYC initiation

**Given** the verification link has expired (24 hours)
**When** the user clicks the expired link
**Then** the system displays "Link expired, please request a new verification email"
**And** logs the expired link access attempt

**Given** the user attempts to register with an email already in the system
**When** they submit the registration form
**Then** the system returns an error message "An account with this email already exists"
**And** no new account is created

---

#### Story 1.2: Individual KYC Verification (Government ID + Liveness)

As an individual user,
I want to submit my government-issued ID and complete a liveness check,
So that I can verify my identity to meet regulatory requirements.

**Acceptance Criteria:**

**Given** a registered user with verified email
**When** they initiate KYC individual verification
**Then** the system presents a step-by-step flow: ID upload → Liveness check → Address verification → Sanctions screening

**Given** the user uploads a government-issued ID (passport, national ID, or driver's license)
**When** the image is captured and submitted
**Then** the system stores the document securely (encrypted at rest per NFR6)
**And** logs the upload timestamp, document type, and storage reference

**Given** the user completes the liveness check (selfie + random action verification)
**When** the liveness check passes
**Then** the system marks liveness as verified
**And** the KYC status progresses to "DOCUMENTS_UNDER_REVIEW"

**Given** the user fails the liveness check
**When** the system detects spoofing or unclear selfie
**Then** the system prompts the user to retry the liveness check
**And** logs the failure reason for compliance review

**Given** all KYC documents are submitted and pass automated screening
**When** sanctions screening completes (per FR52 and NFR8)
**Then** the KYC status updates to "VERIFIED"
**And** the user gains access to full platform features

---

#### Story 1.3: Business Entity KYB Verification with Beneficial Ownership

As a business administrator,
I want to register my company and declare beneficial ownership,
So that my business can operate on the Everypay platform with proper verification.

**Acceptance Criteria:**

**Given** a user with verified individual KYC
**When** they initiate KYB for their business entity
**Then** the system presents KYB flow: Business details → Authorized signatories → Beneficial owners → Business activity declaration

**Given** the user submits business registration documents (certificate of incorporation, articles of association)
**When** the documents are uploaded and validated
**Then** the system stores them securely
**And** logs the submission with timestamp and document type

**Given** the user declares beneficial owners (>10% shareholders per FR2)
**When** they add each beneficial owner with ID information
**Then** the system validates each owner's identity via KYC check
**And** flags any beneficial owner that requires enhanced due diligence

**Given** all beneficial owners pass sanctions screening
**When** the KYB submission is complete
**Then** the business entity status updates to "VERIFIED"
**And** the business can initiate settlement activities

**Given** a beneficial owner fails sanctions screening
**When** the screening results return a match
**Then** the system flags the entity for compliance review
**And** creates a compliance queue entry for Epic 10 (AML & Compliance) investigation

---

#### Story 1.4: RBAC Role Assignment per User

As a platform administrator,
I want to assign RBAC roles to users within my organization,
So that users have appropriate access levels based on their responsibilities.

**Acceptance Criteria:**

**Given** an Admin user is accessing the user management section
**When** they view the list of organization users
**Then** the system displays each user's current role, status, and last active timestamp

**Given** an Admin selects a user to modify their role
**When** they choose from available roles (Viewer, Operator, Approver, Compliance, Admin)
**Then** the system validates the Admin has permission to assign this role
**And** updates the user's role in the users table
**And** logs the role change with timestamp and Admin ID in audit_log

**Given** an Admin attempts to assign a role outside their permission scope
**When** they submit the role change
**Then** the system rejects the request with "Insufficient permissions" error
**And** logs the attempted unauthorized action in audit_log

**Given** a role change is successful
**When** the affected user next logs in or makes an API call
**Then** the new role permissions are enforced immediately
**And** previous role permissions are revoked

---

#### Story 1.5: Team Member Invitation and Management

As a team administrator,
I want to invite and manage team members within my organization,
So that I can add colleagues to the platform and configure their access.

**Acceptance Criteria:**

**Given** an organization Admin or Operator is in the team management section
**When** they initiate a new team member invitation
**Then** the system requires: email address, role assignment, and optional personal message

**Given** the Admin submits a valid team member invitation
**When** the email is not already in the organization
**Then** the system sends an invitation email with unique acceptance link
**And** displays the invitation as "PENDING" in the team management list

**Given** the invitee clicks the acceptance link
**When** the link is valid and not expired (72 hours)
**Then** the invitee is directed to complete registration if new
**And** upon completion, they join the organization with assigned role

**Given** the invitee email already exists in another organization
**When** they attempt to accept the invitation
**Then** the system prompts them to either create new account or request organization transfer
**And** logs the conflict for Admin review

**Given** the Admin cancels a pending invitation
**When** they click "Revoke Invitation"
**Then** the invitation link is invalidated
**And** the invitation status updates to "CANCELLED"

**Given** the Admin removes a team member from the organization
**When** they confirm the removal action
**Then** the user's access is immediately revoked
**And** their data is retained per compliance requirements (NFR12)

---

#### Story 1.6: Risk-Based KYC Tier Configuration

As a platform administrator,
I want the system to apply risk-based KYC with different verification levels,
So that higher payment thresholds require fuller verification while low-risk users face reduced friction.

**Acceptance Criteria:**

**Given** a user initiates a payment above the standard KYC threshold
**When** the user triggers a transaction that exceeds their current KYC tier limit
**Then** the system evaluates the user's current KYC tier against the transaction amount
**And** determines if enhanced verification is required based on configured thresholds

**Given** a user with Tier 1 KYC (simplified) initiates a high-value payment
**When** the amount exceeds the Tier 1 limit (FR64)
**Then** the system prompts the user to complete Tier 2 or Tier 3 verification
**And** blocks the payment until required KYC is completed

**Given** a user completes additional KYC requirements to elevate their tier
**When** Compliance system validates the additional documents
**Then** the user's KYC tier is updated
**And** the new tier applies to all future transactions

### Epic 2: Documents & Review Workflow
Seller creates invoices with contracts and line items; proposes payment agreement terms (PRELOCK rate); buyer reviews, accepts or negotiates; both parties can save and reuse invoice templates
**FRs covered:** FR5-FR7, FR12-FR13, FR15-FR16, FR18-FR20, FR32, FR34-FR35, FR63, FR86
**Lifecycle Phase:** Pre-Settlement
**Documents:** Seller uploads agreement docs; buyer uploads payment docs; both parties view

#### Story 2.1: Seller Creates Invoice with Contract and Line Items

As a seller,
I want to create an invoice with contract attachment and line items,
So that I can initiate a trade payment with my buyer.

**Acceptance Criteria:**

**Given** a seller with VERIFIED KYB status is in the invoice creation flow
**When** they enter: buyer counterparty, line items (description, quantity, unit price, currency), and attach a contract document
**Then** the system creates an invoice with status "DRAFT"
**And** logs the invoice ID, seller ID, buyer ID, total amount, and creation timestamp

**Given** the seller is creating an invoice
**When** they select a corridor (BRL or ARS per FR21-FR22)
**Then** the system displays corridor-specific compliance requirements
**And** formats amounts in corridor-appropriate currency

**Given** the seller uploads a contract document (PDF, image)
**When** the upload completes
**Then** the system stores the document securely (encrypted at rest per NFR6)
**And** associates it with the invoice record
**And** logs the upload timestamp and document type

**Given** the seller submits the invoice for buyer review
**When** they click "Send to Buyer"
**Then** the invoice status changes from "DRAFT" to "SENT"
**And** the buyer receives a notification

**Given** the seller has created invoices before
**When** they start a new invoice for an existing buyer counterparty
**Then** the system offers to auto-populate from a saved template (per FR12, FR86)

---

#### Story 2.2: Buyer Views Received Invoices

As a buyer,
I want to view invoices I have received from sellers,
So that I can review the terms and decide whether to proceed with payment.

**Acceptance Criteria:**

**Given** a buyer with VERIFIED KYB status is on their dashboard
**When** they view the "Pending Invoices" section (per FR73)
**Then** the system displays: invoice number, seller name, total amount, currency, due date, status

**Given** the buyer selects a specific invoice
**When** they open the invoice detail view
**Then** the system displays: line items, attached contract, payment agreement terms (if any), PRELOCK rate (if offered)

**Given** the buyer views the attached contract
**When** they click "View Contract"
**Then** the system opens the document in a read-only viewer
**And** provides a download option

**Given** the buyer has no pending invoices
**When** they view the invoice list
**Then** the system displays an empty state: "No pending invoices" with a CTA to search for seller invoices

---

#### Story 2.3: Seller Proposes Payment Agreement Terms (PRELOCK Rate)

As a seller,
I want to propose payment agreement terms including a PRELOCK rate,
So that the buyer and I can agree on the rate before payment initiation.

**Acceptance Criteria:**

**Given** a seller has created an invoice
**When** they click "Propose Payment Terms"
**Then** the system displays: current market rate as reference, PRELOCK rate input field, and fee breakdown preview

**Given** the seller enters a proposed PRELOCK rate
**When** the rate is within acceptable deviation (5% from market)
**Then** the system stores the proposal as "PROPOSED" in the rate_lock record
**And** displays upfront exchange rate and fees (per FR34)
**And** notifies the buyer of the proposal

**Given** the seller enters a rate outside acceptable deviation
**When** they attempt to submit
**Then** the system displays an error: "Proposed rate exceeds 5% deviation from market rate"
**And** prevents submission

**Given** the seller submits payment agreement terms
**When** the proposal is submitted
**Then** the Trade Payment Agreement status is "PROPOSED"
**And** it references the invoice and contract
**And** the buyer can accept or counter-propose (per FR7, FR16)

---

#### Story 2.4: Buyer Accepts or Counter-Proposes Payment Terms

As a buyer,
I want to accept or counter-propose payment agreement terms from a seller,
So that we can agree on the rate and terms before I initiate payment.

**Acceptance Criteria:**

**Given** a buyer has received a payment agreement proposal from a seller
**When** they view the proposal details
**Then** the system displays: proposed rate, fee breakdown, total amount in local currency, rate lock expiry window (48h per UX spec)

**Given** the buyer accepts the proposed terms
**When** they click "Accept Terms"
**Then** the Trade Payment Agreement status changes to "ACCEPTED"
**And** both parties are notified
**And** the buyer can proceed to payment initiation

**Given** the buyer wants to counter-propose different terms
**When** they modify the rate or terms and submit
**Then** the proposal status changes to "COUNTER_PROPOSED"
**And** the seller receives notification of the counter-proposal
**And** the seller can accept or counter again (per FR7)

**Given** the buyer declines the proposal
**When** they click "Decline"
**Then** the proposal status changes to "REJECTED"
**And** the seller is notified
**And** the seller must create a new proposal to proceed

---

#### Story 2.5: Buyer Initiates Payment with PRELOCK Rate Selection

As a buyer,
I want to initiate a payment in my local currency (BRL or ARS) after accepting payment terms,
So that the settlement process begins and the rate is locked.

**Acceptance Criteria:**

**Given** a buyer has an ACCEPTED payment agreement with PRELOCK rate
**When** they view the payment initiation screen
**Then** the system displays: locked rate, total amount in local currency, fee breakdown (FX fee, platform fee, corridor fee), and estimated delivery date

**Given** the buyer confirms the payment details
**When** they click "Confirm Payment"
**Then** the system locks the PRELOCK rate (status: "LOCKED" per FR35)
**And** logs the RATE_LOCKED event with timestamp and rate value
**And** initiates the settlement process (Epic 3 Story 3.1)
**And** displays a confirmation screen with "Rate locked — funds secured"

**Given** the buyer sees the complete fee breakdown before confirmation
**When** they decline to proceed
**Then** no payment is initiated
**And** the PRELOCK rate remains in "ACCEPTED" status (not "LOCKED")
**And** the buyer can return to initiate later

**Given** the buyer initiates payment for a corridor (BRL or ARS)
**When** the payment is confirmed
**Then** the system displays the amount in corridor-appropriate format (per FR24)
**And** uses JetBrains Mono font for all amounts (per UX spec)

---

#### Story 2.6: Seller Saves Invoice as Reusable Template

As a seller,
I want to save completed invoice terms as a reusable template for a specific buyer counterparty,
So that future invoices auto-populate and I save time on repeat trades.

**Acceptance Criteria:**

**Given** a seller has sent an invoice to a buyer
**When** they view the completed invoice
**Then** the system offers "Save as Template" option

**Given** the seller clicks "Save as Template"
**When** they provide a template name (or accept auto-generated name)
**Then** the system stores: line item structure, contract reference, payment terms, and buyer counterparty association
**And** the template status is "ACTIVE"

**Given** the seller sets a template as default for a buyer (per FR86)
**When** they configure the template settings
**Then** the system associates the template as default for that buyer counterparty
**And** future invoices for that buyer auto-populate from the template

**Given** the seller updates a saved template
**When** they modify the template terms
**Then** the system creates a new version of the template (per FR63)
**And** in-flight invoices continue using the original template version
**And** new invoices use the latest template version

**Given** the seller creates a new invoice for a buyer with a default template
**When** they start the invoice flow
**Then** the system pre-fills all template fields
**And** the seller can modify any field before submission

---

### Epic 3: Settlement Engine (MVP)
Platform processes settlements: fiat → USDT → USD/HKD delivered to seller's offshore HK account
**FRs covered:** FR25, FR29-FR31, FR65-FR67
**Lifecycle Phase:** Settlement
**Notes:** Simplified MVP flow; documents embedded for tracking

#### Story 3.1: Initialize Settlement on Payment Confirmation

As a platform,
I want to initialize a settlement record when buyer confirms payment,
So that the settlement can be tracked through all conversion legs.

**Acceptance Criteria:**

**Given** a buyer has accepted PRELOCK terms and clicks "Confirm Payment"
**When** the payment confirmation is received by the system
**Then** the system creates a settlement record with status "INITIATED"
**And** logs the settlement ID, buyer ID, seller ID, agreement ID, locked rate, and amounts
**And** creates the first settlement_leg record for fiat deposit

**Given** a settlement is initialized
**When** the system records the event
**Then** the audit_log entry includes: SETTLEMENT_INITIATED, timestamp, actor (system), settlement_id, agreement terms

---

#### Story 3.2: Process Fiat to USDT Conversion (Leg 1)

As a platform,
I want to convert buyer's local fiat (BRL/ARS) to USDT when payment is confirmed,
So that the settlement moves to the stablecoin leg.

**Acceptance Criteria:**

**Given** a settlement with status "INITIATED" and buyer has transferred fiat to Everypay collection account
**When** the Brazil payment partner (BCB compliant) or Argentina payment partner (BCRA compliant) confirms fiat receipt
**Then** the system updates settlement_leg_1 status to "FIAT_RECEIVED"
**And** initiates conversion of BRL or ARS to USDT at the PRELOCK rate

**Given** the fiat to USDT conversion is successfully completed
**When** the system receives confirmation from the payment partner
**Then** the system updates settlement_leg_1 status to "USDT_CONFIRMED"
**And** updates settlement status to "FIAT_TO_USDT_COMPLETE"
**And** logs FIAT_TO_USDT_COMPLETE event with conversion rate and amounts
**And** verifies the conversion completed within T+0 (per FR61); if conversion exceeded T+0, triggers compensation clause

**Given** the fiat to USDT conversion fails
**When** the payment partner returns an error
**Then** the system updates settlement status to "FAILED"
**And** logs the failure reason
**And** notifies both buyer and seller
**And** initiates refund to buyer per corridor-specific rules

---

#### Story 3.3: Convert USDT to USD or HKD via Everypay HK (Leg 3)

As a platform,
I want to convert USDT to USD or HKD via Everypay HK entity,
So that the settlement reaches the target currency for offshore delivery.

**Acceptance Criteria:**

**Given** a settlement with status "FIAT_TO_USDT_COMPLETE"
**When** the system triggers Everypay HK FX engine conversion
**Then** the system converts USDT to USD or HKD at the locked PRELOCK rate
**And** updates settlement_leg_2 status to "USDT_TO_FIAT_IN_PROGRESS"

**Given** the USDT to USD/HKD conversion is successfully completed
**When** Everypay HK confirms the conversion
**Then** the system updates settlement_leg_2 status to "FIAT_CONVERSION_CONFIRMED"
**And** updates settlement status to "USD_HKD_READY"
**And** logs USDT_TO_FIAT_COMPLETE event with rate used and amounts

**Given** the USDT to USD/HKD conversion fails
**When** Everypay HK FX engine returns an error
**Then** the system updates settlement status to "FAILED"
**And** logs the failure reason
**And** notifies operations team for manual intervention

---

#### Story 3.4: Transfer USD/HKD to Wei's Offshore Hong Kong Account (Leg 4)

As a platform,
I want to transfer USD or HKD to Wei's offshore Hong Kong bank account,
So that the seller receives the settlement funds.

**Acceptance Criteria:**

**Given** a settlement with status "USD_HKD_READY"
**When** the system initiates the bank transfer via HK bank rails
**Then** the system submits ISO 20022 message to HK bank
**And** updates settlement_leg_3 status to "TRANSFER_IN_PROGRESS"

**Given** the HK bank confirms the transfer (T+1 per NFR31)
**When** the system receives SWIFT MT103 or ISO 20022 confirmation
**Then** the system updates settlement_leg_3 status to "TRANSFERRED"
**And** updates settlement status to "SETTLED_PENDING_CONFIRMATION"
**And** logs OFFSHORE_TRANSFER_COMPLETE event

**Given** the bank transfer fails or is rejected
**When** the HK bank returns an error
**Then** the system updates settlement status to "FAILED"
**And** logs the failure reason
**And** notifies operations team for investigation

---

#### Story 3.5: Settle and Confirm Completion with Wei's Receipt

As a platform,
I want to mark settlement as complete when Wei confirms USD/HKD receipt,
So that settlement success is measured as SETTLED + USD_HKD_CONFIRMED (FR65).

**Acceptance Criteria:**

**Given** a settlement with status "SETTLED_PENDING_CONFIRMATION"
**When** Wei clicks "Confirm Receipt" in the platform UI
**Then** the system updates settlement status to "SETTLED"
**And** logs SETTLED_AND_CONFIRMED event with Wei's confirmation timestamp
**And** marks the settlement as successfully complete

**Given** Wei confirms receipt
**When** the confirmation is recorded
**Then** the system sends notification to buyer: "Payment received by seller"
**And** the buyer can mark the invoice as PAID in their purchase ledger

**Given** Wei reports non-receipt after transfer is confirmed by bank
**When** Wei clicks "Report Non-Receipt" within 24 hours
**Then** the system flags the settlement for operations review
**And** logs DISPUTE_FLAG event
**And** the operations team can access the evidence pack via Epic 9 (Evidence & Audit) download flow

**Given** the settlement is complete (SETTLED + CONFIRMED)
**When** the settlement reaches final state
**Then** the system calculates settlement metrics: total fees paid, FX spread, processing time
**And** stores these in the settlement record for reporting

### Epic 4: Settlement Tracking
Both parties can track settlement status in real-time throughout the entire settlement chain
**FRs covered:** FR25, FR29-FR31, FR65-FR67
**Lifecycle Phase:** Settlement
**Documents:** Both parties view settlement status and attached docs
**Boundary Note:** Epic 3 handles settlement PROCESSING (backend state transitions, conversion logic). Epic 4 handles settlement TRACKING UI (displaying status, viewing chain details, confirming receipt). Stories in Epic 4 read data produced by Epic 3 but do not modify settlement state.

#### Story 4.1: View Real-Time Settlement Status

As either buyer or seller,
I want to view real-time settlement status through the entire settlement chain,
So that I know exactly where my payment is at any moment.

**Acceptance Criteria:**

**Given** a buyer or seller is on the settlement tracking page
**When** they select an active settlement
**Then** the system displays: current status, settlement chain steps, each leg's status and timestamp

**Given** the settlement is in progress (not yet SETTLED)
**When** the user views the status
**Then** the system shows progress indicator with estimated completion time per leg

**Given** any state change occurs in the settlement
**When** the system processes the state change
**Then** the status is visible to both parties within 30 seconds (per NFR2)
**And** both buyer and seller receive notification

---

#### Story 4.2: View Settlement Chain with All Conversion Legs

As a seller (Wei),
I want to view the complete settlement chain showing all 4 conversion paths,
So that I can trace my payment from BRL/ARS deposit to offshore account receipt.

**Acceptance Criteria:**

**Given** a seller views an active settlement
**When** they expand the "View Settlement Chain" section
**Then** the system displays: Leg 1 (fiat deposit), Leg 2 (USDT), Leg 3 (USD/HKD), Leg 4 (offshore transfer)

**Given** each leg is displayed
**When** the seller views the leg details
**Then** the system shows: amount at start of leg, exchange rate used, fees, amount at end of leg, timestamp

**Given** the seller is on mobile (Carlos is mobile-browsing per UX spec)
**When** they view the settlement chain
**Then** the system uses responsive layout with collapsible leg details
**And** respects prefers-reduced-motion (per UX spec)

---

#### Story 4.3: Wei Confirms USD/HKD Receipt

As a seller (Wei),
I want to confirm when I receive the USD/HKD in my offshore Hong Kong account,
So that the settlement is marked as complete (SETTLED + CONFIRMED per FR65).

**Acceptance Criteria:**

**Given** a settlement with status "SETTLED_PENDING_CONFIRMATION"
**When** Wei views the settlement and confirms USD/HKD receipt
**Then** the system updates settlement status to "SETTLED"
**And** logs SETTLED_AND_CONFIRMED event with Wei's confirmation timestamp

**Given** Wei confirms receipt
**When** the confirmation is recorded
**Then** the system sends notification to buyer: "Payment received by seller"

**Given** Wei reports non-receipt after transfer is confirmed by bank
**When** Wei clicks "Report Non-Receipt" within T+1 (per NFR31 bank settlement window)
**Then** the system flags the settlement for operations review
**And** logs DISPUTE_FLAG event
**And** the operations team can access the evidence pack via Epic 9 (Evidence & Audit) download flow

---

#### Story 4.4: View Settlement in Corridor-Appropriate Format

As a buyer or seller,
I want to see settlement amounts in corridor-appropriate format,
So that the display matches my local currency and regional conventions.

**Acceptance Criteria:**

**Given** a buyer views their settlement in BRL corridor
**When** the system displays amounts
**Then** it shows: BRL amount with Brazilian number format (R$ 1.234,56), BCB compliance notation

**Given** a buyer views their settlement in ARS corridor
**When** the system displays amounts
**Then** it shows: ARS amount with Argentine format ($ 1.234,56), BCRA compliance notation

**Given** a seller views settlement in USD corridor
**When** the system displays amounts
**Then** it shows: USD amount with US format ($1,234.56), HK bank notation
**And** uses JetBrains Mono font for amounts per UX spec

**Given** a seller views settlement in HKD corridor
**When** the system displays amounts
**Then** it shows: HKD amount with HK format (HK$ 1,234.56), offshore account notation

---

#### Story 4.5: View Attached Documents in Settlement

As either buyer or seller,
I want to view all documents attached to a settlement,
So that I can verify the contractual and logistical documentation.

**Acceptance Criteria:**

**Given** a user views settlement detail
**When** they click "View Documents"
**Then** the system displays: invoice, contract, and any additional documents attached by either party

**Given** the user is an Approver (CFO) reviewing a settlement
**When** they view the documents
**Then** the system displays all documents in read-only format
**And** provides download option for offline review

---

### Epic 5: Rate Management (PRELOCK)
Either party can propose PRELOCK rate; rate is negotiable and locked upon acceptance
**FRs covered:** FR32, FR34-FR35, FR-N2
**Lifecycle Phase:** Pre-Settlement / Settlement

#### Story 5.1: Propose PRELOCK Rate

As a seller or buyer,
I want to propose a PRELOCK exchange rate for a payment agreement,
So that we can agree on the rate before payment initiation.

**Acceptance Criteria:**

**Given** a user is creating or editing a payment agreement
**When** they select PRELOCK rate method
**Then** the system displays current market rate as reference
**And** allows input of proposed rate

**Given** a user submits a proposed PRELOCK rate
**When** the rate is within acceptable deviation (5% per Story 2.2)
**Then** the rate is stored as "PROPOSED" in rate_lock record
**And** the other party receives notification

---

#### Story 5.2: Lock PRELOCK Rate Upon Payment Confirmation

As a platform,
I want to lock the PRELOCK rate when buyer confirms payment,
So that the rate is guaranteed for this settlement.

**Acceptance Criteria:**

**Given** a payment agreement has ACCEPTED PRELOCK rate
**When** the buyer clicks "Confirm Payment"
**Then** the system locks the rate: status changes from "PROPOSED" to "LOCKED"
**And** logs RATE_LOCKED event with timestamp and rate value
**And** this rate is used for all conversion legs

**Given** the rate is locked
**When** any party views the settlement
**Then** the locked rate is displayed with "LOCKED" badge
**And** the rate cannot be changed for this settlement

---

#### Story 5.3: Display Rate and Fees Upfront Before Confirmation

As a buyer,
I want to see the exchange rate and all fees before I confirm payment,
So that I understand the total cost and can make an informed decision.

**Acceptance Criteria:**

**Given** a buyer is on the payment confirmation screen
**When** the system displays the rate and fee breakdown
**Then** it shows: PRELOCK rate, USDT amount, fees (FX fee, platform fee, corridor fee), total in local currency
**And** uses JetBrains Mono for all amounts per UX spec

**Given** the buyer sees the complete fee breakdown
**When** they proceed with confirmation
**Then** the rate becomes locked per Story 5.2

**Given** the buyer declines after seeing fees
**When** they click "Cancel"
**Then** no payment is initiated
**And** the PRELOCK rate remains unlocked

---

#### Story 5.4: Rate Lock Expiration Handling

As a platform,
I want to handle PRELOCK rate expiration,
So that expired rates trigger re-quote flow.

**Acceptance Criteria:**

**Given** a PRELOCK rate is locked
**When** 44 hours pass without settlement completion (per UX spec 7)
**Then** the system displays amber warning: "Rate expiring in 4 hours" to both parties

**Given** the 48-hour window expires
**When** the rate is still not settled
**Then** the system marks the rate as "EXPIRED"
**And** the settlement cannot proceed with the expired rate
**And** both parties are notified to initiate new rate quote

**Given** the rate expires and settlement is not complete
**When** the seller initiates a new rate proposal
**Then** a new rate_lock record is created
**And** the original expired rate is archived for audit

---

### Epic 6: Corridor Operations
Platform supports Brazil BRL and Argentina ARS corridors with corridor-specific compliance rules
**FRs covered:** FR21-FR24
**Lifecycle Phase:** Settlement

#### Story 6.1: Configure Corridor-Specific Compliance Rules

As a platform administrator,
I want the system to enforce corridor-specific compliance rules for BRL and ARS,
So that each settlement meets the regulatory requirements of its corridor.

**Acceptance Criteria:**

**Given** a settlement is initiated for the Brazil BRL corridor
**When** the system processes the settlement
**Then** it applies BCB regulatory compliance rules (per FR21)
**And** uses Brazilian payment partner API for BRL collection (per NFR29)

**Given** a settlement is initiated for the Argentina ARS corridor
**When** the system processes the settlement
**Then** it applies BCRA regulatory compliance rules (per FR22)
**And** handles USDT usage restrictions and blue dollar premium documentation

**Given** a corridor-specific compliance check fails
**When** the system detects a violation
**Then** the settlement status updates to "FAILED"
**And** logs the compliance failure reason
**And** notifies the operations team

---

#### Story 6.2: Display Settlement Status in Corridor-Appropriate Format

As a user in a specific corridor,
I want to see settlement amounts and status formatted according to my local conventions,
So that I can easily understand the settlement details without currency conversion confusion.

**Acceptance Criteria:**

**Given** a Brazilian buyer views their settlement
**When** the system displays amounts
**Then** it uses: Brazilian number format (R$ 1.234,56), BRL currency symbol, and BCB compliance notation

**Given** an Argentine buyer views their settlement
**When** the system displays amounts
**Then** it uses: Argentine number format ($ 1.234,56), ARS currency symbol, and BCRA compliance notation

**Given** a seller views a USD settlement
**When** the system displays amounts
**Then** it uses: US format ($1,234.56), HK bank notation

**Given** a seller views an HKD settlement
**When** the system displays amounts
**Then** it uses: HK format (HK$ 1,234.56), offshore account notation

---

### Epic 10: AML & Compliance
Platform screens users against sanctions lists, maintains KYC/KYB records, implements compliance requirements
**FRs covered:** FR52-FR55
**Lifecycle Phase:** All phases

#### Story 10.1: Sanctions Screening During User Onboarding

As a platform,
I want to screen all users against OFAC, UN, EU, and local sanctions lists during onboarding,
So that we comply with AML/CTF regulations and prevent sanctioned entities from using the platform.

**Acceptance Criteria:**

**Given** a user completes KYC individual verification
**When** their identity documents are submitted
**Then** the system automatically screens them against: OFAC SDN list, UN sanctions list, EU sanctions list, and local jurisdiction lists (per FR52)

**Given** the sanctions screening returns a match
**When** the match is detected during automated screening
**Then** the user's KYC status is set to "FLAGGED_FOR_REVIEW"
**And** a compliance queue entry is created
**And** the user cannot proceed with platform activities until reviewed

**Given** the sanctions screening returns no match
**When** the screening completes successfully
**Then** the user passes the sanctions check
**And** the KYC process continues to the next step

**Given** a user is periodically re-screened (ongoing monitoring per FR55)
**When** a previously-clear user appears on a new sanctions list
**Then** the system flags the user for compliance review
**And** logs the screening event with timestamp and list version

---

#### Story 10.2: Maintain KYC/KYB Records per Regulatory Requirements

As a platform,
I want to maintain KYC/KYB records for all users in accordance with regulatory retention requirements,
So that we can produce audit-ready records when requested by authorities.

**Acceptance Criteria:**

**Given** a user completes KYC verification
**When** their documents are stored
**Then** the system maintains: government ID copy, liveness check result, address verification, sanctions screening results, and KYC tier level

**Given** a business entity completes KYB verification
**When** their documents are stored
**Then** the system maintains: business registration certificate, beneficial ownership declarations (>10% shareholders), authorized signatories list, business activity declaration, and AML/CTF risk classification

**Given** a regulator requests KYC/KYB records for a user
**When** the request is authenticated and authorized (Compliance role only per RBAC)
**Then** the system retrieves the complete KYC/KYB record
**And** logs the access event with timestamp and requesting authority
**And** returns the record within 48 hours

---

### Epic 11: Counterparty CRM
Both parties can view counterparty profiles, settlement history, trust scores, and manage relationships
**FRs covered:** FR69-FR72
**Lifecycle Phase:** All phases

#### Story 11.1: View Counterparty Profile with Settlement History

As a seller or buyer,
I want to view my counterparty's profile with their settlement history and trust indicators,
So that I can assess the reliability of my trading partner.

**Acceptance Criteria:**

**Given** a seller views their counterparty list
**When** they select a specific buyer
**Then** the system displays: buyer company name, total settlements completed, total volume traded, settlement success rate, average delivery time, and dispute rate (per FR69, FR71)

**Given** a buyer views their counterparty list
**When** they select a specific seller
**Then** the system displays: seller company name, total invoices received, total volume paid, average invoice-to-settlement time, and delivery performance (per FR70)

**Given** either party views a counterparty's interaction history
**When** they click "View History"
**Then** the system displays a chronological list of all settlements, invoices, and communications with that counterparty (per FR72)

**Given** a counterparty has a low settlement success rate (<95%)
**When** the profile is displayed
**Then** the system highlights the risk indicator in amber
**And** shows the specific issue (e.g., "3 failed settlements in last 30 days")

---

#### Story 11.2: Calculate and Display Trust Indicators

As a platform,
I want to calculate and display trust indicators per counterpair,
So that both parties can make informed decisions about their trading relationships.

**Acceptance Criteria:**

**Given** a counterparty has completed at least 1 settlement
**When** the trust indicators are calculated
**Then** the system computes: settlement success rate (%), average delivery time (days), total volume traded (USD equivalent), and dispute rate (%)

**Given** the trust indicators are displayed
**When** the data updates (new settlement completes)
**Then** the indicators are recalculated and updated within 30 seconds (per NFR2)

**Given** a counterparty has no settlement history
**When** their profile is viewed
**Then** the system displays "New on platform" badge
**And** trust indicators show "No data yet" placeholder

---

### Epic 12: Purchase Ledger (Buyer)
Buyer views pending invoices, tracks outgoing payments across corridors, sees running balances, receives payment reminders
**FRs covered:** FR73-FR76
**Lifecycle Phase:** Post-Settlement

#### Story 12.1: View Pending Invoices and Payment Status

As a buyer,
I want to view all pending invoices with their due dates and payment status,
So that I can manage my payment obligations and avoid late payments.

**Acceptance Criteria:**

**Given** a buyer is on their Purchase Ledger dashboard
**When** they view the invoice list
**Then** the system displays: invoice number, seller name, total amount, currency, due date, and payment status (PENDING, PAID, OVERDUE) (per FR73)

**Given** a buyer filters by payment status
**When** they select "PENDING"
**Then** the system shows only unpaid invoices sorted by due date

**Given** a buyer views a specific invoice
**When** they click the invoice
**Then** the system displays: line items, attached contract, payment agreement status, and "Pay Now" CTA (if terms accepted)

**Given** a buyer has no pending invoices
**When** they view the ledger
**Then** the system displays: "All invoices paid" with a positive confirmation state

---

#### Story 12.2: Track Outgoing Payments and Running Balance

As a buyer,
I want to track all my outgoing payments across BRL and ARS corridors with a running balance per seller,
So that I know exactly how much I owe versus how much I have paid.

**Acceptance Criteria:**

**Given** a buyer views their payment history
**When** they view the payment list
**Then** the system displays: payment date, settlement ID, seller name, corridor (BRL/ARS), amount, and settlement status (per FR74)

**Given** a buyer views the balance summary per seller
**When** they expand a seller's detail
**Then** the system shows: total invoiced amount, total paid amount, and running balance (total owed minus total paid) (per FR75)

**Given** a payment reminder is approaching (within 3 days of due date per FR76)
**When** the buyer logs in
**Then** the system displays a reminder notification on their dashboard
**And** sends an email reminder with invoice details and payment link

---

### Epic 13: Sales Ledger (Seller)
Seller tracks outstanding invoices, incoming receivables, aging reports, and collection status
**FRs covered:** FR77-FR80, FR82-FR85
**Lifecycle Phase:** Post-Settlement

#### Story 13.1: View Outstanding Invoices and Collection Status

As a seller,
I want to view all outstanding invoices with expected payment dates and collection status,
So that I can track my receivables and follow up on overdue payments.

**Acceptance Criteria:**

**Given** a seller is on their Sales Ledger dashboard
**When** they view the invoice list
**Then** the system displays: invoice number, buyer name, total amount, currency, expected payment date, and collection status (AWAITING_PAYMENT, IN_PROGRESS, PAID, OVERDUE) (per FR77)

**Given** a seller filters by collection status
**When** they select "OVERDUE"
**Then** the system shows only overdue invoices sorted by days past due

**Given** a seller views incoming receivables across corridors
**When** they view the receivables summary
**Then** the system displays all incoming payments in USD equivalent with corridor breakdown (per FR78)

---

#### Story 13.2: Aging Report and Running Balance per Buyer

As a seller,
I want to see a running balance of billed vs received per buyer and an aging report for receivables,
So that I can identify collection risks and prioritize follow-ups.

**Acceptance Criteria:**

**Given** a seller views the balance summary per buyer
**When** they expand a buyer's detail
**Then** the system shows: total billed amount, total received amount, and running balance (per FR79)

**Given** a seller views the aging report
**When** they open the aging view
**Then** the system displays receivables grouped by: 0-30 days current, 31-60 days overdue, 60+ days overdue (per FR80)

**Given** an invoice is 60+ days overdue
**When** it appears in the aging report
**Then** the system highlights it in red
**And** suggests follow-up actions: "Send reminder" or "Contact buyer"

---

#### Story 13.3: Account Reconciliation and FX Exposure View

As a seller,
I want to view real-time holdings and aggregated FX exposure across all settlements,
So that I can understand my total currency exposure and reconcile accounts.

**Acceptance Criteria:**

**Given** a seller views their reconciliation dashboard
**When** they open the holdings view
**Then** the system displays: real-time BRL/ARS holdings in local currency (per FR82), real-time USD/HKD receipts in offshore HK account (per FR83)

**Given** a seller views their FX exposure
**When** they open the FX exposure view
**Then** the system displays: aggregated FX exposure per counterparty and per corridor (per FR84)
**And** total currency exposure across all open settlements (per FR85)

**Given** the FX exposure exceeds a configured threshold
**When** the threshold is breached
**Then** the system displays a warning indicator
**And** highlights the corridor or counterparty contributing most to exposure
MVP uses NOESCROW model as default; escrow features (EXACT, OVER, UNDER) are Phase 2
**FRs covered:** FR36 (MVP), FR37-FR41, FR-N6-FR-N11 (Phase 2)
**Lifecycle Phase:** Settlement

#### Story 7.1: Use NOESCROW Model for Trusted Relationships

As a platform,
I want to support NOESCROW settlement model for trusted seller-buyer relationships,
So that settlements can proceed without escrow when both parties agree.

**Acceptance Criteria:**

**Given** a seller and buyer have an established relationship
**When** they create a new payment agreement
**Then** the default model is NOESCROW
**And** no escrow configuration is required

**Given** a seller-buyer pair has completed 3+ successful settlements
**When** they create a new agreement
**Then** NOESCROW is the default option
**And** the settlement proceeds without escrow requirements

**Given** a NOESCROW agreement is created
**When** the buyer confirms payment
**Then** the settlement proceeds directly to fiat-to-USDT conversion
**And** no escrow hold or milestone tracking is involved

**Given** either party prefers escrow for a new transaction
**When** they configure the payment agreement
**Then** the system indicates "Escrow is Phase 2 — please use NOESCROW for MVP"
**And** MVP settlements continue with NOESCROW

**Phase 2 stories (OUT OF MVP SCOPE):**
- Story 7.2: Configure EXACT escrow amount (FR37, FR-N6)
- Story 7.3: Configure OVER escrow amount (FR38, FR-N7)
- Story 7.4: Configure UNDER escrow amount with shortfall handling (FR-N8, FR-N9)
- Story 7.5: Propose over-escrow buffer (FR39)
- Story 7.6: Accept/reject/counter-propose escrow amount (FR40)
- Story 7.7: Bilateral approval for over-escrow (FR41)
- Story 7.8: One-for-all escrow structure (FR-N10)
- Story 7.9: Phased escrow structure (FR-N11)

---

### Epic 8: Approval Workflow
Approvers can review settlements, approve or reject with comments, and configure escalation thresholds
**FRs covered:** FR8-FR9, FR42-FR46
**Lifecycle Phase:** Pre-Settlement / Settlement
**Documents:** Approvers review uploaded settlement docs

#### Story 8.1: Configure Approval Chain for High-Value Settlements

As a seller,
I want to configure an approval chain for high-value settlements,
So that large payments require appropriate internal review.

**Acceptance Criteria:**

**Given** a seller is in settlement configuration
**When** they set a high-value threshold (e.g., $100,000)
**Then** the system prompts: "Approval chain required for settlements above [threshold]"

**Given** a seller configures an approval chain
**When** they define: Approver 1 (CFO), Approver 2 (Treasurer), Approver 3 (Risk Manager)
**Then** the system validates each approver has the required RBAC role
**And** stores the approval chain as a configuration

**Given** the approval chain is configured
**When** a settlement exceeds the threshold
**Then** the system routes it to the first approver in the chain
**And** notifies the approver of pending approval

---

#### Story 8.2: Configure Auto-Acceptance Thresholds

As a seller,
I want to set auto-acceptance thresholds for rate moves and payment amounts,
So that small fluctuations are automatically accepted without manual approval.

**Acceptance Criteria:**

**Given** a seller configures auto-acceptance thresholds
**When** they set: rate move percentage (e.g., 0.5%), payment amount threshold (e.g., $10,000)
**Then** the system stores these in `auto_acceptance_thresholds` table with corridor-specific values

**Given** a settlement triggers auto-acceptance criteria
**When** the rate move or amount is within configured threshold
**Then** the system auto-approves without manual intervention
**And** logs AUTO_APPROVED event

**Given** a settlement exceeds auto-acceptance thresholds
**When** the approval chain is required
**Then** the system routes to human approvers per Story 8.1

---

#### Story 8.3: Approver Reviews Settlement

As an approver (CFO, Treasurer, or Risk Manager),
I want to review pending settlements in my approval queue,
So that I can make informed approval decisions.

**Acceptance Criteria:**

**Given** an approver is in their approval queue
**When** they view pending settlements
**Then** the system displays: settlement ID, amount, counterparty, rate, fees, risk indicators with color coding

**Given** the approver reviews a settlement
**When** they view the details
**Then** the system shows: full agreement terms, rate lock details, corridor information, attached documents

**Given** the settlement is from a new or flagged counterparty
**When** the approver views the settlement
**Then** the system highlights risk indicators and counterparty history for review

---

#### Story 8.4: Approver Approves or Rejects Settlement

As an approver,
I want to approve or reject settlements with comments,
So that my decision is recorded with rationale.

**Acceptance Criteria:**

**Given** an approver reviews a settlement
**When** they click "Approve" and add optional comments
**Then** the system logs: APPROVED, approver ID, timestamp, comments
**And** routes to next approver in chain (if any)
**And** notifies both parties of approval progress

**Given** the final approver approves
**When** the approval is recorded
**Then** the settlement status updates to "APPROVED"
**And** the settlement proceeds to next phase

**Given** an approver rejects a settlement
**When** they click "Reject" and provide a mandatory rejection reason
**Then** the system logs: REJECTED, approver ID, timestamp, rejection reason
**And** notifies both parties of rejection
**And** the settlement cannot proceed

**Given** a settlement is rejected
**When** the seller initiates a new agreement
**Then** a new payment agreement must be created from scratch
**And** the rejected settlement record is retained for audit

---

#### ~~Story 8.5: Auto-Escalate Based on Thresholds~~ — DEFERRED TO PHASE 2

> **Note:** FR42 (auto-escalate thresholds) and FR43 (auto-escalate for review) are Phase 2 per PRD. This story placeholder is kept for Phase 2 planning reference.

---

### Epic 9: Evidence & Audit
Platform generates timestamped evidence packs per tranche; sellers can download evidence; regulatory retrieval within 48 hours
**FRs covered:** FR47-FR51, FR62
**Lifecycle Phase:** Post-Settlement
**Documents:** Evidence pack compilation from all settlement docs

#### Story 9.1: Generate Timestamped Evidence Pack per Settlement

As a platform,
I want to generate a timestamped, tamper-evident evidence pack for each settlement,
So that regulators can verify settlement integrity.

**Acceptance Criteria:**

**Given** a settlement reaches SETTLED status
**When** the system finalizes the settlement
**Then** it generates an evidence pack containing: order, contract, invoice, logistics documents, customs clearance documents, and other supporting files as negotiated between parties
**And** each document is timestamped with the time it was uploaded or action taken
**And** the evidence pack has a SHA-256 hash calculated as: hash = SHA256(settlement_id + document_hashes_array + timestamp) for tamper detection

**Given** the evidence pack is generated
**When** it is stored
**Then** the `evidence_packs` table records: settlement_id, created_at, retention_until (7 years from created_at per FR50), hash

---

#### Story 9.2: Seller Downloads Evidence Pack

As a seller,
I want to download the complete evidence pack for any settlement,
So that I can have proof of the transaction for my records.

**Acceptance Criteria:**

**Given** a seller views a completed settlement
**When** they click "Download Evidence Pack"
**Then** the system packages all documents into a downloadable PDF format with cover page
**And** includes settlement summary: Settlement ID, Date, Parties, Total Amount, Hash for verification
**And** each document is page-numbered

**Given** the seller downloads the evidence pack
**When** the download is initiated
**Then** the system logs: EVIDENCE_DOWNLOADED, seller_id, settlement_id, timestamp

**Given** a regulator requests evidence for a settlement
**When** the request is authenticated and valid
**Then** the evidence is retrievable within 48 hours of request (per NFR3)

---

#### Story 9.3: Evidence Pack Retention for 7 Years

As a platform,
I want to retain all evidence packs for minimum 7 years,
So that we meet compliance retention requirements.

**Acceptance Criteria:**

**Given** an evidence pack is created for a settlement
**When** it is stored
**Then** the retention_until date is set to created_at + 7 years
**And** the evidence is kept in hot storage for 1 year
**And** then moved to cold storage (S3 Glacier or equivalent) for remaining 6 years

**Given** an evidence pack is approaching retention expiry
**When** 30 days before retention_until
**Then** the system notifies operations team for review

**Given** an evidence pack reaches retention expiry
**When** the retention period ends
**Then** the system archives the evidence pack per data retention policy
**And** logs ARCHIVE event for audit

---

#### Story 9.4: Immutable Audit Log per Settlement

As a platform,
I want to maintain an immutable audit log for all settlement events,
So that every action is traceable and tamper-evident.

**Acceptance Criteria:**

**Given** any settlement event occurs (initiation, approval, state change, etc.)
**When** the event happens
**Then** the system appends to audit_log: event_type, settlement_id, actor, timestamp, hash_reference

**Given** an audit_log entry is created
**When** it is stored
**Then** it cannot be modified or deleted
**And** each entry references the hash of the previous entry (hash chain integrity)

**Given** an auditor requests audit log for a settlement
**When** they authenticate as Compliance role
**Then** the system provides the complete audit trail
**And** each entry is verifiable against its hash chain

---

### Epic 10: AML & Compliance
Platform screens users against sanctions lists, maintains KYC/KYB records, implements compliance requirements
**FRs covered:** FR52-FR55
**Lifecycle Phase:** All phases

### Epic 11: Counterparty CRM
Both parties can view counterparty profiles, settlement history, trust scores, and manage relationships
**FRs covered:** FR69-FR72
**Lifecycle Phase:** All phases

### Epic 12: Purchase Ledger (Buyer)
Buyer views pending items, tracks outgoing payments across corridors, sees running balances, receives payment reminders
**FRs covered:** FR73-FR76
**Lifecycle Phase:** Post-Settlement

### Epic 13: Sales Ledger (Seller)
Seller tracks outstanding invoices, incoming receivables, aging reports, and collection status
**FRs covered:** FR77-FR80
**Lifecycle Phase:** Post-Settlement

