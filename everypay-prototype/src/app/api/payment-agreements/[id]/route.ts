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
  };

  return withMockError(() => {
    const agreements = readSeed<Array<{ id: string; status: string; proposedRate: number; updatedAt: string }>>("payment_agreements.json");
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

    if (body.action === "accept") {
      agreement.status = "ACCEPTED";
    } else if (body.action === "counter") {
      if (!body.newRate) {
        return NextResponse.json(
          { data: null, status: "error", error: "New rate is required for counter-proposal" },
          { status: 400 }
        );
      }
      agreement.status = "COUNTER_PROPOSED";
      agreement.proposedRate = body.newRate;
    } else if (body.action === "reject") {
      agreement.status = "REJECTED";
    }

    agreement.updatedAt = new Date().toISOString();
    writeSeed("payment_agreements.json", agreements);

    return NextResponse.json({ data: agreement, status: "success" });
  });
}
