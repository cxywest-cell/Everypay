import { NextRequest, NextResponse } from "next/server";
import { readSeed, writeSeed, withMockError } from "../../helpers";
import type { Invoice } from "@/lib/types";
import { InvoiceStatus } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withMockError(() => {
    const invoices = readSeed<Array<Invoice>>("invoices.json");
    const invoice = invoices.find((i: Invoice) => i.id === params.id);

    if (!invoice) {
      return NextResponse.json(
        { data: null, status: "error", error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: invoice, status: "success" });
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = (await request.json()) as {
    action: "send" | "mark_paid" | "mark_overdue";
  };

  return withMockError(() => {
    const invoices = readSeed<Array<Invoice>>("invoices.json");
    const invoiceIndex = invoices.findIndex((i: Invoice) => i.id === params.id);

    if (invoiceIndex === -1) {
      return NextResponse.json(
        { data: null, status: "error", error: "Invoice not found" },
        { status: 404 }
      );
    }

    if (body.action === "send") {
      invoices[invoiceIndex].status = InvoiceStatus.SENT;
    } else if (body.action === "mark_paid") {
      invoices[invoiceIndex].status = InvoiceStatus.PAID;
    } else if (body.action === "mark_overdue") {
      invoices[invoiceIndex].status = InvoiceStatus.OVERDUE;
    }

    invoices[invoiceIndex].updatedAt = new Date();
    writeSeed("invoices.json", invoices);

    return NextResponse.json({ data: invoices[invoiceIndex], status: "success" });
  });
}
