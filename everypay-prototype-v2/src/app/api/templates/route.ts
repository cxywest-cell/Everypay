import { NextRequest, NextResponse } from "next/server";
import { readSeed, writeSeed, withMockError } from "../helpers";
import type { InvoiceTemplate } from "@/lib/types";

export async function GET(request: NextRequest) {
  return withMockError(() => {
    const templates = readSeed<Array<InvoiceTemplate>>("invoice_templates.json");
    const searchParams = request.nextUrl.searchParams;
    const sellerId = searchParams.get("sellerId");
    const buyerId = searchParams.get("buyerId");

    let filtered = templates;
    if (sellerId) {
      filtered = filtered.filter((t: InvoiceTemplate) => t.sellerId === sellerId);
    }
    if (buyerId) {
      filtered = filtered.filter(
        (t: InvoiceTemplate) => t.defaultForBuyerId === buyerId
      );
    }

    return NextResponse.json({ data: filtered, status: "success" });
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    sellerId: string;
    name: string;
    lineItems: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      currency: string;
    }>;
    contractReference?: string;
    paymentTerms?: string;
    defaultForBuyerId?: string;
  };

  return withMockError(() => {
    const templates = readSeed<Array<InvoiceTemplate>>("invoice_templates.json");
    const now = new Date().toISOString();

    const newTemplate: InvoiceTemplate = {
      id: `tpl-${Date.now()}`,
      sellerId: body.sellerId,
      name: body.name,
      version: 1,
      lineItems: body.lineItems.map((item, i) => ({
        id: `tpl-li-${Date.now()}-${i}`,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        currency: item.currency,
      })),
      contractReference: body.contractReference || null,
      paymentTerms: body.paymentTerms || null,
      defaultForBuyerId: body.defaultForBuyerId || null,
      createdAt: new Date(now),
      updatedAt: new Date(now),
      supersededBy: null,
    };

    templates.push(newTemplate);
    writeSeed("invoice_templates.json", templates);

    return NextResponse.json({ data: newTemplate, status: "success" }, { status: 201 });
  });
}

export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as {
    templateId: string;
    updates?: Partial<InvoiceTemplate>;
    action?: "set_default";
    buyerId?: string;
  };

  return withMockError(() => {
    const templates = readSeed<Array<InvoiceTemplate>>("invoice_templates.json");
    const templateIndex = templates.findIndex(
      (t: InvoiceTemplate) => t.id === body.templateId
    );

    if (templateIndex === -1) {
      return NextResponse.json(
        { data: null, status: "error", error: "Template not found" },
        { status: 404 }
      );
    }

    const template = templates[templateIndex];

    if (body.action === "set_default" && body.buyerId) {
      template.defaultForBuyerId = body.buyerId;
    }

    if (body.updates) {
      // Version the template (FR63)
      template.supersededBy = `tpl-${Date.now()}-v${template.version + 1}`;

      const newTemplate: InvoiceTemplate = {
        ...template,
        id: `tpl-${Date.now()}`,
        version: template.version + 1,
        updatedAt: new Date(),
        createdAt: new Date(),
        supersededBy: null,
        ...body.updates,
      };

      templates[templateIndex] = template;
      templates.push(newTemplate);
    }

    writeSeed("invoice_templates.json", templates);
    return NextResponse.json({ data: template, status: "success" });
  });
}
