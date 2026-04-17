# Journey 1 Walkthrough: Carlos Procurement-to-Payment Flow (Buyer)

**Role:** Buyer (Carlos — foreign importer)
**Demo User:** `user-1`
**Trigger:** Logs in → lands on Dashboard → creates or reviews procurement
**Outcome:** Payment terms negotiated & approved bilaterally → pre-payment made → cargo tracked → goods received → settlement confirmed

---

## Step 1: Dashboard Overview

**Route:** `/` (login → auto-redirects to `/`)

**What to look for:**
- Switch to **user-1** using the Demo User Switcher in the top-right corner
- As Carlos (buyer), the dashboard shows:
  - **Assets** — Current balance across currencies (BRL/ARS holdings, USD/HKD offshore, USDT)
  - **Procurement Awaiting Payment** — Active procurement orders needing attention (this is populated for Carlos)
  - **Active Settlements** — In-progress settlements with status indicators
  - **Recent Activity** — Chronological feed of recent events
  - **Stats** — Trust score, counterparty count, settlement success rate

**Navigation:** Sidebar → **Dashboard**

---

## Step 2: Create Procurement

**Route:** `/procurement/create`

**What to look for:**
- Navigate to **Procurement** in the sidebar → "New Procurement" button
- As a buyer, Carlos creates a procurement order with:
  - **Counterparty (seller) selection** — Choose Wei's company from a dropdown
  - **Payment corridor** — BRL → USD/HKD (Brazil) or ARS → USD/HKD (Argentina)
  - **Due date** — When payment is expected
  - **Line items** — Each item has:
    - Description (e.g., "Coffee Beans - Arabica Grade A")
    - Quantity and unit price
    - Currency (USD or HKD)
    - HS Code (customs classification, e.g., "0901.21")
    - Product specs (optional, e.g., "Organic, washed process")
  - **Notes** — Additional terms, delivery instructions, etc.
  - **Save as Draft** or **Send to Seller** action

**Navigation:** Sidebar → **Procurement** → "New Procurement" button

**Key point:** Buyers create procurements (purchase orders with items, amounts, due dates). Invoices are NOT created here — they come from the seller as part of document exchange.

---

## Step 3: Review Procurement & Document Exchange

**Route:** `/procurement/[id]` (select an existing procurement)

**What to look for:**
- **Status & progress bar** — Shows current stage of the procurement journey
- **Parties & Terms** — Seller, buyer, corridor, due date
- **Line Items** — Full list with HS codes and product specs
- **Document Exchange** (embedded below):
  - All documents shared between parties for this procurement
  - Filter by document type: Contract, Invoice, PO, Packing List, Logistics, Customs, Bank Transfer, Insurance, Inspection, Supporting
  - Both parties can upload documents of any type
  - **Invoices are just one document type** — uploaded by the seller in response to the procurement
  - Other documents: PO (uploaded by buyer), contracts, logistics docs, customs clearance, bank proofs, etc.
- **Action buttons** (context-dependent):
  - Draft: "Send to Seller"
  - Terms proposed: "Accept Terms", "Counter-Propose"
  - In transit: "Confirm Receipt", "Report Non-Receipt"

**Navigation:** Sidebar → **Procurement** → click any procurement row

**Key point:** The document exchange is embedded in the procurement detail. Invoices are not a separate page — they are documents attached to the procurement by the seller.

---

## Step 4: Seller Proposes Payment Terms (Round 1)

**Route:** `/payment-agreements/[id]/review`

