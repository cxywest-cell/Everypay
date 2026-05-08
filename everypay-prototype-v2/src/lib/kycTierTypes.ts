export interface KycTierConfig {
  tier: "TIER_1" | "TIER_2" | "TIER_3";
  name: string;
  description: string;
  maxTransactionAmount: number; // max single transaction in USD
  maxMonthlyVolume: number; // max monthly volume in USD
  requiredDocuments: string[]; // what KYC docs are required
  kycStatusRequired: string; // minimum KYC status to qualify
}

export interface KycTierEvaluation {
  userId: string;
  currentTier: "TIER_1" | "TIER_2" | "TIER_3";
  requestedAmount: number;
  allowed: boolean;
  reason: string | null;
  requiredTier: "TIER_1" | "TIER_2" | "TIER_3" | null;
}
