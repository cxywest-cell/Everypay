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
};

export default function CounterpartiesPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-2";
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "buyer" | "seller">("all");

  useEffect(() => {
    fetch("/api/counterparties")
      .then((res) => res.json())
      .then((result) => {
        if (result.data) setCounterparties(result.data as Counterparty[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? counterparties : counterparties.filter((c) => c.role === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Counterparties</h1>
            <p className="text-sm text-gray-500">View trading partners with trust indicators</p>
          </div>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">&larr; Home</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex space-x-2 mb-6">
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
              const isRisky = cp.settlementSuccessRate < 95;
              return (
                <Link
                  key={cp.id}
                  href={`/counterparties/${cp.id}`}
                  className="block bg-white rounded-lg shadow border border-gray-200 p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{cp.companyName}</h3>
                      <p className="text-xs text-gray-500">
                        {cp.id} &middot; {cp.role} &middot; Last: {new Date(cp.lastInteractionAt).toLocaleDateString()}
                      </p>
                    </div>
                    {isRisky && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        High Risk
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
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
                      <p className={`font-mono font-medium ${isRisky ? "text-red-600" : "text-green-600"}`}>
                        {cp.settlementSuccessRate.toFixed(1)}%
                      </p>
                      {isRisky && (
                        <p className="text-xs text-red-500">Below 95% threshold</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Dispute Rate</p>
                      <p className="font-mono font-medium">{cp.disputeRate.toFixed(1)}%</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
