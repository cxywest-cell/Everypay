---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
inputDocuments: ["_bmad-output/planning-artifacts/prd.md", "_bmad-output/planning-artifacts/product-brief-Everypay-2026-04-01.md", "_bmad-output/planning-artifacts/validation-report-prd.md"]
lastStep: 14
workflowComplete: true
---

# UX Design Specification Everypay

**Author:** Daniel
**Date:** 2026-04-02

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

### Project Vision

Everypay is a B2B cross-border settlement platform enabling Chinese exporters to receive CNY from international buyers via stablecoin rails. The platform abstracts crypto complexity while providing full settlement transparency and compliance-ready evidence packs.

### Target Users

| User | Role | Key UX Needs |
|------|------|---------------|
| **Carlos** | Brazilian importer | Simple BRL payment initiation, no crypto visible, real-time tracking |
| **Wei** | Chinese exporter | Invoice management, evidence pack download, CNY receipt confirmation |
| **CFO/Treasurer** | High-value approver | Approval queue, FX risk review, liquidity timing decisions |
| **Ops Team** | Internal monitoring | Settlement pipeline dashboard, dispute handling, oracle failure resolution |

### Key Design Challenges

1. **Crypto abstraction** — Buyers like Carlos should never see "USDT" or "Cregis" — just "Payment sent, supplier received"
2. **Real-time settlement visibility** — Both parties need transparent chain status without exposing infrastructure
3. **Dual buyer segments** — Informal traders (speed-first) vs structured importers (compliance-first) may need different UX
4. **Corridor complexity** — Brazil (BCB) and Argentina (BCRA) have different compliance requirements that must be invisible to users

### Design Opportunities

1. **Anxiety → Relief moment** — Carlos sees "You've locked in X CNY. Your BRL is protected." right after payment
2. **Evidence pack as product** — Wei downloads a single package for tax/subsidy — this should feel effortless
3. **Approval workflow elegance** — CFO sees risk summary at a glance, approves in 2 clicks

## Core User Experience

### Defining Experience

**Core Action:** Carlos initiates BRL payment (primary buyer flow); Wei creates invoice (primary seller flow)

**Critical Interaction:** Carlos completes BRL payment → instant "Rate locked" confirmation

**Effortless Flow:** "Select amount → See rate → Confirm → Done" — no crypto terminology visible

### Platform Strategy

- Web-only for MVP (no mobile app)
- Buyer (Carlos): Mobile-browser accessible, responsive
- Seller (Wei): Desktop-first, full console
- CFO: Desktop-first dashboard

### Effortless Interactions

| User | Interaction | Should Feel |
|------|-------------|-------------|
| Carlos | Lock rate + pay BRL | "I'm done. Supplier will get paid." |
| Wei | Download evidence pack | "One file. Everything I need." |
| CFO | Approve settlement | "Approve. Next." |

### Critical Success Moments

1. **Carlos pays → "Rate locked"** — Emotional moment with micro-interaction; anxiety→relief arc
2. **Wei sees "CNY received"** — Arrival moment, not just status update
3. **CFO approves in 2 clicks** — Pre-computed risk summary enables effortless approval

### Experience Principles

1. **Abstract the complexity** — Crypto, escrow, compliance are infrastructure, not UI
2. **Status at a glance** — Primary status bold/large; supporting context smaller, on-tap
3. **One-click actions** — Primary actions complete in one click; confirmations are obvious
4. **Confidence over speed** — Feeling certain beats being fast
5. **Transparent when it matters** — Simple by default, complexity on demand (progressive disclosure pattern)

### Progressive Disclosure Pattern

- Default view: "Funds secured" or "Supplier will receive CNY"
- Tap/reveal: "USDT held in Cregis escrow, Dubai — milestone pending"
- Serves both happy path (clean UI) and edge cases (disputes, trust verification)

### Failure Mode Principles

- Define anxiety→panic arc alongside success moments
- When rate lock fails or delays: clear error state with estimated resolution
- Dispute visibility: both parties can see escrow state when needed