**What to look for:**
- Wei (seller) proposes PRELOCK rate with:
  - **Rate lock quote** — FX rate being offered
  - **Fee breakdown** — FX fee, platform fee, corridor fee
  - **Proposed payment schedule/milestones** — When payments are due
  - **Supporting documents** — Attached docs from the procurement document exchange (including seller's invoice)

**Navigation:** From procurement detail → "Review Terms" link (appears when seller has proposed terms)

**Current state:** Rate deviation validation and fee preview are missing.

---

## Step 4a: Seller Internal Approval (Cross-cutting)

**Route:** `/approvals` (switch to **user-3** — Approver role)

**What to look for:**
- Wei's internal team (CFO/Treasurer) must approve proposed terms before Carlos sees them
- **Approval queue** — Card-based list of pending approvals
- **Risk summary** — Counterparty profile, corridor exposure, sanctions screening
- **Document preview** — Full document set: contract, PO, invoice, proposed terms, rate lock details
- **Approve/Reject actions** — 1-click approve, mandatory rejection reason

**Navigation:** Switch to **user-3** → Sidebar → **Settlements → Approvals**

**Current state:** Card-based queue exists. Risk summary cards incomplete.

---

## Step 5: Carlos Reviews & Counters (Round 1)

**Route:** `/payment-agreements/[id]/review` (switch back to **user-1**)

**What to look for:**
- Carlos reviews Wei's proposed terms
- **Counter-proposal form** — Carlos can revise rate/terms
- **Updated fee breakdown** — Shows how counter-proposal changes fees
- **All attached documents** — Full document set from both parties

**Navigation:** Switch back to **user-1** → Sidebar → **Settlements → Payment Agreements**

**Current state:** Counter-propose action exists; decline flow missing. Fee breakdown incomplete.

---

## Step 5a: Buyer Internal Approval — Counter (Cross-cutting)

**Route:** `/approvals` (switch to **user-3**)

**What to look for:**
- Carlos's finance team must approve his counter-proposal before Wei sees it
- Same approval interface as Step 4a, but with buyer-side data context

**Navigation:** Switch to **user-3** → Sidebar → **Settlements → Approvals**

---

## Step 6: Negotiation Cycle (Round 2...N)

**Route:** `/payment-agreements/[id]/review`

**What to look for:**
- **Negotiation history** — Version history of all proposal rounds
- **Diff view** — Side-by-side comparison showing what changed (rate, fees, milestones)
- **Updated proposal versions** — Each round: one party counters → their team approves → other party reviews → counters back

**Navigation:** Same payment agreement review page

**Current state:** **Missing negotiation history/audit trail.** No tracking of prior proposal versions.

---

## Step 7: Terms Accepted

**Route:** `/payment-agreements/[id]/review`

**What to look for:**
- **Accept CTA** — Final acceptance of terms
- **Final terms summary** — All agreed-upon terms
- **Both parties' last-approved version** — Snapshot of final agreement

**Navigation:** Same payment agreement review page

---

## Step 8: Confirm Payment & Rate Lock

**Route:** `/settlements/[id]` — **Status** tab

**What to look for:**
- **RateLockCard** — The defining UX moment with celebratory micro-animation
- **Rate lock confirmation** — Confirmed FX rate, lock expiration time
- **Payment confirmation receipt** — Proof of payment
- **NOESCROW badge/terms** — If applicable

**Navigation:** After accepting terms → Settlements → Select the settlement → **Status** tab

**Current state:** **Missing.** Rate lock confirmation page needed.

---

## Step 9: Cargo In Transit — Track Settlement

**Route:** `/settlements/[id]` — **Chain** tab

**What to look for:**
- **4-leg conversion chain** — Full settlement pipeline visualization:
  1. **INITIATED** — Settlement created
  2. **FIAT_RECEIVED** — Buyer's local currency received
  3. **USDT_CONVERTED** — Converted to stablecoin (Carlos should NOT see "USDT" — crypto abstraction)
  4. **TRANSFERRING** — Final leg to seller's account
- **Logistics status overlay** — Cargo milestone tracking: shipped, customs clearance, arrived

**Navigation:** Settlements → Select settlement → **Chain** tab

**Current state:** 4-leg chain not fully displayed. Crypto abstraction incomplete.

---

## Step 10: Goods Received — Confirm Arrival

**Route:** `/settlements/[id]` — **Status** tab

**What to look for:**
- **"Confirm Receipt" CTA** — Buyer marks cargo received, triggers settlement finalization
- **"Report Non-Receipt" flow** — If goods are missing/damaged

**Navigation:** Settlements → Select settlement → **Status** tab

---

## Step 11: Settlement Finalized

**Route:** `/settlements/[id]` — **Evidence** tab

**What to look for:**
- **Final settlement confirmation** — USD/HKD receipt proof
- **Evidence Pack Download** — Complete compilation of all documents from the entire journey

**Navigation:** Settlements → Select settlement → **Evidence** tab

**Current state:** Evidence Pack Download component is missing.

---

## Navigation Summary (Quick Reference)

| Step | Demo User | Route | Sidebar Item |
|------|-----------|-------|-------------|
| 1. Dashboard | user-1 | `/` | Dashboard |
| 2. Create Procurement | user-1 | `/procurement/create` | Procurement → New Procurement |
| 3. Review Procurement & Docs | user-1 | `/procurement/[id]` | Procurement |
| 4. Seller Proposes Terms | user-2 | `/payment-agreements/[id]/review` | Settlements → Payment Agreements |
| 4a. Seller Approval | user-3 | `/approvals` | Settlements → Approvals |
| 5. Carlos Counters | user-1 | `/payment-agreements/[id]/review` | Settlements → Payment Agreements |
| 5a. Buyer Approval | user-3 | `/approvals` | Settlements → Approvals |
| 6. Negotiation Cycle | user-1/user-2 | `/payment-agreements/[id]/review` | Settlements → Payment Agreements |
| 7. Terms Accepted | user-1 | `/payment-agreements/[id]/review` | Settlements → Payment Agreements |
| 8. Rate Lock | user-1 | `/settlements/[id]` | Settlements |
| 9. Track Settlement | user-1 | `/settlements/[id]` | Settlements |
| 10. Confirm Receipt | user-1 | `/settlements/[id]` | Settlements |
| 11. Settlement Finalized | user-1 | `/settlements/[id]` | Settlements |

---

## Key Architecture Change

**Before:** Buyers and sellers both had an "Invoices" sidebar section. Buyers could create invoices (which is incorrect — sellers create invoices).

**After:** 
- **Buyers** create **Procurements** (purchase orders with items, amounts, due dates, HS codes, specs) at `/procurement`
- **Sellers** respond by attaching documents (including invoices) to the procurement via the **Document Exchange** embedded in `/procurement/[id]`
- **Invoices are just one document type** among many (contracts, POs, logistics docs, customs docs, bank proofs, etc.)
- No standalone "Invoices" sidebar section — invoices live within the procurement context

---

**Dev Server:** http://localhost:3001
**Architecture Reference:** `_bmad-output/planning-artifacts/page-architecture-reference.md`
