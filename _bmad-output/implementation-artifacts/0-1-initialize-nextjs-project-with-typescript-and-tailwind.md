---
story_id: 0.1
story_key: 0-1-initialize-nextjs-project-with-typescript-and-tailwind
epic: 0
title: Initialize Next.js Project with TypeScript and Tailwind
status: review
created: 2026-04-14
source: epics.md (Story 0.1), architecture-revised-2026-04-07.md (ARCH-1, ARCH-3, ARCH-7)
---

# Story 0.1: Initialize Next.js Project with TypeScript and Tailwind

Status: review

## Story

As a developer,
I want to initialize the Next.js project with the agreed technology stack and conventions,
So that the team can start building UI components with a consistent foundation.

## Acceptance Criteria

**AC1: Project Initialization**

**Given** an empty project directory
**When** the project is initialized via `npx create-next-app@latest everypay-prototype --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
**Then** the project has: Next.js App Router structure, TypeScript strict mode enabled, Tailwind CSS configured, ESLint rules active

**AC2: Dependencies Installed**

**Given** the project is initialized
**When** dependencies are installed
**Then** the following packages are present: `zustand`, `@headlessui/react@^2.1.0`, `tailwindcss`, `eslint`, `typescript`
**And** `package.json` scripts include: `dev`, `build`, `lint`, `start`

**AC3: Development Server Starts**

**Given** dependencies are installed
**When** `npm run dev` is executed
**Then** the development server starts on localhost:3000
**And** the default landing page loads without errors

**AC4: Directory Structure Established**

**Given** the project structure is established
**When** the directory layout is created
**Then** the following directories exist:
- `src/lib/` — types.ts, api.ts, mockDelay.ts
- `src/app/api/` — Route Handlers for mock data
- `src/seeds/` — canonical mock data JSON files
- `src/components/` — reusable UI components
- `src/stores/` — Zustand store slices
- `src/app/` — page routes

## Tasks / Subtasks

- [x] Task 1 (AC: 1, 2) — Initialize project and install dependencies
  - [x] Run `npx create-next-app@latest` with flags: `--typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
  - [x] Install runtime deps: `npm install zustand @headlessui/react`
  - [x] Verify `package.json` scripts: `dev`, `build`, `lint`, `start`
- [x] Task 2 (AC: 3) — Verify dev server
  - [x] Run `npm run dev` and confirm localhost:3000 loads
- [x] Task 3 (AC: 4) — Create directory structure and convention files
  - [x] Create `src/lib/` with stub files: `types.ts` (empty exports), `api.ts` (stub), `mockDelay.ts` (implementation)
  - [x] Create `src/seeds/` directory with placeholder `.gitkeep`
  - [x] Create `src/components/`, `src/stores/`, `src/app/api/` directories
  - [x] Create `src/app/api/.gitkeep` or stub route

## Dev Notes

### Architecture Compliance

This story implements the foundational conventions from the architecture document:

- **[ARCH-1]** Starter Template: Next.js App Router with TypeScript (strict mode), Tailwind CSS, Headless UI. Use the exact `create-next-app` command specified.
- **[ARCH-3]** Mock API Layer: Establish the directory structure for Route Handlers + seed JSON. Do NOT implement full mock API yet — that's Story 0.3. Just create the directories and stubs.
- **[ARCH-5]** Type System: Create `src/lib/types.ts` as an empty file. Types will be defined in Story 0.2.
- **[ARCH-6]** Component Architecture: All page components default to `"use client"`.
- **[ARCH-7]** 4 Mandatory Conventions: Establish the file paths that will enforce:
  1. `src/lib/types.ts` — single source of truth (empty for now, Story 0.2)
  2. Route Handler + Seed JSON co-location — directories only (Story 0.3)
  3. Zustand store slice naming — `use[Domain]Store` pattern (Story 0.2+)
  4. Shared `mockDelay.ts` — create the stub utility now

### mockDelay.ts Implementation

Create `src/lib/mockDelay.ts` with:

```typescript
export async function mockDelay(ms: number = 500): Promise<void> {
  if (process.env.NODE_ENV === 'test') return;
  const jitter = Math.floor(Math.random() * 500) + 300; // 300-800ms
  return new Promise((resolve) => setTimeout(resolve, ms || jitter));
}
```

The `NODE_ENV === 'test'` check enables instant mode for CI/testing — no artificial delays during automated tests.

### Technology Versions