### Corridor-Specific Considerations

- Brazil (BRL): BCB compliance invisible; rate volatility is primary anxiety driver
- Argentina (ARS): BCRA FX controls create additional anxiety patterns; USDT restrictions may require corridor-specific messaging

## Desired Emotional Response

### Primary Emotional Goals

| User | Emotion | From |
|------|---------|-------|
| **Carlos** | Relief | BRL volatility anxiety → payment confirmed, rate locked |
| **Wei** | Trust | "I know exactly where my money is" |
| **CFO** | Confidence | "I can approve this in 2 clicks because I see everything" |

### Emotional Journey Mapping

| Stage | Carlos Feels | Wei Feels | CFO Feels |
|-------|-------------|-----------|-----------|
| First contact | Relief (easy onboarding) | Skepticism → Trust | Confidence (clear policies) |
| Core action | Anxiety → Relief | Uncertainty → Confidence | Uncertainty → Control |
| Post-action | Accomplishment | Trust confirmed | Decision made |
| Return use | "It just works" | "This is my tool" | "Efficient approval" |

### Micro-Emotions

| User | Positive | Negative (Avoid) |
|------|----------|------------------|
| Carlos | Relief, Relief, Accomplishment | Confusion, Anxiety |
| Wei | Trust, Confidence, Calm | Skepticism, Anxiety, Uncertainty |
| CFO | Control, Confidence | Uncertainty, Rushed |

### Emotions to Avoid

| User | Negative Emotion | Cause |
|------|-----------------|-------|
| Carlos | Confusion | Crypto terms, complex status |
| Wei | Anxiety | "Where is my CNY?" |
| CFO | Uncertainty | Incomplete risk information |

### Emotional Design Principles

1. **Anxiety → Relief is the core arc** — Every payment flow should resolve tension, not add to it
2. **Clarity creates confidence** — When users understand what's happening, they trust it
3. **Momentum matters** — Settlement progress should feel like forward motion, not waiting
4. **Completion should feel like an arrival** — CNY received is an event, not a notification

### Design Implications

| Emotion | UX Approach |
|---------|-------------|
| Relief | Clear "Rate locked" confirmation with visual weight — celebratory micro-interaction |
| Trust | Consistent status updates; evidence pack feels complete and professional |
| Confidence | Risk summary card before CFO approval — scannable, actionable |
| Accomplishment | "Payment complete" feels like an arrival, not just a status change |

## UX Pattern Analysis & Inspiration

### Inspiring Products

| Product | Why Inspiring | Lessons for Everypay |
|---------|--------------|---------------------|
| **Wise (TransferWise)** | Complex FX made simple; clear status tracking | Hide currency complexity behind simple flow |
| **Stripe Dashboard** | Developer clarity meets user simplicity; real-time data | "Where is my payment?" answered instantly |
| **Airbnb** | Trust through transparency; review/reputation system | Counterparty trust indicators |
| **Uber/DoorDash** | Real-time tracking with ETA; "arrival" moment | Settlement "CNY received" feels like delivery |
| **PayPal** | "Pay without complexity" early pioneer | Abstraction patterns |

### Transferable UX Patterns

| Pattern | Source | Apply to Everypay |
|---------|--------|------------------|
| **Progressive disclosure** | Stripe | Default: simple status. Tap: full technical detail |
| **Trust badges** | Airbnb | "Cregis Secured" vs "Bank-grade security" |
| **Real-time ETA** | Uber | Settlement ETA: "CNY arrives ~2hrs after customs" |
| **One-tap approval** | Apple Pay | CFO approval with Face ID confirmation |
| **Evidence download** | QuickBooks | "Download all documents" — one click, complete |

### Anti-Patterns to Avoid

| Anti-Pattern | Example | Why Avoid |
|--------------|---------|----------|
| **Exposed crypto terms** | Most crypto exchanges | "USDT" confuses Carlos |
| **Generic error messages** | Banks | "Transfer failed" without resolution |
| **Multi-step confirmation** | Legacy banks | Over-engineered for B2B speed |
| **Dense information overload** | Bloomberg terminals | CFO needs scannable, not everything |

