import { NextRequest, NextResponse } from "next/server";
import { readSeed, writeSeed, withMockError } from "../../helpers";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withMockError(() => {
    const agreements = readSeed<Array<{ id: string; status: string; proposedRate: number; updatedAt: string }>>("payment_agreements.json");
    const agreement = agreements.find(
      (a: { id: string }) => a.id === params.id
    );

    if (!agreement) {
      return NextResponse.json(
        { data: null, status: "error", error: "Agreement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: agreement, status: "success" });
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = (await request.json()) as {
    action: "accept" | "counter" | "reject";
    newRate?: number;
    proposerRole?: "buyer" | "seller";
  };

  return withMockError(() => {
    const agreements = readSeed<Array<Record<string, unknown>>>("payment_agreements.json");
    const agreementIndex = agreements.findIndex(
      (a: { id: string }) => a.id === params.id
    );

    if (agreementIndex === -1) {
      return NextResponse.json(
        { data: null, status: "error", error: "Agreement not found" },
        { status: 404 }
      );
    }

    const agreement = agreements[agreementIndex];
    const history = (agreement.proposalHistory as Array<Record<string, unknown>>) || [];

    if (body.action === "accept") {
      agreement.status = "ACCEPTED";
      const lastRound = history.length > 0 ? history[history.length - 1] : null;
      history.push({
        round: (lastRound?.round || 0) + 1,
        proposer: lastRound?.proposer === "seller" ? "buyer" : "seller",
        rate: agreement.proposedRate,
        feeBreakdown: agreement.feeBreakdown,
        status: "accepted",
        timestamp: new Date().toISOString(),
        changes: ["Terms accepted"],
      });
    } else if (body.action === "counter") {
      if (!body.newRate) {
        return NextResponse.json(
          { data: null, status: "error", error: "New rate is required for counter-proposal" },
          { status: 400 }
        );
      }
      const prevRate = agreement.proposedRate as number;
      agreement.status = "COUNTER_PROPOSED";
      agreement.proposedRate = body.newRate;
      const roundNum = history.length + 1;
      const proposer = body.proposerRole || "buyer";
      history.push({
        round: roundNum,
        proposer,
        rate: body.newRate,
        feeBreakdown: agreement.feeBreakdown,
        status: "countered",
        timestamp: new Date().toISOString(),
        changes: [`Rate changed from ${prevRate.toFixed(2)} to ${body.newRate.toFixed(2)} (${((body.newRate - prevRate) / prevRate * 100).toFixed(2)}%)`],
      });
    } else if (body.action === "reject") {
      agreement.status = "REJECTED";
      const lastRound = history.length > 0 ? history[history.length - 1] : null;
      history.push({
        round: (lastRound?.round || 0) + 1,
        proposer: body.proposerRole || "buyer",
        rate: agreement.proposedRate,
        feeBreakdown: agreement.feeBreakdown,
        status: "rejected",
        timestamp: new Date().toISOString(),
        changes: ["Terms rejected"],
      });
    }

    agreement.proposalHistory = history;
    agreement.updatedAt = new Date().toISOString();
    writeSeed("payment_agreements.json", agreements);

    return NextResponse.json({ data: agreement, status: "success" });
  });
}
