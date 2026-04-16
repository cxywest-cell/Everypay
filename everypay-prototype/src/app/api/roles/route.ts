import { NextRequest, NextResponse } from "next/server";
import { readSeed, writeSeed, withMockError } from "../helpers";
import { Role } from "@/lib/types";

export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as {
    adminId: string;
    targetUserId: string;
    newRoles: string[];
  };

  return withMockError(() => {
    // Find admin user
    const users = readSeed<
      Array<{ id: string; roles: string[]; organizationId: string | null }>
    >("users.json");
    const admin = users.find((u: { id: string }) => u.id === body.adminId);

    if (!admin) {
      return NextResponse.json(
        { data: null, status: "error", error: "Admin not found" },
        { status: 404 }
      );
    }

    // Check admin has ADMIN role
    if (!admin.roles.includes(Role.ADMIN)) {
      return NextResponse.json(
        { data: null, status: "error", error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Find target user
    const target = users.find((u: { id: string }) => u.id === body.targetUserId);
    if (!target) {
      return NextResponse.json(
        { data: null, status: "error", error: "Target user not found" },
        { status: 404 }
      );
    }

    // Validate roles
    const validRoles = Object.values(Role);
    for (const r of body.newRoles) {
      if (!validRoles.includes(r as Role)) {
        return NextResponse.json(
          { data: null, status: "error", error: `Invalid role: ${r}` },
          { status: 400 }
        );
      }
    }

    // Check admin cannot assign roles outside their scope
    // Admin can assign any role except ADMIN to others
    const disallowedForNonAdmin = body.newRoles.filter(
      (r) => r !== Role.ADMIN && !validRoles.includes(r as Role)
    );
    if (disallowedForNonAdmin.length > 0) {
      return NextResponse.json(
        { data: null, status: "error", error: "Cannot assign these roles" },
        { status: 403 }
      );
    }

    const previousRoles = target.roles;
    target.roles = body.newRoles;
    writeSeed("users.json", users);

    // Log to audit_log
    const auditLogs = readSeed<
      Array<{ id: string; eventType: string; settlementId: string | null; actor: string; timestamp: string; hashReference: string; metadata: Record<string, unknown> }>
    >("audit_log.json");
    const now = new Date().toISOString();
    auditLogs.push({
      id: `audit-${Date.now()}`,
      eventType: "ROLE_CHANGE",
      settlementId: null,
      actor: body.adminId,
      timestamp: now,
      hashReference: `sha256-audit-${Date.now()}`,
      metadata: {
        targetUserId: body.targetUserId,
        previousRoles,
        newRoles: body.newRoles,
      },
    });
    writeSeed("audit_log.json", auditLogs);

    return NextResponse.json({
      data: { userId: body.targetUserId, roles: body.newRoles },
      status: "success",
    });
  });
}