### Design Inspiration Strategy

**Adopt:**
- Uber's arrival moment → Wei sees "CNY received" as a celebration
- Stripe's status clarity → Real-time settlement tracker
- Wise's FX transparency → Rate lock confirmation feels secure

**Adapt:**
- Airbnb's trust indicators → Counterparty history badges for Carlos
- Apple's one-tap → CFO approval with biometric confirmation

**Avoid:**
- Crypto exchange complexity (not our audience)
- Banking sector conservatism (not our speed)

## Design System Foundation

### Design System Choice

**Recommended: Tailwind UI + Headless UI**

Rationale:
- Rapid development for MVP speed
- Highly customizable for B2B fintech premium feel
- Headless UI provides accessible, unstyled components
- Tailwind's utility-first approach enables custom settlement status visualizations
- Strong ecosystem for dashboard development (CFO approval queue, settlement tracker)
- Can implement custom components for evidence pack download, rate lock confirmation

### Alternative: Ant Design Pro with heavy customization

Consider if:
- Team prefers component libraries over utility classes
- Faster out-of-box dashboard components needed
- Less time for component customization

### Implementation Approach

1. **Foundation**: Tailwind CSS for styling
2. **Components**: Headless UI for accessible primitives
3. **Custom components needed**:
   - Settlement status tracker (multi-step progress)
   - Rate lock confirmation card
   - Evidence pack download widget
   - Approval queue card (CFO dashboard)
4. **Design tokens**: Custom color palette for fintech trust + Chinese regulatory alignment

### Customization Strategy

- Primary: Trust-evoking blues and greens (not crypto purple/neon)
- Typography: Clean, professional (Inter or similar)
- Status colors: Green (secured), Yellow (pending), Red (blocked)
- Progressive disclosure: Simple by default, tap for detail

## Step 7 — Defining Core Experience

### Defining Experience Selection

**Selected Defining Experience:** Carlos's Rate Lock Moment

**Why This Is the Defining Experience:**

Carlos initiates BRL payment → Everypay locks the FX rate → immediate "Rate locked" confirmation with visual celebration. This is the emotional climax where anxiety transforms to relief. This moment:
1. Is unique to Everypay (no competitor markets rate lock emotionally)
2. Creates the trust foundation for the entire settlement
3. Directly addresses Carlos's primary anxiety: BRL volatility between payment and CNY receipt
4. Generates the compliance-grade audit trail (timestamp, rate, settlement ID)

### Success Criteria for the Defining Experience

| Criterion | Target |
|-----------|--------|
| Rate lock confirmation display | < 2 seconds after payment initiation |
| Emotional response | Anxiety → Relief arc completed visually |
| Information hierarchy | CNY amount (primary), BRL cost (secondary), rate + fees (tertiary) |
| User comprehension | Carlos knows exactly when Wei will receive CNY |
| Compliance trail | Timestamp, locked rate, settlement ID captured for audit |
| Lock window | 48 hours maximum (with re-quote flow if expired) |

### Rate Lock Moment — Information Hierarchy

**Primary (largest, boldest):**
- "X.XX CNY locked for your supplier"
- Visual: Checkmark or lock icon with celebratory micro-animation

**Secondary:**
- "You'll pay X.XX BRL"
- Rate: "1 CNY = X.XX BRL"

**Tertiary (tap to reveal):**
- Fees breakdown
- Transfer method details
- Settlement timeline

### Visual Treatment

- **Emotional climax:** Rate lock confirmation should feel like an arrival — celebratory micro-animation (checkmark, confetti, or ripple effect)
- **Card-style:** Rate lock confirmation as a distinct card with visual weight
- **Progress reset:** After confirmation, status resets to clean "Funds secured" baseline — momentum established

### Rate Lock — Technical Considerations

