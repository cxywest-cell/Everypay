import { NextRequest, NextResponse } from "next/server";
import { readSeed, writeSeed, withMockError } from "../helpers";
import type { Settlement, RateLock } from "@/lib/types";
import { SettlementStatus, RateLockStatus } from "@/lib/types";

export async function GET(request: NextRequest) {
  return withMockError(() => {
    const settlements = readSeed<Array<Settlement>>("settlements.json");
    const searchParams = request.nextUrl.searchParams;
    const buyerId = searchParams.get("buyerId");
    const sellerId = searchParams.get("sellerId");

    let filtered = settlements;
    if (buyerId) {
      filtered = filtered.filter((s: Settlement) => s.buyerId === buyerId);
    }
    if (sellerId) {
      filtered = filtered.filter((s: Settlement) => s.sellerId === sellerId);
    }

    return NextResponse.json({ data: filtered, status: "success" });
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    agreementId: string;
    sellerId: string;
    buyerId: string;
    procurementId: string;
    lockedRate: number;
    corridor: string;
    settlementCurrency: string;
  };

  return withMockError(() => {
    const agreements = readSeed<Array<Record<string, unknown>>>("payment_agreements.json");
    const agreement = agreements.find((a: { id: string }) => a.id === body.agreementId);

    if (!agreement) {
      return NextResponse.json(
        { data: null, status: "error", error: "Agreement not found" },
        { status: 404 }
      );
    }

    if (agreement.status !== "ACCEPTED") {
      return NextResponse.json(
        { data: null, status: "error", error: "Agreement must be accepted before settlement" },
        { status: 400 }
      );
    }

    // Get procurement amount for realistic settlement values
    const procurements = readSeed<Array<Record<string, unknown>>>("procurements.json");
    const procurement = procurements.find((p: Record<string, unknown>) => p.id === body.procurementId);
    const fiatAmount = procurement ? (procurement.totalAmount as number) : 100000;

    const settlements = readSeed<Array<Settlement>>("settlements.json");
    const now = new Date().toISOString();

    const feeBreakdown = agreement.feeBreakdown as { totalFees: number } | undefined;
    const totalFees = feeBreakdown?.totalFees || Math.round(fiatAmount * 0.005 * 100) / 100;

    const usdtAmount = Math.round(fiatAmount / body.lockedRate * 100) / 100;
    const finalAmount = Math.round(usdtAmount * 0.998 * 100) / 100;

    const newSettlement: Settlement = {
      id: `stl-${Date.now()}`,
      buyerId: body.buyerId,
      sellerId: body.sellerId,
      agreementId: body.agreementId,
      status: SettlementStatus.INITIATED,
      corridor: body.corridor as import("@/lib/types").Corridor,
      settlementCurrency: body.settlementCurrency as import("@/lib/types").SettlementCurrency,
      lockedRate: body.lockedRate,
      fiatAmount,
      usdtAmount,
      finalAmount,
      legs: [
        {
          id: `leg-${Date.now()}-1`,
          settlementId: `stl-${Date.now()}`,
          legOrder: 1,
          status: SettlementStatus.INITIATED,
          amountFrom: fiatAmount,
          currencyFrom: body.corridor,
          amountTo: usdtAmount,
          currencyTo: "USDT",
          exchangeRate: body.lockedRate,
          fees: totalFees,
          timestamp: null,
          failureReason: null,
        },
        {
          id: `leg-${Date.now()}-2`,
          settlementId: `stl-${Date.now()}`,
          legOrder: 2,
          status: SettlementStatus.INITIATED,
          amountFrom: usdtAmount,
          currencyFrom: "USDT",
          amountTo: finalAmount,
          currencyTo: body.settlementCurrency,
          exchangeRate: 0.998,
          fees: Math.round(usdtAmount * 0.005 * 100) / 100,
          timestamp: null,
          failureReason: null,
        },
      ],
      createdAt: new Date(now),
      updatedAt: new Date(now),
      completedAt: null,
      disputeReason: null,
    };

    settlements.push(newSettlement);
    writeSeed("settlements.json", settlements);

    // Create rate lock record (Epic 3 / Story 3.1)
    const rateLocks = readSeed<Array<Record<string, unknown>>>("rate_locks.json");
    const expiryAt = new Date(new Date(now).getTime() + 48 * 60 * 60 * 1000).toISOString();
    const newRateLock = {
      id: `rl-${Date.now()}`,
      settlementId: newSettlement.id,
      procurementId: body.procurementId,
      status: RateLockStatus.LOCKED,
      lockedRate: body.lockedRate,
      marketRateAtLock: 5.18,
      expiryAt: new Date(expiryAt),
      createdAt: new Date(now),
    };
    rateLocks.push(newRateLock);
    writeSeed("rate_locks.json", rateLocks);

    // Update agreement status to reflect settlement initiated
    const allAgreements = readSeed<Array<Record<string, unknown>>>("payment_agreements.json");
    const agreementIndex = allAgreements.findIndex((a: Record<string, unknown>) => a.id === body.agreementId);
    if (agreementIndex !== -1) {
      allAgreements[agreementIndex].status = "ACCEPTED";
      writeSeed("payment_agreements.json", allAgreements);
    }

    return NextResponse.json({ data: newSettlement, status: "success" }, { status: 201 });
  });
}
