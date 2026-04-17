"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Settlement, SettlementLeg } from "@/lib/types";
import { formatCorridorAmount } from "@/lib/corridorFormat";

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

const LEG_LABELS: Record<number, string> = {
  1: "BRL/ARS → USDT",
  2: "USDT Transfer",
  3: "USDT → USD/HKD",
  4: "USD/HKD → Bank",
};

type TabId = "status" | "chain" | "documents" | "evidence" | "audit";

export default function SettlementDetailPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";
  const [settlement, setSettlement] = useState<Settlement | null>(null);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("status");

  // Mock data for documents, evidence, audit
  const [docs] = useState([
    { type: "contract", name: "Sales_Contract.pdf", size: "2.4 MB" },
    { type: "invoice", name: "Commercial_Invoice.pdf", size: "856 KB" },
    { type: "po", name: "Purchase_Order.pdf", size: "1.1 MB" },
    { type: "logistics", name: "Bill_of_Lading.pdf", size: "3.2 MB" },
    { type: "customs", name: "Customs_Clearance.pdf", size: "1.8 MB" },
    { type: "bank_transfer", name: "Bank_Transfer_Receipt.pdf", size: "512 KB" },
  ]);

  const [auditTrail] = useState([
    { event: "Settlement initiated", actor: "user-2", timestamp: "2026-04-14 10:00", hash: "a1b2c3" },
    { event: "BRL received, converted to USDT", actor: "system", timestamp: "2026-04-14 10:15", hash: "d4e5f6" },
    { event: "USDT transferred to seller wallet", actor: "system", timestamp: "2026-04-14 10:16", hash: "g7h8i9" },
    { event: "USDT → USD conversion complete", actor: "system", timestamp: "2026-04-14 10:30", hash: "j1k2l3" },
    { event: "USD transferred to HK offshore account", actor: "system", timestamp: "2026-04-14 11:00", hash: "m4n5o6" },
  ]);

  const tabs: { id: TabId; label: string }[] = [
    { id: "status", label: "Status" },
    { id: "chain", label: "Chain" },
    { id: "documents", label: "Documents" },
    { id: "evidence", label: "Evidence" },
    { id: "audit", label: "Audit" },
  ];

  useEffect(() => {
    fetch(`/api/settlements/${params.id}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.data) setSettlement(result.data as Settlement);
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
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  if (!settlement) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <h2 className="text-lg font-medium text-gray-900">Settlement not found</h2>
        <Link href="/settlements" className="text-sm text-everypay-600 hover:text-everypay-900">
          &larr; Back to Settlements
        </Link>
      </div>
    );
  }

  // Determine role for crypto abstraction
  const isBuyer = userId === "user-1";

  const progressSteps = [
    { label: "Initiated", done: true },
    { label: "Fiat Received", done: settlement.legs.some((l) => l.status !== "INITIATED") },
    { label: "USDT Converted", done: settlement.legs.length > 1 && settlement.legs[1]?.status !== "INITIATED" },
    { label: "Transferred", done: settlement.status === "SETTLED" },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Breadcrumb & Tabs */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href={`/settlements?userId=${userId}`} className="hover:text-gray-700">Settlements</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{settlement.id}</span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[settlement.status]}`}>
            {settlement.status.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      {/* Status Tab */}
      {activeTab === "status" && (
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-900 mb-4">Settlement Progress</h2>
            <div className="flex items-center gap-0">
              {progressSteps.map((step, i) => (
                <div key={i} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step.done ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                    }`}>
                      {step.done ? "✓" : i + 1}
                    </div>
                    <span className="text-xs text-gray-600 mt-2 text-center">{step.label}</span>
                  </div>
                  {i < progressSteps.length - 1 && (
                    <div className={`w-full h-0.5 mx-2 -mt-6 ${
                      progressSteps[i + 1]?.done ? "bg-green-500" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Rate Lock */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Rate Lock</h2>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500">Locked Rate</p>
                <p className="text-lg font-mono font-bold text-gray-900">{settlement.lockedRate.toFixed(4)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Fiat Amount</p>
                <p className="text-lg font-mono font-bold text-gray-900">
                  {formatCorridorAmount(settlement.fiatAmount, settlement.corridor)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Final Amount</p>
                <p className="text-lg font-mono font-bold text-gray-900">
                  {formatCorridorAmount(settlement.finalAmount, settlement.settlementCurrency)}
                </p>
              </div>
            </div>
          </div>

          {/* Corridor info */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Corridor</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500">From</p>
                <p className="text-lg font-bold text-gray-900">{settlement.corridor}</p>
              </div>
              <span className="text-gray-400 text-2xl">&rarr;</span>
              <div className="flex-1 bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500">To</p>
                <p className="text-lg font-bold text-gray-900">{settlement.settlementCurrency}</p>
              </div>
            </div>
          </div>

          {/* Confirm Receipt (for buyer when settled) */}
          {settlement.status === "SETTLED" || settlement.status === "SETTLED_PENDING_CONFIRMATION" ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-sm font-medium text-green-800 mb-2">
                Settlement completed
              </h3>
              <p className="text-sm text-green-700 mb-3">
                {settlement.completedAt
                  ? `Confirmed on ${new Date(settlement.completedAt).toLocaleDateString()}`
                  : "Awaiting your confirmation of receipt."}
              </p>
              {settlement.status === "SETTLED_PENDING_CONFIRMATION" && (
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700">
                    Confirm Receipt
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700">
                    Report Non-Receipt
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Chain Tab */}
      {activeTab === "chain" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-900 mb-4">4-Leg Settlement Chain</h2>
            <div className="space-y-4">
              {settlement.legs.map((leg: SettlementLeg) => (
                <div key={leg.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        Leg {leg.legOrder}
                      </span>
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {LEG_LABELS[leg.legOrder] || `${leg.currencyFrom} → ${leg.currencyTo}`}
                      </span>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[leg.status]}`}>
                      {leg.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">From</p>
                      <p className="font-mono font-medium">
                        {formatCorridorAmount(leg.amountFrom, leg.currencyFrom)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">To</p>
                      <p className="font-mono font-medium">
                        {isBuyer && leg.currencyTo === "USDT"
                          ? "Converted"
                          : `${leg.amountTo.toLocaleString()} ${leg.currencyTo}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Rate</p>
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
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Settlement Documents</h2>
          <p className="text-xs text-gray-500 mb-4">
            All documents shared between parties throughout this transaction
          </p>
          <div className="space-y-2">
            {docs.map((doc, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded">
                <div className="flex items-center gap-3">
                  <DocIcon type={doc.type} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.type.replace("_", " ")} &middot; {doc.size}</p>
                  </div>
                </div>
                <span className="text-xs text-everypay-600 hover:text-everypay-900 cursor-pointer">
                  View &rarr;
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Tab */}
      {activeTab === "evidence" && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Evidence Pack</h2>
          {settlement.status === "SETTLED" ? (
            <div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center mb-4">
                <svg className="mx-auto h-10 w-10 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-green-800">Evidence pack ready for download</p>
                <p className="text-xs text-green-600 mt-1">
                  One file. Everything you need. &middot; Retained until 2033
                </p>
              </div>
              <div className="flex justify-center">
                <button className="px-6 py-3 bg-everypay-600 text-white text-sm font-medium rounded-lg hover:bg-everypay-700">
                  Download Evidence Pack
                </button>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Pack Contents:</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <span>Contract &amp; Invoice</span>
                  <span>Purchase Order</span>
                  <span>Logistics Documents</span>
                  <span>Customs Clearance</span>
                  <span>Bank Transfer Receipts</span>
                  <span>Rate Lock Record</span>
                  <span>Audit Trail</span>
                  <span>Settlement Confirmation</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <svg className="mx-auto h-10 w-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-sm text-gray-400">Evidence pack will be available after settlement</p>
            </div>
          )}
        </div>
      )}

      {/* Audit Tab */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Audit Trail</h2>
          <p className="text-xs text-gray-500 mb-4">
            Immutable, timestamped record of all settlement events
          </p>
          <div className="space-y-0">
            {auditTrail.map((entry, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    i === auditTrail.length - 1 ? "bg-everypay-600" : "bg-gray-300"
                  }`} />
                  {i < auditTrail.length - 1 && <div className="w-px h-full bg-gray-200" />}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium text-gray-900">{entry.event}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">{entry.actor}</span>
                    <span className="text-xs text-gray-400">{entry.timestamp}</span>
                    <span className="text-xs font-mono text-gray-400">{entry.hash}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simulate Advance */}
      {settlement.status !== "SETTLED" && settlement.status !== "FAILED" && (
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
    </div>
  );
}

function DocIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    contract: "📄",
    invoice: "📋",
    po: "📦",
    packing_list: "📃",
    logistics: "🚢",
    customs: "🛃",
    bank_transfer: "🏦",
    insurance: "🛡️",
  };
  return <span className="text-lg">{icons[type] || "📎"}</span>;
}
