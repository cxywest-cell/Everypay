# Story 2.6: Template Management

## Epic
2 - Documents & Review Workflow

## User Story
As a seller, I want to create and manage invoice templates so that I can quickly generate invoices for recurring orders.

## Acceptance Criteria
1. Create templates with name, line items, payment terms, contract reference
2. View all templates for the current seller
3. Template versioning (FR63) - when updated, old version is superseded
4. Set default template per buyer (FR86)
5. Templates can be loaded during invoice creation to pre-fill line items

## Implementation

### Files Created
- `src/app/templates/page.tsx` - Template management page with create/list/set-default

### API Routes (Previously Created)
- `GET /api/templates?sellerId=&buyerId=` - List templates with filtering
- `POST /api/templates` - Create new template
- `PATCH /api/templates` - Version template (with updates) or set default for buyer

### Seed Data
- `src/seeds/invoice_templates.json` - 1 seed template (Electronics Standard Order)

### Key Features
- Template creation form with line item management
- Template cards showing version, superseded status, default buyer
- Set default buyer inline editing
- Line item preview on each template card
- Created/updated date display

## Status
in-progress