**State Machine:**
| Window | State | UI Indication |
|--------|-------|---------------|
| 0–44 hours | Active | "Rate locked — CNY arrives by [date]" |
| 44–48 hours | Warning | "Rate lock expiring soon — confirm to extend" |
| 48+ hours | Expired | Re-quote flow — new rate presented with explanation |

**Financial Contract Elements:**
- Timestamp (ISO 8601, UTC)
- Locked rate (to 6 decimal places)
- Settlement ID (unique identifier)
- Lock expiry timestamp
- Parties (Carlos + Wei, anonymized for buyer)

**Risk Profile Display:**
- USDT balance placement (internal ledger vs Cregis) affects risk profile shown in UI
- Progressive disclosure: "Funds secured with Cregis" (infrastructure invisible by default)

### Competitive Differentiation

- No competitor markets rate lock emotionally — opportunity to own "Rate Locked = Relief" in B2B settlement
- Frame unfavorable rates honestly with user agency ("Rate has moved — here are your options")

### Step 7 Validation: Party Mode Synthesis

**Sally (UX):**
- Rate lock is emotional climax needing visual celebration
- Information hierarchy (CNY amount, BRL cost, rate, fees, transfer amount) is critical
- Frame unfavorable rates honestly with user agency

**Mary (Analyst):**
- Validate 48-hour lock window against BRL volatility data
- Add "knew exactly when supplier would receive" as success criteria
- Competitive differentiation opportunity — no competitor markets rate lock emotionally

**Winston (Architect):**
- Rate lock is financial contract needing compliance/audit trail (timestamp, rate, settlement ID)
- 48-hour window needs technical state machine (0-44h active, 44h warning, 48h expiry with re-quote)
- USDT balance placement (internal ledger vs Cregis) affects risk profile shown in UI

## Step 8 — Visual Foundation

### Color Palette

**Primary Colors:**
| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Trust Blue | Deep blue | #1E3A5F | Primary actions, headers |
| Trust Blue Light | Light blue | #3B82F6 | Links, secondary actions |
| Success Green | Emerald | #10B981 | Confirmed states, rate locked |
| Warning Amber | Amber | #F59E0B | Pending, expiring soon |
| Danger Red | Rose | #EF4444 | Errors, blocked states |
| Background | Slate | #F8FAFC | Page background |
| Card | White | #FFFFFF | Card surfaces |
| Text Primary | Slate 900 | #0F172A | Primary text |
| Text Secondary | Slate 500 | #64748B | Secondary text |
| Border | Slate 200 | #E2E8F0 | Dividers, card borders |

**Corridor-Specific Accents:**
| Corridor | Accent | Hex |
|----------|--------|-----|
| Brazil (BRL) | Green-yellow gradient hint | Brazil flag colors subtly |
| Argentina (ARS) | Light blue-white | Argentina flag colors |

### Typography

**Font Stack:**
- Primary: Inter (Google Fonts) — clean, professional, excellent readability
- Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- Monospace: 'JetBrains Mono' for amounts, rates, settlement IDs

**Type Scale:**
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | 32px | 700 | 1.2 |
| H2 | 24px | 600 | 1.3 |
| H3 | 18px | 600 | 1.4 |
| Body | 16px | 400 | 1.5 |
| Body Small | 14px | 400 | 1.5 |
| Caption | 12px | 500 | 1.4 |
| Amount (large) | 40px | 700 | 1.1 |
| Amount (medium) | 24px | 600 | 1.2 |
| Rate | 16px | 500 mono | 1.4 |

### Spacing System

**Base Unit:** 4px

**Spacing Scale:**
| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight inline spacing |
| sm | 8px | Between related elements |
| md | 16px | Card padding, section gaps |
| lg | 24px | Between sections |
| xl | 32px | Major section breaks |
| 2xl | 48px | Page section margins |

### Component Library Approach

**Framework:** Headless UI (accessible primitives) + Tailwind CSS (styling)

