import { NextRequest, NextResponse } from "next/server";
import { readSeed, writeSeed, withMockError } from "../helpers";
import type { Procurement } from "@/lib/types";
import { ProcurementStatus } from "@/lib/types";

export async function GET(request: NextRequest) {
  return withMockError(() => {
    const procurements = readSeed<Array<Procurement>>("procurements.json");
    const searchParams = request.nextUrl.searchParams;
    const sellerId = searchParams.get("sellerId");
    const buyerId = searchParams.get("buyerId");

    let filtered = procurements;
    if (sellerId) {
      filtered = filtered.filter((p: Procurement) => p.sellerId === sellerId);
    }
    if (buyerId) {
      filtered = filtered.filter((p: Procurement) => p.buyerId === buyerId);
    }

    return NextResponse.json({ data: filtered, status: "success" });
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    buyerId: string;
    sellerId: string;
    lineItems: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      currency: string;
      hsCode?: string | null;
      specs?: string | null;
    }>;
    corridor?: string;
    currency?: string;
    dueDate?: string;
    notes?: string | null;
    action?: "save_draft" | "send";
  };

  return withMockError(() => {
    const procurements = readSeed<Array<Procurement>>("procurements.json");

    const totalAmount = body.lineItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    const now = new Date().toISOString();
    const newProcurement: Procurement = {
      id: `po-${Date.now()}`,
      buyerId: body.buyerId,
      sellerId: body.sellerId,
      status: body.action === "send" ? ProcurementStatus.SENT_TO_SELLER : ProcurementStatus.DRAFT,
      corridor: body.corridor || "BRL",
      lineItems: body.lineItems.map((item, i) => ({
        id: `li-${Date.now()}-${i}`,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        currency: item.currency,
        hsCode: item.hsCode || null,
        specs: item.specs || null,
      })),
      totalAmount,
      currency: body.currency || "USD",
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      notes: body.notes || null,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };

    procurements.push(newProcurement);
    writeSeed("procurements.json", procurements);

    return NextResponse.json({ data: newProcurement, status: "success" }, { status: 201 });
  });
}
