import { NextRequest, NextResponse } from "next/server";
import { readSeed, writeSeed, withMockError } from "../helpers";
import type { Invoice } from "@/lib/types";
import { InvoiceStatus } from "@/lib/types";

export async function GET(request: NextRequest) {
  return withMockError(() => {
    const invoices = readSeed<Array<Invoice>>("invoices.json");
    const searchParams = request.nextUrl.searchParams;
    const sellerId = searchParams.get("sellerId");
    const buyerId = searchParams.get("buyerId");

    let filtered = invoices;
    if (sellerId) {
      filtered = filtered.filter((i: Invoice) => i.sellerId === sellerId);
    }
    if (buyerId) {
      filtered = filtered.filter((i: Invoice) => i.buyerId === buyerId);
    }

    return NextResponse.json({ data: filtered, status: "success" });
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    sellerId: string;
    buyerId: string;
    lineItems: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      currency: string;
    }>;
    contractDocumentUrl?: string;
    currency?: string;
    dueDate?: string;
    templateId?: string;
    action?: "save_draft" | "send";
  };

  return withMockError(() => {
    const invoices = readSeed<Array<Invoice>>("invoices.json");

    const totalAmount = body.lineItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    const now = new Date().toISOString();
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      sellerId: body.sellerId,
      buyerId: body.buyerId,
      status: body.action === "send" ? InvoiceStatus.SENT : InvoiceStatus.DRAFT,
      lineItems: body.lineItems.map((item, i) => ({
        id: `li-${Date.now()}-${i}`,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        currency: item.currency,
      })),
      contractDocumentUrl: body.contractDocumentUrl || null,
      totalAmount,
      currency: body.currency || "USD",
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      templateId: body.templateId || null,
      templateVersion: null,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };

    invoices.push(newInvoice);
    writeSeed("invoices.json", invoices);

    return NextResponse.json({ data: newInvoice, status: "success" }, { status: 201 });
  });
}
