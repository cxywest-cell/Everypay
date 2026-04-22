import { NextRequest, NextResponse } from "next/server";
import { readSeed, withMockError } from "../../helpers";

export async function GET(request: NextRequest) {
  return withMockError(() => {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ data: [], status: "error", error: "userId is required" }, { status: 400 });
    }

    const agreements = readSeed<Array<Record<string, unknown>>>("payment_agreements.json");
    const chains = readSeed<Array<Record<string, unknown>>>("approval_chains.json");
    const users = readSeed<Array<Record<string, unknown>>>("users.json");
    const procurements = readSeed<Array<Record<string, unknown>>>("procurements.json");

    // Find agreements that need approval (PROPOSED or COUNTER_PROPOSED)
    // OR are sent to a party for their response (SENT_TO_BUYER, SENT_TO_SELLER)
    const pendingAgreements = agreements.filter(
      (a: Record<string, unknown>) =>
        a.status === "PROPOSED" ||
        a.status === "COUNTER_PROPOSED" ||
        a.status === "SENT_TO_BUYER" ||
        a.status === "SENT_TO_SELLER"
    );

    const queue: Array<Record<string, unknown>> = [];

    for (const agreement of pendingAgreements) {
      const procurementId = agreement.procurementId as string;
      const procurement = procurements.find((p: Record<string, unknown>) => p.id === procurementId);
      if (!procurement) continue;

      const totalAmount = (procurement.totalAmount as number) || 0;
      const status = agreement.status as string;

      // Determine proposer's side and organization
      const lastProposal = (agreement.proposalHistory as Array<Record<string, unknown>> | undefined)?.slice(-1)[0];
      const proposerSide = lastProposal?.proposer as string | undefined || "seller";
      const proposerUserId = proposerSide === "seller" ? (agreement.sellerId as string) : (agreement.buyerId as string);

      const roundNum = (agreement.proposalHistory as Array<Record<string, unknown>> | undefined)?.length || 1;
      const counterpartyUserId = proposerSide === "seller" ? (agreement.buyerId as string) : (agreement.sellerId as string);
      const counterpartyUser = users.find((u: Record<string, unknown>) => u.id === counterpartyUserId);
      const counterpartyName = counterpartyUser
        ? `${counterpartyUser.firstName} ${counterpartyUser.lastName} (${proposerSide === "seller" ? "buyer" : "seller"})`
        : `${counterpartyUserId} (${proposerSide === "seller" ? "buyer" : "seller"})`;

      const riskLevel = (agreement.proposedRate as number) > 5.25 ? "red" : (agreement.proposedRate as number) > 5.20 ? "yellow" : "green";

      const baseTask = {
        type: status === "COUNTER_PROPOSED" ? "counter_approval" : "terms_approval",
        counterparty: counterpartyName,
        amount: totalAmount,
        currency: procurement.currency || "USD",
        riskLevel,
        submittedBy: proposerUserId,
        submittedAt: agreement.updatedAt,
        round: roundNum,
        workflowStep: "awaiting_approval",
        riskNotes: [
          `Rate: ${(agreement.proposedRate as number).toFixed(2)} (market: 5.18, deviation: ${(((agreement.proposedRate as number) - 5.18) / 5.18 * 100).toFixed(1)}%)`,
          `Corridor: ${procurement.corridor || "BRL"}`,
          roundNum > 1 ? `Negotiation round ${roundNum}` : "Initial proposal",
        ],
        procurementId,
        agreementId: agreement.id,
        agreementStatus: agreement.status,
        proposedRate: agreement.proposedRate as number,
        marketRate: agreement.marketRate as number | undefined,
        feeBreakdown: agreement.feeBreakdown,
      };

      // Case 1: Internal approval needed (PROPOSED or COUNTER_PROPOSED)
      if (status === "PROPOSED" || status === "COUNTER_PROPOSED") {
        // Find proposer's org
        const proposerUser = users.find((u: Record<string, unknown>) => u.id === proposerUserId);
        if (!proposerUser) continue;
        const orgId = proposerUser.organizationId as string;

        // Find approval chain for this org
        const chain = chains.find((c: Record<string, unknown>) => c.organizationId === orgId);
        if (!chain) continue;

        // Check threshold: if amount < threshold, auto-approved (skip from queue)
        const threshold = chain.threshold as number;
        if (totalAmount < threshold) continue;

        // Check if the requesting user is an approver in this chain
        const approvers = (chain.approvers as Array<Record<string, unknown>>) || [];
        const isApprover = approvers.some((a: Record<string, unknown>) => a.userId === userId && a.status === "pending");
        if (!isApprover) continue;

        queue.push({
          id: `APR-${agreement.id}`,
          title: `Payment Terms — Round ${roundNum} (Internal Review)`,
          status: "pending",
          myAction: true,
          ...baseTask,
        });
      }

      // Case 2: Counterparty needs to respond (SENT_TO_BUYER or SENT_TO_SELLER)
      if (status === "SENT_TO_BUYER" || status === "SENT_TO_SELLER") {
        const targetUserId = status === "SENT_TO_BUYER" ? (agreement.buyerId as string) : (agreement.sellerId as string);
        if (userId !== targetUserId) continue;

        queue.push({
          id: `ACT-${agreement.id}`,
          title: `Payment Terms — Round ${roundNum} (Awaiting Your Response)`,
          status: "pending",
          myAction: true,
          ...baseTask,
        });
      }
    }

    return NextResponse.json({ data: queue, status: "success" });
  });
}
