import { NextRequest, NextResponse } from "next/server";
import { readSeed, withMockError } from "../../helpers";
import type { KycTierConfig } from "@/lib/kycTierTypes";

type TierLevel = "TIER_1" | "TIER_2" | "TIER_3";

interface EvaluateResult {
  userId: string;
  currentTier: TierLevel;
  requestedAmount: number;
  allowed: boolean;
  reason: string | null;
  requiredTier: TierLevel | null;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    userId: string;
    amount: number;
    monthlyVolume?: number;
  };

  return withMockError(() => {
    const users = readSeed<
      Array<{ id: string; kycStatus: string }>
    >("users.json");
    const user = users.find((u: { id: string }) => u.id === body.userId);

    if (!user) {
      return NextResponse.json(
        { data: null, status: "error", error: "User not found" },
        { status: 404 }
      );
    }

    const configs = readSeed<Array<KycTierConfig>>("kyc_tier_configs.json");

    // Determine user's current tier based on KYC status
    let currentTier: "TIER_1" | "TIER_2" | "TIER_3" = "TIER_1";
    if (user.kycStatus === "VERIFIED") {
      currentTier = "TIER_2";
      // Mock: Tier 3 requires additional EDD flag (not in seed yet)
    }

    const currentTierConfig = configs.find(
      (c: KycTierConfig) => c.tier === currentTier
    )!;

    // Check if amount exceeds current tier limit
    if (body.amount > currentTierConfig.maxTransactionAmount) {
      // Find required tier
      let requiredTier: KycTierConfig | null = null;
      for (const c of configs) {
        if (body.amount <= c.maxTransactionAmount) {
          requiredTier = c;
          break;
        }
      }

      const response: EvaluateResult = {
        userId: body.userId,
        currentTier,
        requestedAmount: body.amount,
        allowed: false,
        reason: `Amount $${body.amount.toLocaleString()} exceeds ${currentTier} limit of $${currentTierConfig.maxTransactionAmount.toLocaleString()}`,
        requiredTier: (requiredTier?.tier as TierLevel) || null,
      };
      return NextResponse.json({ data: response, status: "success" });
    }

    // Check monthly volume
    if (body.monthlyVolume && body.monthlyVolume > currentTierConfig.maxMonthlyVolume) {
    const monthlyBlocked: EvaluateResult = {
      userId: body.userId,
      currentTier,
      requestedAmount: body.amount,
      allowed: false,
      reason: `Monthly volume $${body.monthlyVolume.toLocaleString()} exceeds ${currentTier} limit of $${currentTierConfig.maxMonthlyVolume.toLocaleString()}`,
      requiredTier: "TIER_3",
    };
    return NextResponse.json({ data: monthlyBlocked, status: "success" });
    }

    const allowed: EvaluateResult = {
      userId: body.userId,
      currentTier,
      requestedAmount: body.amount,
      allowed: true,
      reason: null,
      requiredTier: null,
    };
    return NextResponse.json({ data: allowed, status: "success" });
  });
}
