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

export default function CounterpartyDetailPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const [counterparty, setCounterparty] = useState<Counterparty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const mockData: Counterparty[] = [
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
    ];
    const cp = mockData.find((c) => c.id === params.id);
    setCounterparty(cp || null);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  if (!counterparty) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <h2 className="text-lg font-medium text-gray-900">Counterparty not found</h2>
        <Link href="/counterparties" className="text-sm text-everypay-600 hover:text-everypay-900">
          &larr; Back to Counterparties
        </Link>
      </div>
    );
  }

  const isRisky = counterparty.trustScore < 75;
  const trustColor = counterparty.trustScore >= 90 ? "text-green-600" : counterparty.trustScore >= 75 ? "text-amber-600" : "text-red-600";

  // Mock settlement history
  const settlementHistory = [
    { id: "STL-001", date: "2026-04-14", amount: 25000, status: "SETTLED", corridor: "BRL → USD" },
    { id: "STL-002", date: "2026-04-10", amount: 45000, status: "SETTLED", corridor: "BRL → USD" },
    { id: "STL-003", date: "2026-04-05", amount: 12400, status: "SETTLED", corridor: "BRL → USD" },
    { id: "STL-004", date: "2026-03-28", amount: 32000, status: "FAILED", corridor: "BRL → USD" },
  ];

  // Mock interaction timeline
  const interactionHistory = [
    { date: "2026-04-14", event: "Settlement STL-001 completed — USD delivered", type: "success" },
    { date: "2026-04-14", event: "Payment agreement TPA-003 created", type: "info" },
    { date: "2026-04-12", event: "Invoice INV-007 received", type: "info" },
    { date: "2026-04-10", event: "Settlement STL-002 completed — HKD received", type: "success" },
    { date: "2026-04-05", event: "Settlement STL-003 completed", type: "success" },
    { date: "2026-03-28", event: "Settlement STL-004 failed — OTC timeout", type: "error" },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/counterparties" className="hover:text-gray-700">Counterparties</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{counterparty.companyName}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{counterparty.companyName}</h1>
            <p className="text-sm text-gray-500">
              {counterparty.role} &middot; {counterparty.id} &middot; KYC: {counterparty.kycStatus.replace(/_/g, " ")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Trust Score</p>
            <p className={`text-3xl font-mono font-bold ${trustColor}`}>{counterparty.trustScore}%</p>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
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
            <p className={`text-2xl font-mono font-bold ${counterparty.settlementSuccessRate >= 95 ? "text-green-600" : "text-red-600"}`}>
              {counterparty.settlementSuccessRate.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Avg Delivery</p>
            <p className="text-2xl font-mono font-bold text-gray-900">{counterparty.averageDeliveryTimeDays}d</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Dispute Rate</p>
            <p className={`font-mono font-medium ${counterparty.disputeRate > 5 ? "text-red-600" : "text-green-600"}`}>
              {counterparty.disputeRate.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Corridors</p>
            <p className="text-sm text-gray-900">{counterparty.corridors.join(", ")}</p>
          </div>
        </div>
      </div>

      {isRisky && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm font-medium text-red-800">
            Risk Indicator: Trust score below 75% — enhanced due diligence recommended
          </p>
        </div>
      )}

      {/* Settlement History */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-sm font-medium text-gray-900 mb-4">Settlement History</h2>
        <div className="space-y-2">
          {settlementHistory.map((stl) => (
            <Link
              key={stl.id}
              href={`/settlements/${stl.id}?userId=${searchParams.get("userId")}`}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded"
            >
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${stl.status === "SETTLED" ? "bg-green-500" : "bg-red-500"}`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{stl.id}</p>
                  <p className="text-xs text-gray-500">{stl.corridor} &middot; {stl.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono font-medium">${stl.amount.toLocaleString()}</p>
                <p className={`text-xs ${stl.status === "SETTLED" ? "text-green-600" : "text-red-600"}`}>
                  {stl.status}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Interaction Timeline */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-sm font-medium text-gray-900 mb-4">Interaction History</h2>
        <div className="space-y-0">
          {interactionHistory.map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  item.type === "success" ? "bg-green-500" : item.type === "error" ? "bg-red-500" : "bg-blue-500"
                }`} />
                {i < interactionHistory.length - 1 && <div className="w-px h-full bg-gray-200" />}
              </div>
              <div className="flex-1 pb-4">
                <p className="text-sm text-gray-900">{item.event}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
