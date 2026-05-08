import { NextRequest, NextResponse } from "next/server";
import { readSeed, writeSeed, withMockError } from "../../helpers";
import type { Procurement } from "@/lib/types";
import { ProcurementStatus } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withMockError(() => {
    const procurements = readSeed<Array<Procurement>>("procurements.json");
    const procurement = procurements.find((p: Procurement) => p.id === params.id);

    if (!procurement) {
      return NextResponse.json(
        { data: null, status: "error", error: "Procurement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: procurement, status: "success" });
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = (await request.json()) as {
    action: "send" | "accept_terms" | "counter" | "confirm_receipt" | "report_non_receipt";
  };

  return withMockError(() => {
    const procurements = readSeed<Array<Procurement>>("procurements.json");
    const procurementIndex = procurements.findIndex((p: Procurement) => p.id === params.id);

    if (procurementIndex === -1) {
      return NextResponse.json(
        { data: null, status: "error", error: "Procurement not found" },
        { status: 404 }
      );
    }

    const transitions: Record<string, ProcurementStatus> = {
      send: ProcurementStatus.SENT_TO_SELLER,
      accept_terms: ProcurementStatus.TERMS_ACCEPTED,
      counter: ProcurementStatus.NEGOTIATING,
      confirm_receipt: ProcurementStatus.SETTLED,
      report_non_receipt: ProcurementStatus.DISPUTED,
    };

    const newStatus = transitions[body.action];
    if (newStatus) {
      procurements[procurementIndex].status = newStatus as ProcurementStatus;
    }

    procurements[procurementIndex].updatedAt = new Date();
    writeSeed("procurements.json", procurements);

    return NextResponse.json({ data: procurements[procurementIndex], status: "success" });
  });
}
