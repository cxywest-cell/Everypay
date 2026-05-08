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
    procurementId: string;
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
    const procurements = readSeed<Array<Record<string, unknown>>>("procurements.json");
    const chains = readSeed<Array<Record<string, unknown>>>("approval_chains.json");
    const users = readSeed<Array<Record<string, unknown>>>("users.json");

    // Determine procurement amount and seller's org threshold for auto-acceptance
    const procurement = procurements.find((p: Record<string, unknown>) => p.id === body.procurementId);
    const totalAmount = (procurement?.totalAmount as number) || 0;

    // Find seller's approval chain threshold
    const sellerUser = users.find((u: Record<string, unknown>) => u.id === body.sellerId);
    const sellerOrgId = sellerUser?.organizationId as string | undefined;
    const sellerChain = sellerOrgId ? chains.find((c: Record<string, unknown>) => c.organizationId === sellerOrgId) : undefined;
    const threshold = (sellerChain?.threshold as number) || 10000;

    // If amount < threshold, auto-approve: skip PROPOSED, go straight to SENT_TO_BUYER
    const initialStatus = totalAmount < threshold ? "SENT_TO_BUYER" : "PROPOSED";

    const now = new Date().toISOString();
    const expiresAt = new Date(new Date(now).getTime() + 48 * 60 * 60 * 1000).toISOString(); // 48h

    const proposalEntry = {
      round: 1,
      proposer: "seller",
      rate: body.proposedRate,
      feeBreakdown: body.feeBreakdown || {
        fxFee: Math.round(body.proposedRate * body.proposedRate * 0.01 * 100) / 100,
        platformFee: Math.round(body.proposedRate * body.proposedRate * 0.005 * 100) / 100,
        corridorFee: Math.round(body.proposedRate * body.proposedRate * 0.003 * 100) / 100,
        totalFees: 0,
      },
      status: "proposed",
      timestamp: now,
      changes: [`Initial proposal based on ${body.procurementId} procurement terms`],
    };

    // Add auto-approval note if skipped
    if (initialStatus === "SENT_TO_BUYER") {
      proposalEntry.changes.push(`Auto-approved: amount $${totalAmount.toLocaleString()} below threshold $${threshold.toLocaleString()}`);
    }

    const feeBreakdown = body.feeBreakdown || {
      fxFee: Math.round(body.proposedRate * body.proposedRate * 0.01 * 100) / 100,
      platformFee: Math.round(body.proposedRate * body.proposedRate * 0.005 * 100) / 100,
      corridorFee: Math.round(body.proposedRate * body.proposedRate * 0.003 * 100) / 100,
      totalFees: 0,
    };

    // Calculate total fees if not provided
    if (!body.feeBreakdown) {
      feeBreakdown.totalFees = feeBreakdown.fxFee + feeBreakdown.platformFee + feeBreakdown.corridorFee;
    }

    const newAgreement = {
      id: `tpa-${Date.now()}`,
      procurementId: body.procurementId,
      sellerId: body.sellerId,
      buyerId: body.buyerId,
      status: initialStatus,
      rateMethod: "PRELOCK",
      proposedRate: body.proposedRate,
      marketRate,
      feeBreakdown,
      proposalHistory: [proposalEntry],
      createdAt: now,
      updatedAt: now,
      expiresAt,
    };

    agreements.push(newAgreement);
    writeSeed("payment_agreements.json", agreements);

    return NextResponse.json({ data: newAgreement, status: "success" }, { status: 201 });
  });
}
