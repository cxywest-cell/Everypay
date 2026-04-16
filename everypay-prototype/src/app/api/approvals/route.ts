import { NextRequest, NextResponse } from "next/server";
import { readSeed, writeSeed, withMockError } from "../helpers";

type ApprovalChain = {
  id: string;
  organizationId: string;
  threshold: number;
  approvers: Array<{
    userId: string;
    role: string;
    order: number;
    status: string;
    comment: string | null;
    timestamp: string | null;
  }>;
  createdAt: string;
  updatedAt: string;
};

export async function GET() {
  return withMockError(() => {
    const chains = readSeed<ApprovalChain[]>("approval_chains.json");
    return NextResponse.json({ data: chains, status: "success" });
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    organizationId: string;
    threshold: number;
    approvers: Array<{
      userId: string;
      role: string;
      order: number;
    }>;
  };

  return withMockError(() => {
    const chains = readSeed<ApprovalChain[]>("approval_chains.json");
    const now = new Date().toISOString();

    const newChain: ApprovalChain = {
      id: `ac-${Date.now()}`,
      organizationId: body.organizationId,
      threshold: body.threshold,
      approvers: body.approvers.map((a) => ({
        ...a,
        status: "pending",
        comment: null,
        timestamp: null,
      })),
      createdAt: now,
      updatedAt: now,
    };

    chains.push(newChain);
    writeSeed("approval_chains.json", chains);

    return NextResponse.json({ data: newChain, status: "success" }, { status: 201 });
  });
}

export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as {
    chainId: string;
    approverUserId: string;
    action: "approve" | "reject";
    comment: string;
  };

  return withMockError(() => {
    const chains = readSeed<ApprovalChain[]>("approval_chains.json");
    const chainIndex = chains.findIndex((c) => c.id === body.chainId);

    if (chainIndex === -1) {
      return NextResponse.json({ data: null, status: "error", error: "Approval chain not found" }, { status: 404 });
    }

    const chain = chains[chainIndex];
    const approverIndex = chain.approvers.findIndex((a) => a.userId === body.approverUserId && a.status === "pending");

    if (approverIndex === -1) {
      return NextResponse.json({ data: null, status: "error", error: "No pending approval found for this user" }, { status: 404 });
    }

    const now = new Date().toISOString();
    chain.approvers[approverIndex].status = body.action === "approve" ? "approved" : "rejected";
    chain.approvers[approverIndex].comment = body.comment;
    chain.approvers[approverIndex].timestamp = now;
    chain.updatedAt = now;

    writeSeed("approval_chains.json", chains);

    return NextResponse.json({ data: chain, status: "success" });
  });
}
