---
story_id: 1.1
story_key: 1-1-user-registration-with-email
epic: 1
title: User Registration with Email
status: review
created: 2026-04-14
source: epics.md (Story 1.1)
---

# Story 1.1: User Registration with Email

Status: review

## Story

As a prospective user,
I want to register on the platform using my email address,
So that I can access the Everypay platform and begin the onboarding process.

## Acceptance Criteria

**AC1: Registration Form**

**Given** a prospective user has a valid email address
**When** they complete the registration form with email, password, and basic profile information
**Then** the system creates a user account with PENDING verification status
**And** sends a verification email to the provided email address (mock: redirect to login)
**And** logs the registration timestamp

**AC2: Duplicate Email Check**

**Given** the user attempts to register with an email already in the system
**When** they submit the registration form
**Then** the system returns an error message "An account with this email already exists"
**And** no new account is created

**AC3: Email Verification (Post-Registration)**

**Given** the user clicks the verification link in the email
**When** the link is valid and not expired
**Then** the user's email is marked as verified
**And** the user can proceed to KYC initiation

**AC4: Login Page**

**Given** a registered user with verified email
**When** they visit the login page
**Then** they can sign in with email and password
**And** are redirected to the dashboard on success

## Tasks / Subtasks

- [x] Task 1 (AC: 1) — Create registration page UI
  - [x] Form with email, password, first name, last name
  - [x] Optional invite code field
  - [x] Client-side validation (email format, password min-length, required fields)
  - [x] Redirect to login on success
- [x] Task 2 (AC: 1, 2) — POST /api/users endpoint
  - [x] Server-side validation (required fields, email format, password min-length)
  - [x] Duplicate email check (409 Conflict)
  - [x] Create user with KYCStatus.PENDING
  - [x] Write updated user list to seed
- [x] Task 3 (AC: 4) — Create login page UI
  - [x] Form with email, password
  - [x] Remember-me checkbox
  - [x] Client-side validation
  - [x] Query /api/users to check credentials
  - [x] Redirect to dashboard on success
  - [x] "Registered successfully" banner when arriving from registration

## Dev Agent Record

### Agent Model Used

qwen3.6-plus (with subagent)

### Debug Log References

- TypeScript compilation: zero errors (npm run build succeeded)
- ESLint: not available locally (no local eslint binary), but build passed clean

### Completion Notes List

1. **Auth Layout** — `src/app/(auth)/layout.tsx` provides centered flex container with gray gradient background for both login and register pages.
2. **Registration Page** — `src/app/(auth)/register/page.tsx` with full client-side form validation, calls `POST /api/users`. Redirects to `/login?registered=true` on success.
3. **Login Page** — `src/app/(auth)/login/page.tsx` with email/password form, remember-me checkbox, checks credentials against `GET /api/users` seed data. Shows success banner when coming from registration redirect.
4. **Users API** — `src/app/api/users/route.ts` with GET (list all users) and POST (create new user with validation, duplicate check returns 409).
5. **Types Added** — `RegistrationRequest`, `RegistrationResponse`, `LoginRequest`, `LoginResponse` added to `src/lib/types.ts`.
6. **Tailwind Config** — Added `everypay` color palette (50-900) and font family mappings to `tailwind.config.js`.

### File List

- `src/app/(auth)/layout.tsx` — Auth route group layout
- `src/app/(auth)/register/page.tsx` — Registration page
- `src/app/(auth)/login/page.tsx` — Login page
- `src/app/api/users/route.ts` — GET/POST users endpoint
- `src/lib/types.ts` — Added RegistrationRequest, RegistrationResponse, LoginRequest, LoginResponse
- `tailwind.config.js` — Added everypay color palette