**Core Components to Build:**
| Component | Purpose | States |
|-----------|---------|--------|
| Button | Primary, secondary, ghost | default, hover, active, disabled, loading |
| Card | Content container | default, selected, error |
| StatusBadge | Settlement state indicator | pending, active, secured, delivered, error |
| AmountDisplay | Large currency amounts | with/without currency symbol, locked |
| ProgressTracker | Multi-step settlement visualization | milestone states |
| RateLockCard | Rate lock confirmation | locked, warning, expired |
| EvidencePackDownload | Document download widget | default, downloading, complete |
| ApprovalQueueCard | CFO approval item | pending, approved, rejected |
| Input | Form inputs | default, focus, error, disabled |
| Select | Dropdown selection | default, open, selected |
| Modal | Confirmation dialogs | open, closing |

### Layout Grid

**Desktop (CFO/Wei console):**
- Max width: 1440px
- Content grid: 12 columns, 24px gutter
- Sidebar: 280px fixed
- Main content: fluid

**Mobile (Carlos buyer flow):**
- Max width: 480px
- Single column
- 16px horizontal padding
- Bottom sheet for confirmations

**Breakpoints:**
| Name | Min Width | Usage |
|------|-----------|-------|
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |

### Responsive Strategy

**Carlos (Mobile-first):**
- Touch targets: minimum 44x44px
- Bottom-anchored CTAs for thumb reach
- Swipe gestures for timeline navigation
- Progressive disclosure for all complexity

**Wei (Desktop-first):**
- Dense dashboard with data tables
- Keyboard shortcuts for power users
- Bulk actions in table views
- Full evidence pack management

**CFO (Desktop-first):**
- Card-based approval queue
- Expandable risk summary on hover/click
- Bulk approve with multi-select
- Dashboard overview with KPIs

### Animation & Motion

**Principles:**
- Motion conveys momentum and progress (not decoration)
- Settlement progress should feel like forward motion
- Completion should feel like an arrival

**Animation Tokens:**
| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| instant | 0ms | — | State changes |
| fast | 150ms | ease-out | Hover, micro-interactions |
| normal | 250ms | ease-in-out | Panel transitions |
| slow | 400ms | ease-out | Page transitions, celebrations |
| rate-lock | 600ms | spring | Rate lock confirmation celebration |

**Key Animations:**
| Moment | Animation |
|--------|-----------|
| Rate locked | Checkmark with ripple + confetti particles |
| CNY received | Celebratory arrival animation (Uber-style) |
| Settlement progress | Smooth step transitions |
| Button hover | Scale(1.02) + shadow lift |
| Error state | Subtle shake (3 cycles, 4px) |

## Step 9 — Design Directions

### Design Decisions Framework

**Escrow-as-Optional Model**
Every invoice has an `escrow_required` boolean flag. The seller chooses the risk model per buyer. This single flag branches the entire UI:

| State | Risk Bearer | UI Indication |
|-------|------------|--------------|
| `escrow_required: true` | Buyer bears capital burden (locked BRL) | "Funds secured" badge, Cregis escrow details |
| `escrow_required: false` | Seller bears credit risk | No escrow mention, payment-on-delivery model |

**Three Risk Layers**

1. **Credit Risk** — Seller bears on non-escrowed settlements. Shown as "Payment on delivery" model with no upfront lock.
2. **Capital Burden** — Buyer bears on escrowed settlements (BRL locked during settlement). Prominent lock window countdown.
3. **Rate Exposure** — Platform absorbs when settlement exceeds 48h lock window. Internal risk metric, shown to CFO as "Platform risk" in FX exposure views.

**Trust Score → Escrow Score Reframe**

| Metric | Escrowed | Non-Escrowed |
|--------|----------|--------------|
| Settlement history | ✓ Shown | ✓ Shown |
| Escrow score | ✓ "Escrow protected" badge | N/A — no escrow |
| Disputes raised | Neutral fact, always shown | Neutral fact, always shown |
| Trust indicators | Cregis custody badge | Payment-on-delivery model |

