# Story 2.2: Invoice Detail View

## Epic
2 - Documents & Review Workflow

## User Story
As a user, I want to view full invoice details including line items, parties, and status so that I can review and take action.

## Acceptance Criteria
1. Display invoice ID, status badge, total amount
2. Show seller and buyer information
3. List all line items with quantities, prices, and subtotals
4. Show due date, contract document reference, template reference
5. Status-based actions:
   - DRAFT: Send Invoice button
   - SENT: Mark as Paid, Mark Overdue buttons
   - OVERDUE: Mark as Paid button
6. CTA to create payment agreement for SENT invoices

## Implementation

### Files Created
- `src/app/invoices/[id]/page.tsx` - Invoice detail view with status actions

### API Routes Updated/Created
- `GET /api/invoices/[id]` - Retrieve single invoice (updated with proper Invoice type)
- `PATCH /api/invoices/[id]` - Update invoice status (send, mark_paid, mark_overdue)

### Key Features
- Status badge with color coding (DRAFT/SENT/PAID/OVERDUE)
- Line items table with description, quantity, unit price, total
- Action buttons change based on current status
- "Create Payment Agreement" CTA appears for SENT invoices
- Parties display (seller/buyer IDs)

## Status
in-progress
