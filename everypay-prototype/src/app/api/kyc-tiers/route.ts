import { NextRequest, NextResponse } from "next/server";
import { readSeed, writeSeed, withMockError } from "../helpers";
import type { KycTierConfig } from "@/lib/kycTierTypes";

export async function GET() {
  return withMockError(() => {
    const configs = readSeed<Array<KycTierConfig>>("kyc_tier_configs.json");
    return NextResponse.json({ data: configs, status: "success" });
  });
}

export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as {
    tier: string;
    maxTransactionAmount?: number;
    maxMonthlyVolume?: number;
  };

  return withMockError(() => {
    const configs = readSeed<Array<KycTierConfig>>("kyc_tier_configs.json");
    const config = configs.find((c: KycTierConfig) => c.tier === body.tier);

    if (!config) {
      return NextResponse.json(
        { data: null, status: "error", error: "Tier not found" },
        { status: 404 }
      );
    }

    if (body.maxTransactionAmount !== undefined) {
      config.maxTransactionAmount = body.maxTransactionAmount;
    }
    if (body.maxMonthlyVolume !== undefined) {
      config.maxMonthlyVolume = body.maxMonthlyVolume;
    }

    writeSeed("kyc_tier_configs.json", configs);

    return NextResponse.json({ data: config, status: "success" });
  });
}