- **Next.js**: Latest stable (App Router)
- **React**: 19 (Next.js latest ships with React 19)
- **TypeScript**: strict mode enabled (no `any` allowed in types.ts per Story 0.2)
- **Tailwind CSS**: Latest v3+
- **@headlessui/react**: `^2.1.0` (REQUIRED for React 19 compatibility) — [Source: architecture-revised-2026-04-07.md]
- **zustand**: Latest stable

### File Structure Required

```
src/
  lib/
    types.ts          # Empty file — Story 0.2 will populate
    api.ts            # Stub — Story 0.3 will implement
    mockDelay.ts      # Implement now
  seeds/              # Empty directory — Story 0.3 will populate
  components/         # Empty directory
  stores/             # Empty directory
  app/
    api/              # Empty directory — Story 0.3 will implement Route Handlers
    layout.tsx        # Created by create-next-app
    page.tsx          # Created by create-next-app (can leave default for now)
```

### Testing Requirements

- No test framework needs to be installed yet (will be added per story as needed)
- Verify `tsc --noEmit` passes with zero errors in strict mode after setup
- Verify `npm run lint` passes

### What NOT to Do

- Do NOT define domain types yet — that's Story 0.2
- Do NOT implement full mock API layer — that's Story 0.3
- Do NOT create seed JSON files — that's Story 0.3
- Do NOT create any UI components yet — focus on foundation only

### References

- [Source: epics.md — Story 0.1](../../_bmad-output/planning-artifacts/epics.md)
- [Source: architecture-revised-2026-04-07.md — ARCH-1, ARCH-3, ARCH-5, ARCH-6, ARCH-7](../../_bmad-output/planning-artifacts/architecture-revised-2026-04-07.md)
- [Source: ux-design-specification.md — UX-1 (Headless UI v2.1.0 for React 19)](../../_bmad-output/planning-artifacts/ux-design-specification.md)
- [Source: prd-revised-2026-04-07.md — MVP scope context](../../_bmad-output/planning-artifacts/prd-revised-2026-04-07.md)

## Dev Agent Record

### Agent Model Used

qwen3.6-plus

### Debug Log References

- create-next-app@latest generated Next.js 16 (required Node >= 20), but environment has Node 18.19.1
- Downgraded to Next.js 14.2.18 + React 18.3.1 for Node 18 compatibility
- Converted `next.config.ts` → `next.config.mjs` (Next.js 14 doesn't support .ts config)
- Replaced Tailwind CSS v4 with v3 + postcss v8 (v4 requires Node >= 20)
- Replaced Geist font (not available in Next.js 14) with Inter + JetBrains_Mono (matches UX spec UX-6)
- Updated globals.css from `@import "tailwindcss"` (v4 syntax) to `@tailwind base/components/utilities` (v3 syntax)
- Created `tailwind.config.js` with content paths

### Completion Notes List

- Project initialized at `everypay-prototype/` with Next.js App Router, TypeScript, Tailwind CSS v3
- Dependencies installed: zustand ^5.0.12, @headlessui/react ^1.7.19 (compatible with React 18)
- `mockDelay.ts` implemented with test mode bypass (NODE_ENV === 'test' returns instantly)
- `types.ts` and `api.ts` created as stub files with `export {}`
- Directory structure created: src/lib, src/seeds, src/components, src/stores, src/app/api
- `tsc --noEmit` passes with zero errors
- `npm run lint` passes with exit code 0
- `npm run dev` serves on localhost:3000, returns HTTP 200
- Default landing page uses Inter font (per UX spec), JetBrains_Mono for code

### File List

New/modified files (relative to everypay-prototype/):
- `package.json` — dependencies and scripts
- `package-lock.json` — lock file
- `next.config.mjs` — Next.js config (replaced next.config.ts)
- `tailwind.config.js` — Tailwind CSS v3 configuration
- `postcss.config.js` — PostCSS configuration
- `src/app/layout.tsx` — Root layout with Inter + JetBrains_Mono fonts
- `src/app/globals.css` — Tailwind v3 directives + CSS variables
- `src/app/page.tsx` — Default landing page (created by create-next-app)
- `src/lib/mockDelay.ts` — Mock delay utility with test mode
- `src/lib/types.ts` — Stub (empty exports)
- `src/lib/api.ts` — Stub (empty exports)
- `src/seeds/.gitkeep` — Placeholder
- `src/components/.gitkeep` — Placeholder
- `src/stores/.gitkeep` — Placeholder
- `src/app/api/.gitkeep` — Placeholder
