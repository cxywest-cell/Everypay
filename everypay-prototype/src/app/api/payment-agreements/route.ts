import { NextRequest, NextResponse } from "next/server";
import { readSeed, writeSeed, withMockError } from "../helpers";

export async function GET() {
  return withMockError(() => {
    const agreements = readSeed<Array<Record<string, unknown>>>("payment_agreements.json");
    return NextResponse.json({ data: agreements, status: "success" });
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    invoiceId: string;
    sellerId: string;
    buyerId: string;
    proposedRate: number;
    feeBreakdown?: {
      fxFee: number;
      platformFee: number;
      corridorFee: number;
      totalFees: number;
    };
  };

  return withMockError(() => {
    const marketRate = 5.18; // mock market rate
    const deviation = Math.abs(body.proposedRate - marketRate) / marketRate;

    if (deviation > 0.05) {
      return NextResponse.json(
        {
          data: null,
          status: "error",
          error: "Proposed rate exceeds 5% deviation from market rate",
        },
        { status: 400 }
      );
    }

    const agreements = readSeed<Array<Record<string, unknown>>>("payment_agreements.json");

    const now = new Date().toISOString();
    const expiresAt = new Date(new Date(now).getTime() + 48 * 60 * 60 * 1000).toISOString(); // 48h

    const newAgreement = {
      id: `tpa-${Date.now()}`,
      invoiceId: body.invoiceId,
      sellerId: body.sellerId,
      buyerId: body.buyerId,
      status: "PROPOSED",
      rateMethod: "PRELOCK",
      proposedRate: body.proposedRate,
      marketRate,
      feeBreakdown: body.feeBreakdown || {
        fxFee: Math.round(body.proposedRate * body.proposedRate * 0.01 * 100) / 100,
        platformFee: Math.round(body.proposedRate * body.proposedRate * 0.005 * 100) / 100,
        corridorFee: Math.round(body.proposedRate * body.proposedRate * 0.003 * 100) / 100,
        totalFees: 0,
      },
      createdAt: new Date(now),
      updatedAt: new Date(now),
      expiresAt: new Date(expiresAt),
    };

    // Calculate total fees if not provided
    if (!body.feeBreakdown) {
      const fb = newAgreement.feeBreakdown;
      fb.totalFees = fb.fxFee + fb.platformFee + fb.corridorFee;
    }

    agreements.push(newAgreement);
    writeSeed("payment_agreements.json", agreements);

    return NextResponse.json({ data: newAgreement, status: "success" }, { status: 201 });
  });
}
