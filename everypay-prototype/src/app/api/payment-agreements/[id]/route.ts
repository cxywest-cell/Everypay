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
    action: "accept" | "counter" | "reject" | "approve" | "reject_approval";
    newRate?: number;
    proposerRole?: "buyer" | "seller";
    comment?: string;
    userId?: string;
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
    const currentStatus = agreement.status as string;

    // ── Internal approval actions ──
    if (body.action === "approve") {
      if (currentStatus === "PROPOSED") {
        // Seller's team approved → sent to buyer
        agreement.status = "SENT_TO_BUYER";
      } else if (currentStatus === "COUNTER_PROPOSED") {
        // Buyer's team approved counter → sent to seller
        agreement.status = "SENT_TO_SELLER";
      } else {
        return NextResponse.json(
          { data: null, status: "error", error: `Cannot approve in status ${currentStatus}` },
          { status: 400 }
        );
      }
      const lastRound = history.length > 0 ? history[history.length - 1] : null;
      history.push({
        round: (lastRound?.round || 0) + 1,
        proposer: lastRound?.proposer || "seller",
        rate: agreement.proposedRate,
        feeBreakdown: agreement.feeBreakdown,
        status: "approved",
        timestamp: new Date().toISOString(),
        changes: [`Internally approved by ${body.userId || "approver"}`],
        approvedBy: body.userId || null,
        approvedAt: new Date().toISOString(),
        approvalComment: body.comment || null,
      });
    } else if (body.action === "reject_approval") {
      agreement.status = "REJECTED";
      const lastRound = history.length > 0 ? history[history.length - 1] : null;
      history.push({
        round: (lastRound?.round || 0) + 1,
        proposer: lastRound?.proposer || "seller",
        rate: agreement.proposedRate,
        feeBreakdown: agreement.feeBreakdown,
        status: "rejected",
        timestamp: new Date().toISOString(),
        changes: [`Internally rejected by ${body.userId || "approver"}: ${body.comment || "No reason given"}`],
        approvedBy: body.userId || null,
        approvedAt: new Date().toISOString(),
        approvalComment: body.comment || null,
      });
    }
    // ── Counterparty actions (accept / counter / reject) ──
    else if (body.action === "accept") {
      if (currentStatus !== "SENT_TO_BUYER" && currentStatus !== "SENT_TO_SELLER") {
        return NextResponse.json(
          { data: null, status: "error", error: `Cannot accept in status ${currentStatus}` },
          { status: 400 }
        );
      }
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
      if (currentStatus !== "SENT_TO_BUYER" && currentStatus !== "SENT_TO_SELLER") {
        return NextResponse.json(
          { data: null, status: "error", error: `Cannot counter in status ${currentStatus}` },
          { status: 400 }
        );
      }
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
      if (currentStatus !== "SENT_TO_BUYER" && currentStatus !== "SENT_TO_SELLER") {
        return NextResponse.json(
          { data: null, status: "error", error: `Cannot reject in status ${currentStatus}` },
          { status: 400 }
        );
      }
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
    } else {
      return NextResponse.json(
        { data: null, status: "error", error: `Unknown action: ${body.action}` },
        { status: 400 }
      );
    }

    agreement.proposalHistory = history;
    agreement.updatedAt = new Date().toISOString();
    writeSeed("payment_agreements.json", agreements);

    return NextResponse.json({ data: agreement, status: "success" });
  });
}
