"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Settlement, SettlementLeg, Procurement } from "@/lib/types";

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  INITIATED: { label: "Initiated", color: "bg-gray-100 text-gray-700 border-gray-200" },
  FIAT_RECEIVED: { label: "Fiat Received", color: "bg-blue-50 text-blue-700 border-blue-100" },
  USDT_CONFIRMED: { label: "USDT Confirmed", color: "bg-sky-50 text-sky-700 border-sky-100" },
  FIAT_TO_USDT_COMPLETE: { label: "Currency Converted", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  USDT_TO_FIAT_IN_PROGRESS: { label: "USDT → Fiat In Progress", color: "bg-amber-50 text-amber-700 border-amber-100" },
  FIAT_CONVERSION_CONFIRMED: { label: "Conversion Confirmed", color: "bg-green-50 text-green-700 border-green-100" },
  USD_HKD_READY: { label: "Ready for Transfer", color: "bg-green-50 text-green-700 border-green-100" },
  TRANSFER_IN_PROGRESS: { label: "Transfer In Progress", color: "bg-amber-50 text-amber-700 border-amber-100" },
  TRANSFERRED: { label: "Transferred", color: "bg-blue-50 text-blue-700 border-blue-100" },
  SETTLED: { label: "Settled", color: "bg-green-100 text-green-700 border-green-200" },
  FAILED: { label: "Failed", color: "bg-red-100 text-red-700 border-red-200" },
  DISPUTED: { label: "Disputed", color: "bg-red-100 text-red-700 border-red-200" },
};

const SETTLEMENT_STEPS = [
  { key: "initiated", label: "Initiated" },
  { key: "risk_check", label: "Risk Policy Check" },
  { key: "fiat_received", label: "Fiat Received" },
  { key: "currency_converted", label: "Currency Converted" },
  { key: "usdt_transferred", label: "USDT Transferred" },
  { key: "conversion_complete", label: "Conversion Complete" },
  { key: "ready_for_transfer", label: "Ready for Transfer" },
  { key: "transferred", label: "Transferred to Bank" },
  { key: "settled", label: "Settled" },
];

function getCompletedSteps(status: string): string[] {
  const order: Record<string, string[]> = {
    INITIATED: ["initiated", "risk_check"],
    FIAT_RECEIVED: ["initiated", "risk_check", "fiat_received"],
    USDT_CONFIRMED: ["initiated", "risk_check", "fiat_received"],
    FIAT_TO_USDT_COMPLETE: ["initiated", "risk_check", "fiat_received", "currency_converted"],
    USDT_TO_FIAT_IN_PROGRESS: ["initiated", "risk_check", "fiat_received", "currency_converted", "usdt_transferred"],
    FIAT_CONVERSION_CONFIRMED: ["initiated", "risk_check", "fiat_received", "currency_converted", "usdt_transferred", "conversion_complete"],
    USD_HKD_READY: ["initiated", "risk_check", "fiat_received", "currency_converted", "usdt_transferred", "conversion_complete", "ready_for_transfer"],
    TRANSFER_IN_PROGRESS: ["initiated", "risk_check", "fiat_received", "currency_converted", "usdt_transferred", "conversion_complete", "ready_for_transfer", "transferred"],
    TRANSFERRED: ["initiated", "risk_check", "fiat_received", "currency_converted", "usdt_transferred", "conversion_complete", "ready_for_transfer", "transferred"],
    SETTLED: ["initiated", "risk_check", "fiat_received", "currency_converted", "usdt_transferred", "conversion_complete", "ready_for_transfer", "transferred", "settled"],
    FAILED: ["initiated", "risk_check"],
    DISPUTED: ["initiated"],
  };
  return order[status] || ["initiated"];
}

function AccountBadge({ account, label }: { account: { type: string; accountId: string; address: string | null; name: string }; label: string }) {
  const isFiat = account.type === "bank";
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-100">
      <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</div>
      <div className="text-xs font-semibold text-gray-900">{account.name}</div>
      <div className="text-[10px] text-gray-500 mt-0.5">ID: {account.accountId}</div>
      {isFiat ? (
        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
          </svg>
          Bank Account
        </div>
      ) : (
        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
          <div className="w-3 h-3 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-[8px] font-bold">₮</div>
          <span className="font-mono">{account.address}</span>
        </div>
      )}
    </div>
  );
}

