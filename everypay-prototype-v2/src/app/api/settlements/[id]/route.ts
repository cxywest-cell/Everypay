import { NextRequest, NextResponse } from "next/server";
import { readSeed, writeSeed, withMockError } from "../../helpers";
import type { Settlement } from "@/lib/types";
import { SettlementStatus } from "@/lib/types";

const LEG_STATUS_SEQUENCE: SettlementStatus[] = [
  SettlementStatus.INITIATED,
  SettlementStatus.FIAT_RECEIVED,
  SettlementStatus.USDT_CONFIRMED,
  SettlementStatus.FIAT_TO_USDT_COMPLETE,
  SettlementStatus.USDT_TO_FIAT_IN_PROGRESS,
  SettlementStatus.FIAT_CONVERSION_CONFIRMED,
  SettlementStatus.USD_HKD_READY,
  SettlementStatus.TRANSFER_IN_PROGRESS,
  SettlementStatus.TRANSFERRED,
  SettlementStatus.SETTLED_PENDING_CONFIRMATION,
  SettlementStatus.SETTLED,
];

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withMockError(() => {
    const settlements = readSeed<Array<Settlement>>("settlements.json");
    const settlement = settlements.find((s: Settlement) => s.id === params.id);

    if (!settlement) {
      return NextResponse.json(
        { data: null, status: "error", error: "Settlement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: settlement, status: "success" });
  });
}

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withMockError(() => {
    const settlements = readSeed<Array<Settlement>>("settlements.json");
    const settlementIndex = settlements.findIndex((s: Settlement) => s.id === params.id);

    if (settlementIndex === -1) {
      return NextResponse.json(
        { data: null, status: "error", error: "Settlement not found" },
        { status: 404 }
      );
    }

    const settlement = settlements[settlementIndex];

    // Advance the first leg that isn't SETTLED
    for (let i = 0; i < settlement.legs.length; i++) {
      const leg = settlement.legs[i];
      if (leg.status !== SettlementStatus.SETTLED) {
        const currentIdx = LEG_STATUS_SEQUENCE.indexOf(leg.status as SettlementStatus);
        if (currentIdx < LEG_STATUS_SEQUENCE.length - 1) {
          leg.status = LEG_STATUS_SEQUENCE[currentIdx + 1];
          leg.timestamp = new Date();
        }
        break;
      }
    }

    // Update overall settlement status
    const allLegsSettled = settlement.legs.every((l) => l.status === SettlementStatus.SETTLED);
    if (allLegsSettled) {
      settlement.status = SettlementStatus.SETTLED;
      settlement.completedAt = new Date();
    } else {
      // Set status to the most advanced leg status
      const statuses = settlement.legs.map((l) => l.status);
      const maxIdx = Math.max(...statuses.map((s) => LEG_STATUS_SEQUENCE.indexOf(s as SettlementStatus)));
      settlement.status = LEG_STATUS_SEQUENCE[maxIdx];
    }

    settlement.updatedAt = new Date();
    writeSeed("settlements.json", settlements);

    return NextResponse.json({ data: settlement, status: "success" });
  });
}
