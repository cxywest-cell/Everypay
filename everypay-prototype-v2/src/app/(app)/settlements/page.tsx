"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Settlement } from "@/lib/types";
import type { Procurement } from "@/lib/types";
import { formatCorridorAmount, getCorridorComplianceNotation } from "@/lib/corridorFormat";

const PENDING_ORGS = new Set(["org-beta", "org-delta"]);

const FIAT_CURRENCIES = new Set(["BRL", "USD", "EUR", "HKD", "GBP", "JPY", "CNY", "AUD", "CHF", "CAD", "SGD", "MXN", "INR", "PHP", "THB", "IDR", "MYR", "VND", "KRW", "TWD", "SAR", "AED", "EGP", "ZAR", "NGN", "KES", "GHS", "MAD"]);
const STABLECOINS = new Set(["USDT", "USDC", "DAI", "FDUSD", "TUSD"]);

type CorridorType = "crypto_only" | "one_step" | "two_step";

function getCorridorType(corridor: string, settlementCurrency: string): CorridorType {
  const corridorIsFiat = FIAT_CURRENCIES.has(corridor);
  const corridorIsStablecoin = STABLECOINS.has(corridor);
  const settlementIsFiat = FIAT_CURRENCIES.has(settlementCurrency);

  if ((corridorIsStablecoin || !corridorIsFiat) && corridor === settlementCurrency) {
    return "crypto_only";
  }
  if ((corridorIsStablecoin || !corridorIsFiat) && settlementIsFiat) {
    return "one_step";
  }
  return "two_step";
}

const CORRIDOR_TYPE_CONFIG: Record<CorridorType, { label: string; color: string }> = {
  crypto_only: { label: "Crypto Only", color: "bg-purple-100 text-purple-800" },
  one_step: { label: "Exchange", color: "bg-amber-100 text-amber-800" },
  two_step: { label: "Exchange", color: "bg-blue-100 text-blue-800" },
};

function calcTotalFees(settlement: Settlement): number {
  return settlement.legs.reduce((sum, leg) => sum + (leg.fees || 0), 0);
}

