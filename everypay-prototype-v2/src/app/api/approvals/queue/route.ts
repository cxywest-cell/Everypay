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
    const settlements = readSeed<Array<Record<string, unknown>>>("settlements.json");

    const queue: Array<Record<string, unknown>> = [];

    // ── 1. Payment Agreement tasks ──
    const pendingAgreements = agreements.filter(
      (a: Record<string, unknown>) =>
        a.status === "PROPOSED" ||
        a.status === "COUNTER_PROPOSED" ||
        a.status === "SENT_TO_BUYER" ||
        a.status === "SENT_TO_SELLER"
    );

    for (const agreement of pendingAgreements) {
      const procurementId = agreement.procurementId as string;
      const procurement = procurements.find((p: Record<string, unknown>) => p.id === procurementId);
      if (!procurement) continue;

      const totalAmount = (procurement.totalAmount as number) || 0;
      const status = agreement.status as string;
      const lastProposal = (agreement.proposalHistory as Array<Record<string, unknown>> | undefined)?.slice(-1)[0];
      const proposerSide = lastProposal?.proposer as string | undefined || "seller";
      const proposerUserId = proposerSide === "seller" ? (agreement.sellerId as string) : (agreement.buyerId as string);
      const roundNum = (agreement.proposalHistory as Array<Record<string, unknown>> | undefined)?.length || 1;
      const proposerUser = users.find((u: Record<string, unknown>) => u.id === proposerUserId);
      const proposerName = proposerUser ? `${proposerUser.firstName} ${proposerUser.lastName}` : proposerUserId;

      // Internal approval needed
      if (status === "PROPOSED" || status === "COUNTER_PROPOSED") {
        const orgId = proposerUser?.organizationId as string;
        if (!proposerUser) continue;
        const chain = chains.find((c: Record<string, unknown>) => c.organizationId === orgId && (c.type === "PAYMENT_TERMS" || !c.type));
        if (!chain) continue;
        const threshold = (chain.threshold as number) || 0;
        if (totalAmount < threshold) continue;
        const approvers = (chain.approvers as Array<Record<string, unknown>>) || [];
        const isApprover = approvers.some((a: Record<string, unknown>) => a.userId === userId && a.status === "pending");
        if (!isApprover) continue;

        queue.push({
          id: `APR-${agreement.id}`,
          type: "payment_agreement",
          title: `Payment Terms — Round ${roundNum} (Internal Review)`,
          description: `Review proposed payment terms for ${procurementId}`,
          status: "pending",
          proposer: proposerName,
          submittedAt: agreement.updatedAt,
          agreementId: agreement.id,
          agreementStatus: agreement.status,
        });
      }

      // Counterparty needs to respond
      if (status === "SENT_TO_BUYER" || status === "SENT_TO_SELLER") {
        const targetUserId = status === "SENT_TO_BUYER" ? (agreement.buyerId as string) : (agreement.sellerId as string);
        if (userId !== targetUserId) continue;

        queue.push({
          id: `ACT-${agreement.id}`,
          type: "payment_agreement",
          title: `Payment Terms — Round ${roundNum} (Awaiting Your Response)`,
          description: `Counterparty response needed for ${procurementId}`,
          status: "pending",
          proposer: proposerName,
          submittedAt: agreement.updatedAt,
          agreementId: agreement.id,
          agreementStatus: agreement.status,
        });
      }
    }

    // ── 2. Settlement tasks ──
    const activeSettlements = settlements.filter(
      (s: Record<string, unknown>) =>
        s.status !== "SETTLED" && s.status !== "FAILED" && s.status !== "DISPUTED"
    );

    for (const settlement of activeSettlements) {
      const buyerId = settlement.buyerId as string;
      const sellerId = settlement.sellerId as string;
      if (userId !== buyerId && userId !== sellerId) continue;

      const buyerUser = users.find((u: Record<string, unknown>) => u.id === buyerId);
      const buyerName = buyerUser ? `${buyerUser.firstName} ${buyerUser.lastName}` : buyerId;

      queue.push({
        id: `STL-${settlement.id}`,
        type: "settlement",
        title: `Settlement ${settlement.id}`,
        description: `${settlement.status}`,
        status: "pending",
        proposer: buyerName,
        submittedAt: settlement.createdAt,
        settlementId: settlement.id,
        agreementId: settlement.agreementId,
      });
    }

    // ── 3. Procurement & Sales tasks ──
    const activeProcurements = procurements.filter(
      (p: Record<string, unknown>) =>
        p.status !== "SETTLED" && p.status !== "DRAFT"
    );

    for (const procurement of activeProcurements) {
      const buyerId = procurement.buyerId as string;
      const sellerId = procurement.sellerId as string;
      if (userId !== buyerId && userId !== sellerId) continue;

      const isBuyer = userId === buyerId;
      const sellerUser = users.find((u: Record<string, unknown>) => u.id === sellerId);
      const buyerUser = users.find((u: Record<string, unknown>) => u.id === buyerId);
      const proposer = isBuyer ? (buyerUser ? `${buyerUser.firstName} ${buyerUser.lastName}` : buyerId) : (sellerUser ? `${sellerUser.firstName} ${sellerUser.lastName}` : sellerId);

      queue.push({
        id: `${isBuyer ? "PROC" : "SALE"}-${procurement.id}`,
        type: isBuyer ? "procurement" : "sale",
        title: procurement.lineItems?.[0]?.description || procurement.id,
        description: `${(procurement.lineItems as Array<Record<string, unknown>> | undefined)?.length || 0} item(s)`,
        status: "pending",
        proposer,
        submittedAt: procurement.updatedAt || procurement.createdAt,
        procurementId: procurement.id,
      });
    }

    queue.sort((a, b) => {
      const dateA = new Date(a.submittedAt as string).getTime();
      const dateB = new Date(b.submittedAt as string).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({ data: queue, status: "success" });
  });
}
