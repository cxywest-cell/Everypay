---
story_id: 1.5
story_key: 1-5-team-member-invitation-and-management
epic: 1
title: Team Member Invitation and Management
status: review
created: 2026-04-14
source: epics.md (Story 1.5)
---

# Story 1.5: Team Member Invitation and Management

Status: review

## Story

As a team administrator,
I want to invite and manage team members within my organization,
So that I can add colleagues to the platform and configure their access.

## Acceptance Criteria

**AC1: Invite Form**

**Given** an organization Admin or Operator is in the team management section
**When** they initiate a new team member invitation
**Then** the system requires: email address, role assignment, and optional personal message

**AC2: Send Invitation**

**Given** the Admin submits a valid team member invitation
**When** the email is not already in the organization
**Then** the system sends an invitation email with unique acceptance link
**And** displays the invitation as "PENDING" in the team management list

**AC3: Cancel Invitation**

**Given** the Admin cancels a pending invitation
**When** they click "Revoke Invitation"
**Then** the invitation link is invalidated
**And** the invitation status updates to "CANCELLED"

**AC4: Remove Team Member**

**Given** the Admin removes a team member from the organization
**When** they confirm the removal action
**Then** the user's access is immediately revoked
**And** their data is retained per compliance requirements (NFR12)

## Tasks / Subtasks

- [x] Task 1 (AC: 1, 2) — Invite member form in team page
  - [x] Email input, role toggle buttons, optional personal message
  - [x] Validate email not already in organization
  - [x] Generate unique invite code and 72-hour expiry
- [x] Task 2 (AC: 2, 3) — Invitations API
  - [x] POST /api/invitations — create new invitation with 72-hour expiry
  - [x] PATCH /api/invitations — cancel or accept invitation
  - [x] GET /api/invitations — list all invitations
  - [x] Seed file: team_invitations.json
- [x] Task 3 (AC: 4) — Remove team member
  - [x] DELETE /api/users/:id — soft delete (clear org, roles, mark as REJECTED)
  - [x] Confirmation dialog before removal
  - [x] Pending invitations section with "Revoke" button

## Dev Agent Record

### Agent Model Used

qwen3.6-plus

### Debug Log References

- TypeScript compilation: zero errors (npm run build compiled successfully)
- Prerender warnings: expected for client-side pages using useSearchParams

### Completion Notes List

1. **Team Types** — `src/lib/teamTypes.ts` with TeamInvitation interface.
2. **Invitation Seed** — `src/seeds/team_invitations.json` with 2 sample invitations (1 PENDING, 1 ACCEPTED).
3. **Invitations API** — `src/app/api/invitations/route.ts` with GET/POST/PATCH. Validates duplicate emails, generates 72-hour expiry codes.
4. **User Delete API** — `src/app/api/users/[id]/route.ts` DELETE endpoint — soft delete clears organization and roles.
5. **Team Page Updates** — Added "Invite Member" button with inline form, pending invitations section with "Revoke" buttons, "Remove" action per user row.

### File List

- `src/lib/teamTypes.ts` — Team invitation types
- `src/seeds/team_invitations.json` — Invitation seed data
- `src/app/api/invitations/route.ts` — GET/POST/PATCH invitations endpoint
- `src/app/api/users/[id]/route.ts` — DELETE user endpoint (soft delete)
- `src/app/team/page.tsx` — Updated team page with invitations and member removal
