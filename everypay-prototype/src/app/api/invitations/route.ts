import { NextRequest, NextResponse } from "next/server";
import { readSeed, writeSeed, withMockError } from "../helpers";
import type { TeamInvitation } from "@/lib/teamTypes";

export async function GET() {
  return withMockError(() => {
    const invitations = readSeed<Array<TeamInvitation>>("team_invitations.json");
    return NextResponse.json({ data: invitations, status: "success" });
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    email: string;
    roles: string[];
    invitedBy: string;
    organizationId: string;
    personalMessage?: string;
  };

  return withMockError(() => {
    // Check if user already in this organization
    const users = readSeed<
      Array<{ id: string; email: string; organizationId: string | null }>
    >("users.json");
    const existingUser = users.find(
      (u: { email: string; organizationId: string | null }) =>
        u.email.toLowerCase() === body.email.toLowerCase() &&
        u.organizationId === body.organizationId
    );
    if (existingUser) {
      return NextResponse.json(
        { data: null, status: "error", error: "User is already in this organization" },
        { status: 409 }
      );
    }

    // Check for existing pending invitation
    const invitations = readSeed<Array<TeamInvitation>>("team_invitations.json");
    const existingInvitation = invitations.find(
      (i: TeamInvitation) =>
        i.email.toLowerCase() === body.email.toLowerCase() &&
        i.organizationId === body.organizationId &&
        i.status === "PENDING"
    );
    if (existingInvitation) {
      return NextResponse.json(
        { data: null, status: "error", error: "An invitation is already pending for this email" },
        { status: 409 }
      );
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 72 * 60 * 60 * 1000); // 72 hours
    const inviteCode = `INV-${Date.now().toString(36).toUpperCase()}`;

    const newInvitation: TeamInvitation = {
      id: `inv-team-${Date.now()}`,
      organizationId: body.organizationId,
      email: body.email,
      invitedBy: body.invitedBy,
      roles: body.roles,
      status: "PENDING",
      inviteCode,
      sentAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      acceptedAt: null,
      personalMessage: body.personalMessage || null,
    };

    invitations.push(newInvitation);
    writeSeed("team_invitations.json", invitations);

    return NextResponse.json({ data: newInvitation, status: "success" }, { status: 201 });
  });
}

export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as {
    invitationId: string;
    action: "cancel" | "accept";
  };

  return withMockError(() => {
    const invitations = readSeed<Array<TeamInvitation>>("team_invitations.json");
    const invitation = invitations.find(
      (i: TeamInvitation) => i.id === body.invitationId
    );

    if (!invitation) {
      return NextResponse.json(
        { data: null, status: "error", error: "Invitation not found" },
        { status: 404 }
      );
    }

    if (body.action === "cancel") {
      invitation.status = "CANCELLED";
    } else if (body.action === "accept") {
      const now = new Date();
      const expiresAt = new Date(invitation.expiresAt);
      if (now > expiresAt) {
        invitation.status = "EXPIRED";
      } else {
        invitation.status = "ACCEPTED";
        invitation.acceptedAt = now.toISOString();
      }
    }

    writeSeed("team_invitations.json", invitations);
    return NextResponse.json({ data: invitation, status: "success" });
  });
}
