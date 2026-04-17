"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Counterparty = {
  id: string;
  companyId: string;
  companyName: string;
  role: string;
  totalSettlements: number;
  totalVolume: number;
  settlementSuccessRate: number;
  averageDeliveryTimeDays: number;
  disputeRate: number;
  lastInteractionAt: string;
  kycStatus: string;
  trustScore: number;
  corridors: string[];
};

export default function CounterpartiesPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-2";
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "buyer" | "seller">("all");

  useEffect(() => {
    // Mock data with trust indicators
    setCounterparties([
      {
        id: "cp-wei",
        companyId: "org-alpha",
        companyName: "Wei Zhang Trading Co.",
        role: "seller",
        totalSettlements: 47,
        totalVolume: 12500000,
        settlementSuccessRate: 99.2,
        averageDeliveryTimeDays: 12,
        disputeRate: 0.5,
        lastInteractionAt: "2026-04-14T10:00:00Z",
        kycStatus: "VERIFIED",
        trustScore: 92,
        corridors: ["BRL → USD"],
      },
      {
        id: "cp-carlos",
        companyId: "org-beta",
        companyName: "Carlos Silva Imports",
        role: "buyer",
        totalSettlements: 23,
        totalVolume: 5800000,
        settlementSuccessRate: 95.7,
        averageDeliveryTimeDays: 14,
        disputeRate: 2.1,
        lastInteractionAt: "2026-04-13T15:30:00Z",
        kycStatus: "VERIFIED",
        trustScore: 87,
        corridors: ["BRL → USD"],
      },
      {
        id: "cp-li",
        companyId: "org-gamma",
        companyName: "Li Ming Electronics",
        role: "seller",
        totalSettlements: 8,
        totalVolume: 1200000,
        settlementSuccessRate: 87.5,
        averageDeliveryTimeDays: 18,
        disputeRate: 8.3,
        lastInteractionAt: "2026-04-10T08:00:00Z",
        kycStatus: "DOCUMENTS_UNDER_REVIEW",
        trustScore: 64,
        corridors: ["ARS → HKD"],
      },
    ]);
    setLoading(false);
  }, []);

  const filtered = filter === "all" ? counterparties : counterparties.filter((c) => c.role === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(["all", "buyer", "seller"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
              filter === f
                ? "bg-everypay-100 text-everypay-800 border-everypay-300"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {f === "all" ? "All" : f === "buyer" ? "Buyers" : "Sellers"}
          </button>
        ))}
      </div>

      {/* Counterparty cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 py-16 text-center">
          <h3 className="text-sm font-medium text-gray-900">No counterparties</h3>
          <p className="mt-1 text-sm text-gray-500">Trading partners will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((cp) => {
            const isRisky = cp.trustScore < 75;
            const trustColor = cp.trustScore >= 90 ? "text-green-600" : cp.trustScore >= 75 ? "text-amber-600" : "text-red-600";
            const trustBg = cp.trustScore >= 90 ? "bg-green-100 text-green-800" : cp.trustScore >= 75 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800";

            return (
              <Link
                key={cp.id}
                href={`/counterparties/${cp.id}?userId=${userId}`}
                className="block bg-white rounded-lg shadow border border-gray-200 p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{cp.companyName}</h3>
                    <p className="text-xs text-gray-500">
                      {cp.id} &middot; {cp.role} &middot; Last: {new Date(cp.lastInteractionAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Trust score badge */}
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${trustBg}`}>
                      Trust: {cp.trustScore}%
                    </span>
                    {isRisky && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        High Risk
                      </span>
                    )}
                  </div>
                </div>

                {/* Trust indicators inline */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Settlements</p>
                    <p className="font-mono font-medium">{cp.totalSettlements}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Volume</p>
                    <p className="font-mono font-medium">${(cp.totalVolume / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Success Rate</p>
                    <p className={`font-mono font-medium ${cp.settlementSuccessRate >= 95 ? "text-green-600" : "text-red-600"}`}>
                      {cp.settlementSuccessRate.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Dispute Rate</p>
                    <p className={`font-mono font-medium ${cp.disputeRate > 5 ? "text-red-600" : "text-gray-900"}`}>
                      {cp.disputeRate.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Corridors</p>
                    <p className="text-xs text-gray-900">{cp.corridors.join(", ")}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