**Rate Lock Exposure**
When settlement exceeds 48h lock window, rate exposure risk transfers to platform. The UI shows this as "Rate exposure: Platform" in CFO risk views. Carlos never sees this — it's an internal platform concern.

### Design Directions HTML

All 8 ERP modules are accessible via unified tabbed navigation in `_bmad-output/planning-artifacts/ux-design-directions.html`:

**Navigation Structure:**
- Top nav: "All Modules" (shows ERP) and "Compare"
- ERP sub-nav: Carlos · Buyer | Wei · Seller | CFO · Approver | Sales Ledger | Purchase Ledger | Reconciliation | Counterparty CRM | Invoice Creation

**Sub-Panels (8 total):**

1. **Carlos · Buyer** (`tab-buyer-rate-lock`) — Rate lock celebration (Direction A) + Speed-First minimal confirmation (Direction B)
2. **Wei · Seller** (`tab-seller-dashboard`) — Dashboard, recent settlements, KPI cards
3. **CFO · Approver** (`tab-cfo-approval`) — Card-based approval queue with expandable risk summaries
4. **Sales Ledger** (`tab-sales-ledger`) — Outgoing invoices, BRL holdings, settlement pipeline
5. **Purchase Ledger** (`tab-purchase-ledger`) — Incoming invoices from buyers, USDT escrow holdings
6. **Reconciliation** (`tab-reconciliation`) — USDT/BRL/CNY balances, FX exposure by corridor
7. **Counterparty CRM** (`tab-counterparty`) — Buyer profiles, Escrow Score, interaction history
8. **Invoice Creation** (`tab-invoice-create`) — Invoice form with milestone tranches, Trade Payment Agreement attachment

### Party Mode Synthesis (Step 9 Validation)

**Sally (UX):**
- Rate lock is emotional climax needing visual celebration
- Escrow branching is correct — seller chooses per invoice
- Trust Score → Escrow Score reframe is validated
- Three risk layers properly assigned to UI displays

**Mary (Analyst):**
- 48-hour lock window validated against BRL volatility
- Rate exposure risk (platform) only appears in CFO dashboard
- Escrow Score displayed differently for escrowed vs non-escrowed

**Winston (Architect):**
- `escrow_required` flag is the primary UI branch throughout
- Rate lock state machine: 0-44h active, 44-48h warning, 48h+ re-quote
- USDT placement (internal ledger vs Cregis) affects Escrow Score display

**Consolidated Design Directions:**
- Direction A (Card-Based) for CFO approval queue — recommended
- Direction C (Minimal) for Carlos buyer flow — recommended
- Direction B (Speed-First) as alternative for Carlos
- All directions score 3/3 on Web-only fit and core UX principles

## Step 10 — User Journey Flows

### Critical Journeys

Three primary journeys define Everypay's user experience:

**Journey 1: Carlos — BRL Payment to Rate Lock**
- Entry: Carlos clicks payment link from Wei's invoice
- Core flow: Enter amount → Confirm rate → Transfer BRL → Rate locked (anxiety → relief arc)
- Success path: 4 taps maximum
- Key moment: "Rate Locked" confirmation with celebratory micro-animation

**Journey 2: Wei — Invoice Creation to Evidence Pack**
- Entry: Wei logs into Everypay console → New Invoice
- Core flow: Create invoice → Send link → Track settlement → Download evidence pack
- Escrow branching: `escrow_required` flag drives all UI labels and risk messaging
- Key moment: Single-click evidence pack download

**Journey 3: CFO — High-Value Settlement Approval**
- Entry: CFO opens Approval Queue
- Core flow: Scan risk summary cards → 1-click approve/reject → Audit trail
- Escalation: CFO → Treasurer → Risk Manager (configurable per account)
- Key moment: Pre-computed risk summary enables 2-click decision

### Journey Patterns

| Pattern | Usage |
|---------|-------|
| One-click primary action | Approve, Rate Lock, Download |
| Progressive disclosure | Default: simple. Tap: full detail |
| Escrow branching | `escrow_required` flag drives all UI |
| Real-time tracking | Settlement pipeline with milestone updates |
| Error → recovery | Clear message + actionable CTA |
| Confirmation celebration | Rate locked, CNY received — moment of arrival |