export default function SettlementDetailPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";
  const [settlement, setSettlement] = useState<Settlement | null>(null);
  const [procurement, setProcurement] = useState<Procurement | null>(null);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);

  const role = userId === "user-1" ? "buyer" : userId === "user-2" ? "seller" : "approver";

  useEffect(() => {
    Promise.all([
      fetch(`/api/settlements/${params.id}`).then((r) => r.json()),
    ])
      .then(([settlementRes]) => {
        if (settlementRes.data) {
          const s = settlementRes.data as Settlement;
          setSettlement(s);
          // Fetch linked procurement
          if (s.procurementId) {
            fetch(`/api/procurements?userId=${userId}`)
              .then((r) => r.json())
              .then((res) => {
                const p = (res.data as Procurement[] | undefined)?.find((x) => x.id === s.procurementId);
                if (p) setProcurement(p);
              })
              .catch(() => {});
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id, userId]);

  const handleAdvance = async () => {
    setAdvancing(true);
    try {
      const res = await fetch(`/api/settlements/${params.id}`, { method: "POST" });
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
        <Link href="/settlements" className="text-sm text-everypay-600 hover:text-everypay-900">&larr; Back to Settlements</Link>
      </div>
    );
  }

  const badge = STATUS_BADGE[settlement.status] || STATUS_BADGE.INITIATED;
  const completedSteps = getCompletedSteps(settlement.status);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/settlements" className="text-gray-400 hover:text-gray-600 transition-all duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Review Settlement</h1>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
            {settlement.status !== "SETTLED" && settlement.status !== "FAILED" && settlement.status !== "DISPUTED" && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            )}
            {badge.label}
          </span>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* ── Dynamic Asset Path from actual legs ── */}
          {(() => {
            const legs = settlement.legs;
            const firstLeg = legs[0];
            const lastLeg = legs[legs.length - 1];

            // Determine corridor type from actual leg data
            const isCryptoOnly =
              legs.length >= 2 &&
              firstLeg.currencyFrom === lastLeg.currencyTo &&
              legs.every(l => l.fromAccount.type === 'wallet' && l.toAccount.type === 'wallet');
            const isUsdtOnly =
              legs.length === 2 &&
              firstLeg.currencyFrom === 'USDT' && firstLeg.currencyTo === 'USDT' &&
              lastLeg.currencyFrom === 'USDT' && lastLeg.currencyTo === 'USD' &&
              firstLeg.fromAccount.type === 'bank';

            const corridorLabel = isCryptoOnly
              ? `${lastLeg.currencyTo} Only`
              : isUsdtOnly
              ? 'USDT Corridor'
              : `${firstLeg.currencyFrom} Exchange`;

            // Corridor accent color
            const corridorAccent = isCryptoOnly ? 'from-purple-50 via-purple-50 to-purple-50' : 'from-blue-50 via-emerald-50 to-green-50';

            const totalFees = legs.reduce((sum, l) => sum + (l.fees || 0), 0);

            // Direction
            const po = procurement;
            const isPayer = po ? po.buyerId === userId : settlement.buyerId === userId;
            const dir = isPayer
              ? { label: 'Pay Out', icon: '\u2191', accent: 'text-red-600 bg-red-50' }
              : { label: 'Receive', icon: '\u2193', accent: 'text-emerald-600 bg-emerald-50' };

            return (
              <div className={`bg-gradient-to-r ${corridorAccent} rounded-xl border border-gray-200 p-5`}>
                {/* Header row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Asset Path</div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${dir.accent}`}>
                      <span>{dir.icon}</span>
                      {dir.label}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-700">
                      {corridorLabel}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Total Fees</div>
                    <div className="text-sm font-semibold text-gray-900 font-mono">
                      {totalFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} {lastLeg.currencyTo}
                    </div>
                  </div>
                </div>

                {/* Dynamic flow: uniform box size, equal spacing */}
                <div className="flex items-center justify-center gap-4">
                  {/* Origin */}
                  <div className="flex-shrink-0 w-36 h-[128px] bg-white rounded-lg border border-gray-200 p-3 flex flex-col items-center text-center">
                    <div className="text-[10px] font-medium text-gray-400 uppercase">Origin</div>
                    <div className="text-xs font-bold text-gray-900 mt-1">{firstLeg.fromAccount.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">{firstLeg.currencyFrom}</div>
                    <div className="text-sm font-bold text-gray-900 font-mono mt-2">
                      {firstLeg.amountFrom.toLocaleString(undefined, { maximumFractionDigits: 4 })} {firstLeg.currencyFrom}
                    </div>
                  </div>

                  {legs.map((leg, i) => (
                    <div key={leg.id} className="flex-shrink-0 flex items-center gap-4">
                      {/* Arrow + per-leg metadata */}
                      <div className="flex flex-col items-center gap-1 w-16">
                        {leg.exchangeRate !== 1 && (
                          <div className="text-[10px] text-gray-500 font-mono">{leg.exchangeRate.toFixed(4)}</div>
                        )}
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        {leg.fees > 0 && (
                          <div className="text-[9px] text-gray-400">fee {leg.fees.toLocaleString(undefined, { maximumFractionDigits: 4 })}</div>
                        )}
                      </div>
                      <div className="flex-shrink-0 w-36 h-[128px] bg-white rounded-lg border border-gray-200 p-3 flex flex-col items-center text-center">
                        {leg.currencyFrom !== leg.currencyTo ? (
                          <>
                            <div className="text-[10px] font-medium text-gray-400 uppercase">Exchange {i + 1}</div>
                            <div className="text-xs font-bold text-gray-900 mt-1">{leg.currencyFrom} → {leg.currencyTo}</div>
                            <div className="text-[10px] text-gray-500 font-mono mt-0.5">{leg.toAccount.name}</div>
                            <div className="text-sm font-bold text-emerald-700 font-mono mt-2">
                              {leg.amountTo.toLocaleString(undefined, { maximumFractionDigits: 4 })} {leg.currencyTo}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-[10px] font-medium text-gray-400 uppercase">Transfer {i + 1}</div>
                            <div className="text-xs font-bold text-gray-900 mt-1">{leg.currencyFrom}</div>
                            <div className="text-[10px] text-gray-500 font-mono mt-0.5">{leg.toAccount.name}</div>
                            <div className="text-sm font-bold text-gray-900 font-mono mt-2">
                              {leg.amountTo.toLocaleString(undefined, { maximumFractionDigits: 4 })} {leg.currencyTo}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Destination */}
                  <div className="flex-shrink-0 flex items-center gap-4">
                    <div className="flex flex-col items-center w-16">
                      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    <div className="flex-shrink-0 w-36 h-[128px] bg-white rounded-lg border border-green-200 p-3 flex flex-col items-center text-center">
                      <div className="text-[10px] font-medium text-green-500 uppercase">Destination</div>
                      <div className="text-xs font-bold text-gray-900 mt-1">{lastLeg.toAccount.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono mt-0.5">{lastLeg.currencyTo}</div>
                      <div className="text-sm font-bold text-green-700 font-mono mt-2">
                        {lastLeg.amountTo.toLocaleString(undefined, { maximumFractionDigits: 4 })} {lastLeg.currencyTo}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Details (2/3) */}
            <div className="lg:col-span-2 space-y-6">

              {/* Linked Sale Activity */}
              {procurement && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h2 className="text-base font-bold text-gray-900">Related Sale Activity</h2>
                    <Link href={`/trading/${procurement.id}?userId=${userId}`} className="text-xs text-everypay-600 hover:text-everypay-900">
                      View Activity →
                    </Link>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">{procurement.id}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {procurement.lineItems[0]?.description || `${procurement.lineItems.length} line item(s)`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-gray-900">
                          {procurement.currency} {procurement.totalAmount.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {procurement.status}
                        </div>
                      </div>
                    </div>
                    {procurement.lineItems.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-[10px] text-gray-400 mb-1">Line Items:</div>
                        <div className="space-y-1">
                          {procurement.lineItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-xs">
                              <span className="text-gray-700">{item.description}</span>
                              <span className="text-gray-500 font-mono">{item.quantity} × {item.currency} {item.unitPrice.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Settlement Legs with From/To pairs */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-base font-bold text-gray-900">Settlement Legs</h2>
                </div>
                <div className="p-6 space-y-4">
                  {settlement.legs.map((leg: SettlementLeg) => (
                    <div key={leg.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            leg.status === "INITIATED" ? "bg-gray-200 text-gray-500" : "bg-green-100 text-green-700"
                          }`}>
                            {leg.legOrder}
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {leg.currencyFrom} → {leg.currencyTo}
                          </span>
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                          leg.status === "INITIATED" ? "bg-gray-100 text-gray-500" : "bg-green-50 text-green-700"
                        }`}>
                          {leg.status === "INITIATED" ? "Pending" : leg.status.replace(/_/g, " ")}
                        </span>
                      </div>

                      {/* Amount */}
                      <div className="flex items-center justify-center gap-3 py-2 mb-3 bg-gray-50 rounded border border-gray-100">
                        <span className="text-sm font-mono font-bold text-gray-900">
                          {leg.amountFrom.toLocaleString()} {leg.currencyFrom}
                        </span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <span className="text-sm font-mono font-bold text-green-700">
                          {leg.amountTo.toLocaleString()} {leg.currencyTo}
                        </span>
                        <span className="text-[10px] text-gray-400">(@ {leg.exchangeRate.toFixed(4)}, fees: {leg.fees.toFixed(2)})</span>
                      </div>

                      {/* From / To accounts */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative">
                        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                          <div className="w-7 h-7 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 shadow-sm">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </div>
                        <AccountBadge account={leg.fromAccount} label="From" />
                        <AccountBadge account={leg.toAccount} label="To" />
                      </div>

                      {leg.timestamp && (
                        <p className="mt-2 text-[10px] text-gray-400">
                          Completed: {new Date(leg.timestamp).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta Info */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-base font-bold text-gray-900">Details</h2>
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Unit</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-5 h-5 rounded-full bg-everypay-50 border border-everypay-100 flex items-center justify-center text-everypay-600">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10l4-4v12l-4-4H3z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-900">Everypay</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Created At</div>
                    <div className="text-sm font-medium text-gray-900 mt-1">{new Date(settlement.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Locked Rate</div>
                    <div className="text-sm font-mono font-medium text-gray-900 mt-1">{settlement.lockedRate.toFixed(4)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Settlement ID</div>
                    <div className="text-sm font-mono font-medium text-gray-900 mt-1">#{settlement.id}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Settlement Flow (1/3) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-base font-bold text-gray-900">Settlement Flow</h2>
                </div>
                <div className="p-6">
                  <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                    {SETTLEMENT_STEPS.map((step) => {
                      const isDone = completedSteps.includes(step.key);
                      const isCurrent = !isDone && completedSteps.length === SETTLEMENT_STEPS.findIndex(s => s.key === step.key);
                      const isFuture = !isDone && !isCurrent;

                      return (
                        <div key={step.key} className={`relative ${isFuture ? "opacity-50" : ""}`}>
                          <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                            isDone ? "bg-green-500" : isCurrent ? "bg-amber-500 ring-4 ring-amber-50 animate-pulse" : "bg-gray-200"
                          }`}>
                            {isDone && (
                              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-sm font-semibold ${isDone ? "text-gray-900" : isCurrent ? "text-amber-700" : "text-gray-500"}`}>
                              {step.label}
                            </span>
                            {isCurrent && <span className="text-xs text-amber-600 font-medium mt-1">In Progress</span>}
                            {isDone && <span className="text-[10px] text-gray-400 mt-1">Completed</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="h-20 bg-white border-t border-gray-200 px-8 flex items-center justify-between flex-shrink-0 z-30">
        <div className="text-sm text-gray-500">
          Reviewing settlement <span className="font-mono text-gray-900">#{settlement.id}</span>
        </div>
        <div className="flex items-center gap-3">
          {settlement.status !== "SETTLED" && settlement.status !== "FAILED" && settlement.status !== "DISPUTED" && role !== "approver" && (
            <button
              onClick={handleAdvance}
              disabled={advancing}
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {advancing ? "Advancing..." : "Advance Stage"}
            </button>
          )}
          {settlement.status !== "SETTLED" && settlement.status !== "FAILED" && settlement.status !== "DISPUTED" && role === "approver" && (
            <span className="text-sm text-gray-400">Only buyer/seller can advance settlement</span>
          )}
          {settlement.status === "SETTLED" && (
            <span className="text-sm font-medium text-green-600">Settlement completed</span>
          )}
        </div>
      </div>
    </div>
  );
}
