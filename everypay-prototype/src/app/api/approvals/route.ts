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
    chainId?: string;
    approverUserId?: string;
    action?: "approve" | "reject";
    comment?: string;
    threshold?: number;
    // Approver management
    addApproverUserId?: string;
    removeApproverUserId?: string;
    moveApproverUserId?: string;
    moveDirection?: "up" | "down";
  };

  return withMockError(() => {
    const chains = readSeed<ApprovalChain[]>("approval_chains.json");

    // Handle threshold update
    if (body.threshold !== undefined && body.chainId) {
      const chainIndex = chains.findIndex((c) => c.id === body.chainId);
      if (chainIndex === -1) {
        return NextResponse.json({ data: null, status: "error", error: "Approval chain not found" }, { status: 404 });
      }
      chains[chainIndex].threshold = body.threshold;
      chains[chainIndex].updatedAt = new Date().toISOString();
      writeSeed("approval_chains.json", chains);
      return NextResponse.json({ data: chains[chainIndex], status: "success" });
    }

    // Handle add approver
    if (body.addApproverUserId && body.chainId) {
      const chainIndex = chains.findIndex((c) => c.id === body.chainId);
      if (chainIndex === -1) {
        return NextResponse.json({ data: null, status: "error", error: "Approval chain not found" }, { status: 404 });
      }
      const chain = chains[chainIndex];
      const existing = chain.approvers.find((a) => a.userId === body.addApproverUserId);
      if (existing) {
        return NextResponse.json({ data: null, status: "error", error: "User already an approver" }, { status: 400 });
      }
      const maxOrder = chain.approvers.length > 0 ? Math.max(...chain.approvers.map((a) => a.order)) : 0;
      chain.approvers.push({
        userId: body.addApproverUserId,
        role: "APPROVER",
        order: maxOrder + 1,
        status: "pending",
        comment: null,
        timestamp: null,
      });
      chain.updatedAt = new Date().toISOString();
      writeSeed("approval_chains.json", chains);
      return NextResponse.json({ data: chain, status: "success" });
    }

    // Handle remove approver
    if (body.removeApproverUserId && body.chainId) {
      const chainIndex = chains.findIndex((c) => c.id === body.chainId);
      if (chainIndex === -1) {
        return NextResponse.json({ data: null, status: "error", error: "Approval chain not found" }, { status: 404 });
      }
      const chain = chains[chainIndex];
      chain.approvers = chain.approvers.filter((a) => a.userId !== body.removeApproverUserId);
      // Reorder
      chain.approvers.forEach((a, i) => { a.order = i + 1; });
      chain.updatedAt = new Date().toISOString();
      writeSeed("approval_chains.json", chains);
      return NextResponse.json({ data: chain, status: "success" });
    }

    // Handle move approver
    if (body.moveApproverUserId && body.moveDirection && body.chainId) {
      const chainIndex = chains.findIndex((c) => c.id === body.chainId);
      if (chainIndex === -1) {
        return NextResponse.json({ data: null, status: "error", error: "Approval chain not found" }, { status: 404 });
      }
      const chain = chains[chainIndex];
      const sorted = chain.approvers.sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((a) => a.userId === body.moveApproverUserId);
      if (idx === -1) return NextResponse.json({ data: null, status: "error", error: "Approver not found" }, { status: 404 });
      const swapIdx = body.moveDirection === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= sorted.length) {
        return NextResponse.json({ data: null, status: "error", error: "Cannot move further" }, { status: 400 });
      }
      // Swap orders
      const tempOrder = sorted[idx].order;
      sorted[idx].order = sorted[swapIdx].order;
      sorted[swapIdx].order = tempOrder;
      chain.updatedAt = new Date().toISOString();
      writeSeed("approval_chains.json", chains);
      return NextResponse.json({ data: chain, status: "success" });
    }

    // Handle approver action
    if (!body.chainId || !body.approverUserId || !body.action) {
      return NextResponse.json({ data: null, status: "error", error: "Missing required fields" }, { status: 400 });
    }

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
    chain.approvers[approverIndex].comment = body.comment || null;
    chain.approvers[approverIndex].timestamp = now;
    chain.updatedAt = now;

    writeSeed("approval_chains.json", chains);

    return NextResponse.json({ data: chain, status: "success" });
  });
}
