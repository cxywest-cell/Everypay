---
story_id: 1.4
story_key: 1-4-rbac-role-assignment-per-user
epic: 1
title: RBAC Role Assignment per User
status: review
created: 2026-04-14
source: epics.md (Story 1.4)
---

# Story 1.4: RBAC Role Assignment per User

Status: review

## Story

As a platform administrator,
I want to assign RBAC roles to users within my organization,
So that users have appropriate access levels based on their responsibilities.

## Acceptance Criteria

**AC1: User Role Display**

**Given** an Admin user is accessing the user management section
**When** they view the list of organization users
**Then** the system displays each user's current role, status, and last active timestamp

**AC2: Role Modification**

**Given** an Admin selects a user to modify their role
**When** they choose from available roles (Viewer, Operator, Approver, Compliance, Admin)
**Then** the system validates the Admin has permission to assign this role
**And** updates the user's role in the users table
**And** logs the role change with timestamp and Admin ID in audit_log

**AC3: Permission Enforcement**

**Given** an Admin attempts to assign a role outside their permission scope
**When** they submit the role change
**Then** the system rejects the request with "Insufficient permissions" error
**And** logs the attempted unauthorized action in audit_log

**AC4: Immediate Effect**

**Given** a role change is successful
**When** the affected user next logs in or makes an API call
**Then** the new role permissions are enforced immediately
**And** previous role permissions are revoked

## Tasks / Subtasks

- [x] Task 1 (AC: 1) — Create team management page
  - [x] User table with name, email, KYC status, roles, last active
  - [x] Color-coded role badges (Admin=red, Approver=purple, Compliance=yellow, Operator=blue, Viewer=gray)
  - [x] Avatar with initials
- [x] Task 2 (AC: 2) — Role editing UI
  - [x] Inline role editing with toggle buttons for each role
  - [x] Save/Cancel actions
  - [x] Multi-role support (users can have multiple roles)
- [x] Task 3 (AC: 2, 3) — Role assignment API
  - [x] PATCH /api/roles — update user roles with admin permission check
  - [x] Validate admin has ADMIN role
  - [x] Reject unauthorized role changes with 403
- [x] Task 4 (AC: 2) — Audit logging
  - [x] GET /api/audit-log — fetch audit entries
  - [x] PATCH /api/roles logs ROLE_CHANGE events with previous/new roles
  - [x] Audit log seed and display in team page

## Dev Agent Record

### Agent Model Used

qwen3.6-plus

### Debug Log References

- TypeScript compilation: zero errors (npm run build compiled successfully)
- Prerender warnings: expected for client-side pages using useSearchParams

### Completion Notes List

1. **Team Page** — `src/app/team/page.tsx` with user table, inline role editing, role toggle buttons, and audit log viewer.
2. **Roles API** — `src/app/api/roles/route.ts` PATCH endpoint with admin permission validation, role validation, and audit logging.
3. **Audit Log API** — `src/app/api/audit-log/route.ts` GET endpoint returning audit log entries.
4. **Audit Seed** — `src/seeds/audit_log.json` with one sample role change entry.

### File List

- `src/app/team/page.tsx` — Team management page with role editing
- `src/app/api/roles/route.ts` — PATCH /api/roles endpoint
- `src/app/api/audit-log/route.ts` — GET /api/audit-log endpoint
- `src/seeds/audit_log.json` — Audit log seed data
