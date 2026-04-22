# Everypay Prototype

A Next.js 14 prototype for the Everypay platform — a B2B financial operations tool supporting buyer procurement workflows, multi-organization management, KYB compliance tracking, and role-based access control.

## Prerequisites

- Node.js >= 18
- npm (bundled with Node.js)

## Quick Start

```bash
cd everypay-prototype
npm install
npm run dev
```

The dev server starts on **http://localhost:3000**.

## Demo Accounts

The prototype uses URL parameters for authentication simulation. Open these URLs to test different personas:

| URL | Role | Description |
|-----|------|-------------|
| `/?userId=user-1` | Buyer | Default buyer, member of multiple orgs |
| `/?userId=user-2` | Seller | Member of Beta Trading Co. |
| `/?userId=user-3` | Approver | Sees approval queue and compliance views |

Switch organizations by adding `&org=<org-id>` to any URL:
- `&org=org-alpha` — Alpha Supplies Ltda. (VERIFIED → full navigation)
- `&org=org-beta` — Beta Trading Co. (PENDING → onboarding stepper)
- `&org=org-delta` — Digital Account Foundation (PENDING → onboarding stepper)

## Architecture

```
src/
  app/                # Next.js App Router
    (app)/            # Authenticated layout (sidebar + header)
    (auth)/           # Auth layout (login, forgot-password)
    api/              # Mock API routes (seed-based)
    organization-setup/
  components/         # Shared UI (Sidebar, Header, etc.)
  seeds/              # JSON seed data (users, orgs, approvals, etc.)
  lib/                # Types, utilities
  app/(app)/
    accounting/       # Accounting overview page
    approval-flow/    # Approval flow builder
    approvals/        # Approval queue + detail views
    assets/           # Asset management
    compliance-pending/
    trading/          # Trading pages (list, create, detail)
```

### Seed Data

All data is file-based for prototyping. API routes read from `src/seeds/*.json`:

| File | Contents |
|------|----------|
| `users.json` | Demo user accounts |
| `organizations.json` | Org profiles with KYB status (VERIFIED/PENDING) |
| `approvals.json` | Approval queue items |
| `trades.json` | Trade records |
| `assets.json` | Asset records |

To modify data, edit the seed JSON files and refresh — no database needed.

### Role-Based Navigation

The sidebar filters nav items based on the user's role (buyer/seller/approver), configured in `src/components/nav-config.ts`.

### Org KYB Status → Sidebar Behavior

- **VERIFIED orgs**: Full navigation menu with all role-permitted pages
- **PENDING orgs**: Onboarding progress stepper replacing the nav menu, showing 5 stages (Business Identity, Compliance Review, Final Approval, Build Your Team, Create Treasury Unit)

## Key Features

- **Multi-org switcher**: Bottom-of-sidebar dropdown with org avatar, name, owner role badge, and KYB status indicator
- **Split-screen auth layout**: Login page with branded left panel and form right panel
- **Mock API layer**: Seed-driven JSON API with latency simulation for realistic prototyping
- **Responsive sidebar**: Collapsible on desktop, slide-out overlay on mobile

## Tech Stack

- **Next.js 14** — App Router, client components
- **Tailwind CSS** — Custom `everypay` color palette
- **TypeScript** — Type definitions in `src/lib/types.ts`
- **Zustand** — Client state management

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

No environment variables are required for the prototype (all data is seeded from JSON files). For a production deployment, add:

```
NEXT_PUBLIC_API_URL=  # Replace mock API routes with real backend
```

### Platform Notes

- **Vercel**: Push to a connected git repo and deploy automatically. No additional config needed.
- **Docker**: Use the standard Next.js Docker image with `npm run build` as the build step.
- **WSL2**: If developing in WSL2, clear the `.next` cache (`rm -rf .next`) after code changes if hot reload doesn't pick them up.