### Flow Optimization Principles

1. Minimize taps to value — Rate lock in 4 taps maximum
2. Anxiety → relief — Rate locked confirmation is celebratory
3. Trust through transparency — Status visible but not overwhelming
4. Zero dead ends — Every error has a recovery path

### Deferral Note

Back-office purchase/sales activities (Purchase Order Management, Sales Ledger Reconciliation, Template Management) are deferred to Epic & Story phase. These are important ERP operational workflows but not UX-differentiating. They map to FR63–FR87 in the PRD and will be handled as standard backlog items during sprint planning.

## Step 11 — Component Strategy

### Design System: Tailwind UI + Headless UI

| Source | Components |
|--------|------------|
| Tailwind UI | Button, Card, Input, Select, Modal, Form inputs, badges, tables |
| Headless UI | Dialog, Dropdown, Tabs, Switch (accessible primitives) |

### Custom Components

| Component | Purpose | Journey |
|-----------|---------|---------|
| `RateLockCard` | Celebratory rate lock confirmation | Carlos |
| `StatusTracker` | Multi-step settlement progress | All |
| `ApprovalCard` | CFO risk summary + 1-click actions | CFO |
| `EvidencePackDownload` | Single-click doc download | Wei |
| `EscrowBadge` | Branches on `escrow_required` | All |
| `RiskSummaryRow` | Green/yellow/red risk indicators | CFO |

### RateLockCard

- States: locked, warning (44–48h), expired (re-quote flow)
- Anatomy: Check icon + CNY amount (hero) + rate/fee row + lock expiry
- Animation: 600ms spring celebration on lock confirmation
- Variants: Direction A (celebration), Direction B (minimal)

### StatusTracker

- States per step: completed, active, pending
- 5 steps: BRL Received → Rate Locked → In Transit → Customs → CNY Delivered
- Progressive disclosure: step detail on tap

### ApprovalCard (CFO)

- States: pending, approved, rejected
- Anatomy: Settlement ID + amount + parties + RiskSummary + MetricsGrid + ActionButtons
- Risk indicators: green/yellow/red dots per risk layer

### EscrowBadge

- Branches on `escrow_required: true/false`
- True: "Escrow Protected" + Cregis custody detail
- False: Hidden or "Payment-on-delivery" (seller view)

### Implementation Roadmap

**Phase 1 (MVP):** RateLockCard, StatusTracker, ApprovalCard, EscrowBadge
**Phase 2:** EvidencePackDownload, KPICard, RiskSummaryRow
**Phase 3:** Full library refinement, animation polish

## Step 12 — UX Consistency Patterns

### Button Hierarchy

| Action | Style | Usage |
|--------|-------|-------|
| Primary CTA | `btn btn-success` (green) | Rate Lock, Approve, Pay Now |
| Secondary | `btn btn-primary` (blue) | Continue, View Details |
| Tertiary | `btn btn-secondary` (outlined) | Cancel, Back, Reject |
| Danger | `btn btn-danger` (red) | Reject Settlement only |

**Rules:** One primary CTA per view. Never side-by-side primary + danger. Loading state: spinner replaces text, button disabled.

### Feedback Patterns

| State | Visual | Example |
|-------|--------|---------|
| Success | Green badge + checkmark | "Rate Locked", "CNY Delivered" |
| Pending | Amber badge + timestamp | "Pending — awaiting confirmation" |
| Warning | Amber badge + warning icon | "Rate expires in 4h" (44-48h window) |
| Error | Red badge | "Transfer Failed" + reason code |
| Info | Blue badge | "Escrow Details" expandable |

**Rules:** Actor + timestamp on all state changes (audit trail). Reason codes for Reject/Pending states. Amber pulse only for initial load — use static badge with elapsed time for ongoing states.

### Rate Lock State Machine Integration

