"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Settlement } from "@/lib/types";
import { formatCorridorAmount, getCorridorComplianceNotation } from "@/lib/corridorFormat";

const STATUS_COLORS: Record<string, string> = {
  INITIATED: "bg-gray-100 text-gray-800",
  FIAT_RECEIVED: "bg-blue-100 text-blue-800",
  USDT_CONFIRMED: "bg-blue-100 text-blue-800",
  FIAT_TO_USDT_COMPLETE: "bg-indigo-100 text-indigo-800",
  USDT_TO_FIAT_IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  FIAT_CONVERSION_CONFIRMED: "bg-green-100 text-green-800",
  USD_HKD_READY: "bg-green-100 text-green-800",
  TRANSFER_IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  TRANSFERRED: "bg-blue-100 text-blue-800",
  SETTLED_PENDING_CONFIRMATION: "bg-yellow-100 text-yellow-800",
  SETTLED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  DISPUTED: "bg-red-100 text-red-800",
};

export default function SettlementsPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/settlements?buyerId=${userId}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.data) setSettlements(result.data as Settlement[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {settlements.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 py-16 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No settlements</h3>
          <p className="mt-1 text-sm text-gray-500">Settlements will appear here once a payment agreement is accepted.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {settlements.map((settlement) => (
            <Link
              key={settlement.id}
              href={`/settlements/${settlement.id}?userId=${userId}`}
              className="block bg-white rounded-lg shadow border border-gray-200 p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{settlement.id}</h3>
                  <p className="text-xs text-gray-500">
                    Agreement: {settlement.agreementId} &middot; {settlement.corridor} &rarr; {settlement.settlementCurrency}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[settlement.status]}`}>
                  {settlement.status.replace(/_/g, " ")}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Fiat Amount</p>
                  <p className="font-mono font-medium">{formatCorridorAmount(settlement.fiatAmount, settlement.corridor)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">USDT Amount</p>
                  <p className="font-mono font-medium">{settlement.usdtAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Final Amount</p>
                  <p className="font-mono font-medium">{settlement.finalAmount.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Created {new Date(settlement.createdAt).toLocaleDateString()}
                {settlement.completedAt && ` &middot; Completed ${new Date(settlement.completedAt).toLocaleDateString()}`}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
