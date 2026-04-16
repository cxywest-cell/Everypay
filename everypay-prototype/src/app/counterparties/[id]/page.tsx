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

export default function CounterpartyDetailPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const [counterparty, setCounterparty] = useState<Counterparty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/counterparties")
      .then((res) => res.json())
      .then((result) => {
        if (result.data) {
          const cp = (result.data as Counterparty[]).find((c) => c.id === params.id);
          setCounterparty(cp || null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  if (!counterparty) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">Counterparty not found</h2>
          <Link href="/counterparties" className="mt-4 inline-block text-everypay-600 hover:text-everypay-900 text-sm">
            &larr; Back to Counterparties
          </Link>
        </div>
      </div>
    );
  }

  const isRisky = counterparty.settlementSuccessRate < 95;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{counterparty.companyName}</h1>
            <p className="text-sm text-gray-500">
              {counterparty.role} &middot; {counterparty.id}
            </p>
          </div>
          <Link href="/counterparties" className="text-sm text-gray-500 hover:text-gray-700">
            &larr; Back
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isRisky && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-red-800">
              Risk Indicator: Settlement success rate below 95%
            </p>
            <p className="text-xs text-red-600 mt-1">
              {counterparty.totalSettlements - Math.round(counterparty.totalSettlements * counterparty.settlementSuccessRate / 100)} failed settlements in history
            </p>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Trust Indicators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-gray-500">Total Settlements</p>
              <p className="text-2xl font-mono font-bold text-gray-900">{counterparty.totalSettlements}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Volume</p>
              <p className="text-2xl font-mono font-bold text-gray-900">${(counterparty.totalVolume / 1000000).toFixed(1)}M</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Success Rate</p>
              <p className={`text-2xl font-mono font-bold ${isRisky ? "text-red-600" : "text-green-600"}`}>
                {counterparty.settlementSuccessRate.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Avg Delivery</p>
              <p className="text-2xl font-mono font-bold text-gray-900">{counterparty.averageDeliveryTimeDays}d</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Dispute Rate</p>
                <p className={`font-mono font-medium ${counterparty.disputeRate > 5 ? "text-red-600" : "text-gray-900"}`}>
                  {counterparty.disputeRate.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Interaction</p>
                <p className="text-sm text-gray-900">{new Date(counterparty.lastInteractionAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interaction History */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-3">Interaction History</h2>
          <div className="space-y-3">
            {[
              { date: "2026-04-14", event: "Settlement stl-2 completed", type: "success" },
              { date: "2026-04-12", event: "Payment agreement tpa-1 created", type: "info" },
              { date: "2026-04-10", event: "Invoice inv-1 sent", type: "info" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <span className={`w-2 h-2 rounded-full ${item.type === "success" ? "bg-green-500" : "bg-blue-500"}`} />
                  <span className="text-sm text-gray-900">{item.event}</span>
                </div>
                <span className="text-xs text-gray-400">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
