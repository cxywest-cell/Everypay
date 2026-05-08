import { NextRequest, NextResponse } from "next/server";
import { readSeed, writeSeed, withMockError } from "../../helpers";
import type { RateLock } from "@/lib/types";
import { RateLockStatus } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: { settlementId: string } }
) {
  return withMockError(() => {
    const rateLocks = readSeed<Array<RateLock>>("rate_locks.json");
    const rateLock = rateLocks.find(
      (rl: RateLock) => rl.settlementId === params.settlementId
    );

    return NextResponse.json({ data: rateLock || null, status: "success" });
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { settlementId: string } }
) {
  const body = (await request.json()) as {
    invoiceId: string;
    lockedRate: number;
    marketRateAtLock: number;
  };

  return withMockError(() => {
    const rateLocks = readSeed<Array<RateLock>>("rate_locks.json");
    const now = new Date().toISOString();
    const expiryAt = new Date(new Date(now).getTime() + 48 * 60 * 60 * 1000).toISOString();

    const newRateLock: RateLock = {
      id: `rl-${Date.now()}`,
      settlementId: params.settlementId,
      invoiceId: body.invoiceId,
      status: RateLockStatus.LOCKED,
      lockedRate: body.lockedRate,
      marketRateAtLock: body.marketRateAtLock,
      expiryAt: new Date(expiryAt),
      createdAt: new Date(now),
    };

    rateLocks.push(newRateLock);
    writeSeed("rate_locks.json", rateLocks);

    return NextResponse.json({ data: newRateLock, status: "success" }, { status: 201 });
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { settlementId: string } }
) {
  const body = (await request.json()) as {
    action: "check_expiry";
  };

  return withMockError(() => {
    const rateLocks = readSeed<Array<RateLock>>("rate_locks.json");
    const rateLockIndex = rateLocks.findIndex(
      (rl: RateLock) => rl.settlementId === params.settlementId
    );

    if (rateLockIndex === -1) {
      return NextResponse.json({ data: null, status: "error", error: "Rate lock not found" }, { status: 404 });
    }

    const rateLock = rateLocks[rateLockIndex];
    const now = new Date();
    const expiryAt = new Date(rateLock.expiryAt);
    const hoursRemaining = (expiryAt.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursRemaining <= 0 && rateLock.status !== RateLockStatus.EXPIRED) {
      rateLock.status = RateLockStatus.EXPIRED;
      writeSeed("rate_locks.json", rateLocks);
    }

    const displayState = hoursRemaining <= 0
      ? { state: "EXPIRED", hoursRemaining: 0, isWarning: false }
      : hoursRemaining <= 4
        ? { state: "WARNING", hoursRemaining: Math.round(hoursRemaining), isWarning: true }
        : { state: "ACTIVE", hoursRemaining: Math.round(hoursRemaining), isWarning: false };

    return NextResponse.json({
      data: { ...rateLock, ...displayState },
      status: "success",
    });
  });
}