The 0-44h/44-48h/48h+ trifurcation affects all CTAs and feedback:

| Window | CTA | Feedback |
|--------|-----|---------|
| 0–44h | Standard patterns | Green badge |
| 44–48h | "Confirm (Rate expires in Xh)" | Amber warning banner |
| 48h+ | "Get New Quote" (disabled Confirm) | Red "Re-quote required" |

### Form Patterns

- Labels above inputs, 14px semibold
- Error messages inline below field, red text + reason
- Required fields: asterisk + `aria-required="true"` + legend
- Disabled state: 50% opacity + explanatory tooltip — never silent disable

### Navigation Patterns

- Top nav: Logo left, user/mode indicator right
- Sidebar (desktop): Icon + label, collapsible
- Sub-navigation: Tab row, horizontal scroll on overflow
- Back navigation: Breadcrumb for deep flows

### Modal Patterns

- Default: 480px max-width, centered
- Complex confirmations (settlement details, fee breakdown): 640px max
- Backdrop: `rgba(0,0,0,0.5)`
- Close: X button top-right + Escape key
- Primary action bottom-right
- State invalidation: re-validate on submit to prevent race conditions

### Empty States

- Centered illustration + message + CTA
- Positive confirmation states for CFO: "All 47 settlements reconciled — zero exceptions"
- New user vs. all-complete vs. all-expired: different CTAs per state

### Loading States

- Skeleton screens for initial table/card load
- Status badges always show real state — never skeletonize time-sensitive data
- Spinner only for button loading

### Accessibility

- Focus management: modal opens → focus trap; modal closes → focus returns to trigger
- `aria-live="polite"` for async status changes
- `prefers-reduced-motion` respected — no shake animation
- Color contrast: 4.5:1 minimum for text, 3:1 for large text/badges

### Party Mode Findings (Step 12 Validation)

**Sally (UX):** 11 gaps identified — offline state handling, touch targets (44px min), progress steppers for Carlos, confirmation dialogs for destructive actions, accessibility specs throughout

**Winston (Architect):** Rate lock state machine not reflected in patterns, state transition banners missing, disabled state affordance, skeleton screens hiding time-sensitive status, modal invalidation on state change

**Mary (Analyst):** Actor + timestamp on all feedback (audit), danger by consequence magnitude, reason codes for Reject/Pending, positive confirmation states for CFO, expected-time context for pending

## Step 13 — Responsive Design & Accessibility

### Responsive Strategy

| Persona | Device | Strategy |
|---------|--------|----------|
| Carlos (buyer) | Mobile browser | Touch-first, bottom-anchored CTAs, minimal scrolling |
| Wei (seller) | Desktop-first | Full dashboard, keyboard shortcuts, data density |
| CFO (approver) | Desktop-first | Card-based queue, expandable detail |

**Web-only MVP:** No mobile app. All experiences must work in mobile browser (375px+) and desktop (1024px+).

### Breakpoint Strategy

| Breakpoint | Width | Target |
|------------|-------|--------|
| Mobile | < 640px | Carlos buyer flow |
| Tablet | 640–1023px | Wei on tablet |
| Desktop | ≥ 1024px | Wei/CFO console |

**Rules:** Mobile-first CSS. No horizontal scrolling. Tables collapse to cards on mobile.

### Accessibility Strategy

**WCAG Level: AA**

| Requirement | Implementation |
|-------------|----------------|
| Color contrast | 4.5:1 minimum (text), 3:1 (badges/icons) |
| Touch targets | 44×44px minimum |
| Focus indicators | Visible 2px outline on all interactive elements |
| Keyboard navigation | Full flow navigable without mouse |
| Screen reader | Semantic HTML, ARIA labels, `aria-live` for status changes |
| Reduced motion | `prefers-reduced-motion` respected |

### Testing Strategy

**Responsive:** Physical devices + Chrome DevTools emulation across Chrome, Firefox, Safari, Edge
**Accessibility:** axe-core/WAVE automated + VoiceOver/NVDA manual + keyboard-only audit