function formatFees(fees: number, corridor: string): string {
  if (fees === 0) return "0.00";
  const decimals = FIAT_CURRENCIES.has(corridor) ? 2 : 4;
  return fees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: decimals });
}

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
  const orgParam = searchParams.get("org");
  const router = useRouter();
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [procurements, setProcurements] = useState<Procurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const STATUS_FILTERS = [
    { key: "All", label: "All" },
    { key: "SETTLED", label: "Settled" },
    { key: "FIAT_CONVERSION_CONFIRMED", label: "Conversion Confirmed" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "FAILED", label: "Failed" },
  ];

  const isInProgress = (s: Settlement) =>
    ["IN_PROGRESS","INITIATED","FIAT_RECEIVED","USDT_CONFIRMED","FIAT_TO_USDT_COMPLETE","USDT_TO_FIAT_IN_PROGRESS","USD_HKD_READY","TRANSFER_IN_PROGRESS","TRANSFERRED","SETTLED_PENDING_CONFIRMATION"].includes(s.status);

  const filtered = settlements.filter((s) => {
    if (statusFilter === "All") return true;
    if (statusFilter === "IN_PROGRESS") return isInProgress(s);
    return s.status === statusFilter;
  });

  // Build a map of procurementId -> procurement details
  const poMap = new Map<string, { description: string; totalAmount: number; currency: string; buyerId: string; sellerId: string }>();
  for (const po of procurements) {
    const firstItem = po.lineItems?.[0]?.description;
    poMap.set(po.id, {
      description: firstItem || po.id,
      totalAmount: po.totalAmount,
      currency: po.currency || "USD",
      buyerId: po.buyerId,
      sellerId: po.sellerId,
    });
  }

  useEffect(() => {
    if (PENDING_ORGS.has(orgParam || "")) {
      const params = new URLSearchParams();
      params.set("userId", userId);
      params.set("org", orgParam!);
      window.location.href = `/compliance-pending?${params.toString()}`;
      return;
    }

    Promise.all([
      fetch(`/api/settlements?buyerId=${userId}`).then((res) => res.json()),
      fetch(`/api/procurements?userId=${userId}`).then((res) => res.json()),
    ])
      .then(([settlementsResult, poResult]) => {
        if (settlementsResult.data) setSettlements(settlementsResult.data as Settlement[]);
        if (poResult.data) setProcurements(poResult.data as Procurement[]);
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
          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap mb-4">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === f.key
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {f.label}
                {f.key !== "All" && (
                  <span className="ml-1.5 opacity-60">
                    ({settlements.filter((s) => f.key === "IN_PROGRESS" ? isInProgress(s) : s.status === f.key).length})
                  </span>
                )}
              </button>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div className="bg-white rounded-lg shadow border border-gray-200 py-12 text-center">
              <p className="text-sm text-gray-500">No settlements match this filter.</p>
            </div>
          ) : (
            <>
              {filtered.map((settlement) => {
                // Determine direction based on who the user is in the linked procurement
                const po = poMap.get(settlement.procurementId);
                const poDescription = po?.description ?? settlement.procurementId;
                const isPayer = po
                  ? po.buyerId === userId  // If user is the buyer in the procurement, they pay out
                  : settlement.buyerId === userId;  // Fallback to settlement buyerId
                const direction = isPayer
                  ? { label: "Pay Out", icon: "\u2191", accent: "text-red-600 bg-red-50" }
                  : { label: "Receive Payment", icon: "\u2193", accent: "text-emerald-600 bg-emerald-50" };
                const totalFees = calcTotalFees(settlement);

                return (
                  <Link
                    key={settlement.id}
                    href={`/settlements/${settlement.id}?userId=${userId}${orgParam ? `&org=${orgParam}` : ""}`}
                    className="block bg-white rounded-lg shadow border border-gray-200 p-6 hover:bg-gray-50 transition-colors"
                  >
                    {/* Header: ID + Direction + Status */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-gray-900">{settlement.id}</h3>
                        {/* Direction badge */}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${direction.accent}`}>
                          <span>{direction.icon}</span>
                          {direction.label}
                        </span>
                        {/* Corridor type */}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${CORRIDOR_TYPE_CONFIG[getCorridorType(settlement.corridor, settlement.settlementCurrency)].color}`}>
                          {CORRIDOR_TYPE_CONFIG[getCorridorType(settlement.corridor, settlement.settlementCurrency)].label}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[settlement.status]}`}>
                        {settlement.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    {/* Linked activity (procurement) */}
                    <div className="mb-3 flex items-center gap-2 text-xs text-gray-600">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="font-medium">{poDescription}</span>
                      <span className="text-gray-400">&middot;</span>
                      <span className="font-mono">{settlement.procurementId}</span>
                    </div>

                    {/* Asset Path */}
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-3 font-mono flex-wrap">
                      <span className="font-medium">{settlement.legs[0].currencyFrom}</span>
                      <span className="text-gray-400">{Number(settlement.legs[0].amountFrom).toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                      {settlement.legs.map((leg) => {
                        const prevLeg = settlement.legs[settlement.legs.indexOf(leg) - 1];
                        const prevCurrencyTo = prevLeg ? prevLeg.currencyTo : settlement.legs[0].currencyFrom;
                        if (leg.currencyTo === prevCurrencyTo) return null;
                        return (
                          <span key={leg.id} className="flex items-center gap-1">
                            <span className="text-gray-400 mx-0.5">→</span>
                            <span className="font-medium">{leg.currencyTo}</span>
                            <span className="text-gray-400">{Number(leg.amountTo).toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                          </span>
                        );
                      })}
                    </div>

                    {/* Fees + Date */}
                    <div className="flex items-center justify-between text-xs border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-500">Fees:</span>
                        <span className="font-mono font-semibold text-gray-900">
                          {formatFees(totalFees, settlement.corridor)}
                          {settlement.legs.length > 1 && (
                            <span className="text-gray-400 font-normal ml-1">
                              ({settlement.legs.map(l => `${l.currencyFrom} ${l.fees ?? 0}`).join(" + ")})
                            </span>
                          )}
                        </span>
                      </div>
                      <span className="text-gray-400">
                        {new Date(settlement.createdAt).toLocaleDateString()}
                        {settlement.completedAt && ` · Done ${new Date(settlement.completedAt).toLocaleDateString()}`}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}