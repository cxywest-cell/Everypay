# Story 2.1: Invoice Creation with Line Items

## Epic
2 - Documents & Review Workflow

## User Story
As a seller, I want to create invoices with multiple line items so that I can bill buyers for goods and services.

## Acceptance Criteria
1. Seller can access invoice creation page from the invoices list
2. Seller can add/remove line items with description, quantity, unit price, and currency
3. Total amount auto-calculates from line items
4. Seller can save as DRAFT or send immediately (SENT)
5. Seller can load a template to pre-fill line items
6. Optional: contract document URL and due date
7. Client-side validation: buyer ID required, at least one line item, valid quantities/prices

## Implementation

### Files Created
- `src/app/invoices/create/page.tsx` - Invoice creation form with line item management

### API Routes Used
- `GET /api/templates?sellerId={id}` - Load available templates
- `POST /api/invoices` - Create new invoice with line items, status, optional template reference

### Key Features
- Dynamic line item add/remove with quantity, price, currency (USD/HKD)
- Template selector that pre-fills line items from saved templates
- Live total calculation
- Save as Draft or Create & Send actions
- Form validation with inline error messages

## Status
in-progress
