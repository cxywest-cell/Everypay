"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Settlement, SettlementLeg } from "@/lib/types";
import { SettlementStatus } from "@/lib/types";
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

interface RateLockInfo {
  id: string;
  settlementId: string;
  invoiceId: string;
  status: string;
  lockedRate: number;
  marketRateAtLock: number;
  expiryAt: Date;
  createdAt: Date;
  hoursRemaining?: number;
  state?: string;
  isWarning?: boolean;
}

export default function SettlementDetailPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const [settlement, setSettlement] = useState<Settlement | null>(null);
  const [rateLock, setRateLock] = useState<RateLockInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/settlements/${params.id}`).then((res) => res.json()),
      fetch(`/api/rate-locks/${params.id}`).then((res) => res.json()),
    ])
      .then(([settlementResult, rateLockResult]) => {
        if (settlementResult.data) setSettlement(settlementResult.data as Settlement);
        if (rateLockResult.data) setRateLock(rateLockResult.data as RateLockInfo);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleAdvance = async () => {
    setAdvancing(true);
    try {
      const res = await fetch(`/api/settlements/${params.id}`, {
        method: "POST",
      });
      const result = await res.json();
      if (result.status === "success" && result.data) {
        setSettlement(result.data as Settlement);
      }
    } catch {
      // Error handled silently
    } finally {
      setAdvancing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  if (!settlement) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">Settlement not found</h2>
          <Link href="/settlements" className="mt-4 inline-block text-everypay-600 hover:text-everypay-900 text-sm">
            &larr; Back to Settlements
          </Link>
        </div>
      </div>
    );
  }

  const complianceNotation = getCorridorComplianceNotation(settlement.corridor);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Settlement {settlement.id}</h1>
            <p className="text-sm text-gray-500">
              {settlement.corridor} &rarr; {settlement.settlementCurrency}
              {complianceNotation && <span className="ml-2 text-gray-400">({complianceNotation})</span>}
            </p>
          </div>
          <Link href="/settlements" className="text-sm text-gray-500 hover:text-gray-700">
            &larr; Back to Settlements
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[settlement.status]}`}>
              {settlement.status.replace(/_/g, " ")}
            </span>
            <span className="text-xs text-gray-500">
              Agreement: {settlement.agreementId}
            </span>
          </div>
        </div>

        {/* Rate Lock Info (Story 5.2/5.4) */}
        {rateLock && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-900">Rate Lock</h2>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                rateLock.state === "EXPIRED"
                  ? "bg-red-100 text-red-800"
                  : rateLock.isWarning
                    ? "bg-amber-100 text-amber-800"
                    : "bg-green-100 text-green-800"
              }`}>
                {rateLock.state || rateLock.status}
                {rateLock.hoursRemaining !== undefined && rateLock.hoursRemaining > 0 && (
                  <span className="ml-1">({rateLock.hoursRemaining}h remaining)</span>
                )}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500">Locked Rate</p>
                <p className="font-mono font-bold text-gray-900">{rateLock.lockedRate.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Market at Lock</p>
                <p className="font-mono text-gray-600">{rateLock.marketRateAtLock.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Expires</p>
                <p className="text-gray-900">{new Date(rateLock.expiryAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Amounts */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-900 mb-3">Amounts</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Fiat Amount</p>
              <p className="text-lg font-mono font-bold text-gray-900">
                {formatCorridorAmount(settlement.fiatAmount, settlement.corridor)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">USDT Amount</p>
              <p className="text-lg font-mono font-bold text-gray-900">
                {settlement.usdtAmount.toLocaleString()} USDT
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Final Amount</p>
              <p className="text-lg font-mono font-bold text-gray-900">
                {formatCorridorAmount(settlement.finalAmount, settlement.settlementCurrency)}
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
            Locked Rate: {settlement.lockedRate.toFixed(2)}
          </div>
        </div>

        {/* Legs */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Settlement Legs</h2>
          <div className="space-y-4">
            {settlement.legs.map((leg: SettlementLeg) => (
              <div key={leg.id} className="border border-gray-200 rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500 uppercase">Leg {leg.legOrder}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[leg.status]}`}>
                    {leg.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">From</p>
                    <p className="font-mono">
                      {formatCorridorAmount(leg.amountFrom, leg.currencyFrom)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">To</p>
                    <p className="font-mono">
                      {leg.currencyTo === "USDT"
                        ? `${leg.amountTo.toLocaleString()} USDT`
                        : formatCorridorAmount(leg.amountTo, leg.currencyTo)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Exchange Rate</p>
                    <p className="font-mono text-xs">{leg.exchangeRate.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fees</p>
                    <p className="font-mono text-xs">{leg.fees.toFixed(2)}</p>
                  </div>
                </div>
                {leg.timestamp && (
                  <p className="mt-2 text-xs text-gray-400">
                    Completed: {new Date(leg.timestamp).toLocaleString()}
                  </p>
                )}
                {leg.failureReason && (
                  <p className="mt-2 text-xs text-red-600">
                    Failure: {leg.failureReason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Documents (Story 4.5) */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-900 mb-3">Settlement Documents</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Invoice</span>
              <Link href={`/invoices/${rateLock?.invoiceId || ""}`} className="text-sm text-everypay-600 hover:text-everypay-900">
                View &rarr;
              </Link>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Payment Agreement</span>
              <Link href={`/payment-agreements/${settlement.agreementId}/review`} className="text-sm text-everypay-600 hover:text-everypay-900">
                View &rarr;
              </Link>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-400">Evidence Pack</span>
              <span className="text-xs text-gray-400">
                {settlement.status === SettlementStatus.SETTLED ? "Available" : "Available after settlement"}
              </span>
            </div>
          </div>
        </div>

        {/* Advance button */}
        {settlement.status !== SettlementStatus.SETTLED && settlement.status !== SettlementStatus.FAILED && (
          <div className="bg-everypay-50 border border-everypay-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-everypay-900 mb-1">Simulate Progress</h3>
            <p className="text-sm text-everypay-700 mb-3">
              Advance the settlement to the next stage (mock simulation).
            </p>
            <button
              onClick={handleAdvance}
              disabled={advancing}
              className="px-4 py-2 bg-everypay-600 text-white text-sm font-medium rounded-md hover:bg-everypay-700 disabled:opacity-50"
            >
              {advancing ? "Advancing..." : "Advance Stage"}
            </button>
          </div>
        )}

        {settlement.status === SettlementStatus.SETTLED && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <p className="text-sm font-medium text-green-800">
              Settlement completed on {new Date(settlement.completedAt!).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
