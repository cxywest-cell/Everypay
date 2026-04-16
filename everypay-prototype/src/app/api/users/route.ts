import { NextRequest, NextResponse } from "next/server";
import { readSeed, writeSeed, withMockError } from "../helpers";
import type { RegistrationRequest, User } from "@/lib/types";
import { KYCStatus } from "@/lib/types";

export async function GET() {
  return withMockError(() => {
    const users = readSeed<Array<Record<string, unknown>>>("users.json");
    return NextResponse.json({ data: users, status: "success" });
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as RegistrationRequest;

  return withMockError(() => {
    // Server-side validation
    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      return NextResponse.json(
        { data: null, status: "error", error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { data: null, status: "error", error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (body.password.length < 8) {
      return NextResponse.json(
        { data: null, status: "error", error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const users = readSeed<Array<User>>("users.json");

    // Check for duplicate email
    const existing = users.find(
      (u) => u.email.toLowerCase() === body.email.toLowerCase()
    );
    if (existing) {
      return NextResponse.json(
        { data: null, status: "error", error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      kycStatus: KYCStatus.PENDING,
      roles: [],
      organizationId: null,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };

    users.push(newUser);
    writeSeed("users.json", users);

    return NextResponse.json({ data: newUser, status: "success" }, { status: 201 });
  });
}
