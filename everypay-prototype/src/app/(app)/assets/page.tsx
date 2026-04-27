"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Settlement } from "@/lib/types";

type AssetBalance = {
  currency: string;
  available: number;
  inTransit: number;
  reserved: number;
  total: number;
};

const CURRENCIES = [
  { symbol: "USDT", name: "Tether USD", chain: "TRC-20", color: "text-green-600", bg: "bg-green-50" },
  { symbol: "USD", name: "US Dollar", chain: "Bank Wire", color: "text-blue-600", bg: "bg-blue-50" },
  { symbol: "HKD", name: "Hong Kong Dollar", chain: "Bank Wire", color: "text-indigo-600", bg: "bg-indigo-50" },
  { symbol: "BRL", name: "Brazilian Real", chain: "PIX / Wire", color: "text-emerald-600", bg: "bg-emerald-50" },
  { symbol: "ARS", name: "Argentine Peso", chain: "Wire", color: "text-purple-600", bg: "bg-purple-50" },
];

export default function AssetsPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";
  const orgParam = searchParams.get("org");
  const [loading, setLoading] = useState(true);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [balances, setBalances] = useState<AssetBalance[]>([]);

  const role = userId === "user-2" ? "seller" : "buyer";

  useEffect(() => {
    Promise.all([
      fetch("/api/settlements").then((r) => r.json()),
    ])
      .then(([stlRes]) => {
        if (stlRes.data) setSettlements(stlRes.data as Settlement[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    if (!settlements.length) return;

    const mySettlements = settlements.filter(
      (s) => s.buyerId === userId || s.sellerId === userId
    );

    // Derive balances from settlement data
    const wallet: Record<string, { available: number; inTransit: number; reserved: number }> = {
      USDT: { available: 0, inTransit: 0, reserved: 0 },
      USD: { available: 0, inTransit: 0, reserved: 0 },
      HKD: { available: 0, inTransit: 0, reserved: 0 },
      BRL: { available: 0, inTransit: 0, reserved: 0 },
      ARS: { available: 0, inTransit: 0, reserved: 0 },
    };

    mySettlements.forEach((s) => {
      const isMine = role === "buyer" ? s.buyerId === userId : s.sellerId === userId;

      // Settled transactions add to available balance
      if (s.status === "SETTLED") {
        if (isMine) {
          // Buyer: final amount received in settlement currency
          if (s.settlementCurrency === "USD") {
            wallet.USD.available += s.finalAmount;
          } else if (s.settlementCurrency === "HKD") {
            wallet.HKD.available += s.finalAmount;
          }
        } else {
          // Seller: received fiat from their corridor currency
          wallet.BRL.available += s.fiatAmount;
        }
      }

      // In-progress settlements show as in-transit
      if (!["SETTLED", "FAILED"].includes(s.status)) {
        if (s.status === "USD_HKD_READY" || s.status === "TRANSFER_IN_PROGRESS") {
          if (isMine) {
            if (s.settlementCurrency === "USD") {
              wallet.USD.inTransit += s.finalAmount;
            } else {
              wallet.HKD.inTransit += s.finalAmount;
            }
          }
        }
        if (s.status === "USDT_CONFIRMED" || s.status === "FIAT_TO_USDT_COMPLETE") {
          wallet.USDT.inTransit += s.usdtAmount;
        }
      }
    });

    // Seed baseline balances for prototype demo
    wallet.USDT.available += role === "seller" ? 45200 : 12350;
    wallet.USD.available += role === "seller" ? 28000 : 56000;
    wallet.HKD.available += role === "seller" ? 15000 : 8500;
    wallet.BRL.available += role === "seller" ? 185000 : 42000;

    const result: AssetBalance[] = CURRENCIES.map((c) => {
      const w = wallet[c.symbol];
      return {
        currency: c.symbol,
        available: w.available,
        inTransit: w.inTransit,
        reserved: w.reserved,
        total: w.available + w.inTransit + w.reserved,
      };
    });

    setBalances(result);
  }, [settlements, userId, role]);

  const totalUsdValue = balances.reduce((sum, b) => {
    const rates: Record<string, number> = { USDT: 1, USD: 1, HKD: 0.128, BRL: 0.2, ARS: 0.0012 };
    return sum + b.total * (rates[b.currency] || 0);
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Portfolio overview */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <p className="text-xs text-gray-500 uppercase">Total Portfolio Value (USD equiv.)</p>
        <p className="text-3xl font-mono font-bold text-gray-900 mt-1">
          ${totalUsdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Asset balances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {balances.map((b) => {
          const info = CURRENCIES.find((c) => c.symbol === b.currency)!;
          return (
            <Link key={b.currency} href={`/assets/${b.currency}?userId=${userId}${orgParam ? `&org=${orgParam}` : ""}`} className="block bg-white rounded-lg shadow border border-gray-200 p-5 hover:border-everypay-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  b.currency === "USDT" ? "bg-green-500" :
                  b.currency === "USD" ? "bg-blue-500" :
                  b.currency === "HKD" ? "bg-indigo-500" :
                  b.currency === "BRL" ? "bg-emerald-500" :
                  "bg-purple-500"
                }`}>
                  {b.currency.slice(0, 2)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{b.currency}</p>
                  <p className="text-xs text-gray-500">{info.name}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Available</span>
                  <span className="font-mono font-medium text-gray-900">{b.available.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                {b.inTransit > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">In Transit</span>
                    <span className="font-mono font-medium text-amber-600">{b.inTransit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {b.reserved > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Reserved</span>
                    <span className="font-mono font-medium text-red-600">{b.reserved.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                  <span className="font-medium text-gray-700">Total</span>
                  <span className="font-mono font-bold text-gray-900">{b.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-3">{info.chain}</p>
              <p className="text-xs text-everypay-600 mt-2">Click to manage &rarr;</p>
            </Link>
          );
        })}
      </div>

      {/* Recent settlement activity affecting balances */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Recent Settlement Activity</h2>
          <p className="text-xs text-gray-500">Transactions impacting your balances</p>
        </div>
        <div className="divide-y divide-gray-100">
          {settlements
            .filter((s) => s.buyerId === userId || s.sellerId === userId)
            .slice(0, 5)
            .map((s) => (
              <div key={s.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{s.id}</p>
                  <p className="text-xs text-gray-500">
                    {s.corridor} → {s.settlementCurrency} · {s.status.replace(/_/g, " ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-medium text-gray-900">
                    {s.settlementCurrency} {s.finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          {settlements.filter((s) => s.buyerId === userId || s.sellerId === userId).length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-400">No settlement activity yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
