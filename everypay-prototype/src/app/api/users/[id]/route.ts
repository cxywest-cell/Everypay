import { NextRequest, NextResponse } from "next/server";
import { readSeed, writeSeed, withMockError } from "../../helpers";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withMockError(() => {
    const users = readSeed<Array<{ id: string }>>("users.json");
    const user = users.find((u: { id: string }) => u.id === params.id);

    if (!user) {
      return NextResponse.json(
        { data: null, status: "error", error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: user, status: "success" });
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withMockError(() => {
    const users = readSeed<
      Array<{ id: string; email: string; firstName: string; lastName: string; organizationId: string | null; roles: string[]; kycStatus: string; createdAt: string; updatedAt: string }>
    >("users.json");
    const userIndex = users.findIndex(
      (u: { id: string }) => u.id === params.id
    );

    if (userIndex === -1) {
      return NextResponse.json(
        { data: null, status: "error", error: "User not found" },
        { status: 404 }
      );
    }

    // Soft delete: clear organization and roles, mark as deactivated
    const user = users[userIndex];
    user.organizationId = null;
    user.roles = [];
    user.kycStatus = "REJECTED";
    writeSeed("users.json", users);

    return NextResponse.json({ data: { id: params.id }, status: "success" });
  });
}
