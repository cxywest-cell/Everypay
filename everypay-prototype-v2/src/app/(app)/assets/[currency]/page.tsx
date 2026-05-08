"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Settlement } from "@/lib/types";

const CURRENCY_META: Record<string, { name: string; chain: string; symbol: string; color: string; icon: string }> = {
  USDT: { name: "Tether USD", chain: "TRC-20", symbol: "USDT", color: "green", icon: "₮" },
  USD: { name: "US Dollar", chain: "Bank Wire", symbol: "$", color: "blue", icon: "$" },
  HKD: { name: "Hong Kong Dollar", chain: "Bank Wire", symbol: "HK$", color: "indigo", icon: "H$" },
  BRL: { name: "Brazilian Real", chain: "PIX / Wire", symbol: "R$", color: "emerald", icon: "R$" },
  ARS: { name: "Argentine Peso", chain: "Wire", symbol: "ARS$", color: "purple", icon: "A$" },
};

const BANK_ACCOUNTS: Record<string, { bank: string; accountName: string; accountNumber: string; routing: string; swift?: string }> = {
  USD: { bank: "Chase Bank N.A.", accountName: "Everypay Settlements LLC", accountNumber: "****4821", routing: "021000021", swift: "CHASUS33" },
  HKD: { bank: "HSBC Hong Kong", accountName: "Everypay Asia Ltd", accountNumber: "****7392", routing: "004", swift: "HSBCHKHHHKH" },
  BRL: { bank: "Banco do Brasil", accountName: "Everypay Brasil Ltda", accountNumber: "****1567-3", routing: "001", swift: "BRASBRRJXXX" },
  ARS: { bank: "Banco Galicia", accountName: "Everypay Argentina S.A.", accountNumber: "****8904", routing: "007", swift: "GABARBAPXXX" },
};

const WALLET_ADDRESS = "TN2kXz8vQqR4bJ6mFwE9pYsLc7dH3uA1iV";

type AssetBalance = {
  currency: string;
  available: number;
  inTransit: number;
  reserved: number;
  total: number;
};

export default function AssetDetailPage({ params }: { params: { currency: string } }) {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";
  const orgParam = searchParams.get("org");
  const currency = params.currency.toUpperCase();

  const [loading, setLoading] = useState(true);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [balance, setBalance] = useState<AssetBalance | null>(null);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const meta = CURRENCY_META[currency];
  const isCrypto = currency === "USDT";
  const bankAccount = BANK_ACCOUNTS[currency];

  useEffect(() => {
    Promise.all([
      fetch("/api/settlements").then((r) => r.json()),
    ])
      .then(([stlRes]) => {
        if (stlRes.data) setSettlements(stlRes.data as Settlement[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!settlements.length) return;
    const role = userId === "user-2" ? "seller" : "buyer";
    const mySettlements = settlements.filter(
      (s) => s.buyerId === userId || s.sellerId === userId
    );

    const wallet: Record<string, { available: number; inTransit: number; reserved: number }> = {
      USDT: { available: 0, inTransit: 0, reserved: 0 },
      USD: { available: 0, inTransit: 0, reserved: 0 },
      HKD: { available: 0, inTransit: 0, reserved: 0 },
      BRL: { available: 0, inTransit: 0, reserved: 0 },
      ARS: { available: 0, inTransit: 0, reserved: 0 },
    };

    mySettlements.forEach((s) => {
      const isMine = role === "buyer" ? s.buyerId === userId : s.sellerId === userId;
      if (s.status === "SETTLED") {
        if (isMine) {
          if (s.settlementCurrency === "USD") wallet.USD.available += s.finalAmount;
          else if (s.settlementCurrency === "HKD") wallet.HKD.available += s.finalAmount;
        } else {
          wallet.BRL.available += s.fiatAmount;
        }
      }
      if (!["SETTLED", "FAILED"].includes(s.status)) {
        if (s.status === "USD_HKD_READY" || s.status === "TRANSFER_IN_PROGRESS") {
          if (isMine) {
            if (s.settlementCurrency === "USD") wallet.USD.inTransit += s.finalAmount;
            else wallet.HKD.inTransit += s.finalAmount;
          }
        }
        if (s.status === "USDT_CONFIRMED" || s.status === "FIAT_TO_USDT_COMPLETE") {
          wallet.USDT.inTransit += s.usdtAmount;
        }
      }
    });

    wallet.USDT.available += role === "seller" ? 45200 : 12350;
    wallet.USD.available += role === "seller" ? 28000 : 56000;
    wallet.HKD.available += role === "seller" ? 15000 : 8500;
    wallet.BRL.available += role === "seller" ? 185000 : 42000;

    const w = wallet[currency];
    if (w) {
      setBalance({
        currency,
        available: w.available,
        inTransit: w.inTransit,
        reserved: w.reserved,
        total: w.available + w.inTransit + w.reserved,
      });
    }
  }, [settlements, userId, currency]);

  const handleWithdraw = () => {
    setWithdrawLoading(true);
    setTimeout(() => {
      setWithdrawLoading(false);
      setWithdrawSuccess(true);
      setTimeout(() => {
        setShowWithdraw(false);
        setWithdrawSuccess(false);
        setWithdrawAddress("");
        setWithdrawAmount("");
      }, 2000);
    }, 1500);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  if (!meta) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Asset not found</p>
        <Link href={`/assets?userId=${userId}${orgParam ? `&org=${orgParam}` : ""}`} className="text-everypay-600 text-sm">
          &larr; Back to Assets
        </Link>
      </div>
    );
  }

  const formatCurrency = (amount: number, curr: string) => {
    if (curr === "BRL") return `R$ ${amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    if (curr === "ARS") return `$ ${amount.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
    if (curr === "HKD") return `HK$ ${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    if (curr === "USDT") return `${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT`;
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href={`/assets?userId=${userId}${orgParam ? `&org=${orgParam}` : ""}`} className="hover:text-gray-700">Assets</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{currency}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${
              currency === "USDT" ? "bg-green-500" :
              currency === "USD" ? "bg-blue-500" :
              currency === "HKD" ? "bg-indigo-500" :
              currency === "BRL" ? "bg-emerald-500" :
              "bg-purple-500"
            }`}>
              {meta.icon}
            </span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{currency}</h1>
              <p className="text-xs text-gray-500">{meta.name} &middot; {meta.chain}</p>
            </div>
          </div>
          {isCrypto && (
            <button
              onClick={() => setShowWithdraw(true)}
              className="px-4 py-2 bg-everypay-600 text-white text-sm font-medium rounded-md hover:bg-everypay-700 transition-colors"
            >
              Withdraw
            </button>
          )}
        </div>

        {/* Total balance */}
        {balance && (
          <div className="mt-6">
            <p className="text-xs text-gray-500 uppercase">Total Balance</p>
            <p className="text-3xl font-mono font-bold text-gray-900 mt-1">
              {formatCurrency(balance.total, currency)}
            </p>
          </div>
        )}
      </div>

      {/* Balance Breakdown */}
      {balance && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Balance Breakdown</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Available</span>
              <span className="font-mono font-medium text-gray-900">{formatCurrency(balance.available, currency)}</span>
            </div>
            {balance.inTransit > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">In Transit</span>
                <span className="font-mono font-medium text-amber-600">{formatCurrency(balance.inTransit, currency)}</span>
              </div>
            )}
            {balance.reserved > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Reserved</span>
                <span className="font-mono font-medium text-red-600">{formatCurrency(balance.reserved, currency)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Wallet Address (crypto) or Bank Account (fiat) */}
      {isCrypto ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Wallet Address</h2>
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-4">
            <code className="text-sm font-mono text-gray-700 flex-1 break-all">{WALLET_ADDRESS}</code>
            <button
              onClick={handleCopyAddress}
              className="px-3 py-1.5 text-xs font-medium text-everypay-600 hover:text-everypay-900 border border-everypay-200 rounded-md transition-colors whitespace-nowrap"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">TRC-20 network only. Do not send other tokens to this address.</p>
        </div>
      ) : bankAccount ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Linked Bank Account</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="py-2 border-b border-gray-100">
              <p className="text-xs text-gray-500 uppercase">Bank</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{bankAccount.bank}</p>
            </div>
            <div className="py-2 border-b border-gray-100">
              <p className="text-xs text-gray-500 uppercase">Account Name</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{bankAccount.accountName}</p>
            </div>
            <div className="py-2 border-b border-gray-100">
              <p className="text-xs text-gray-500 uppercase">Account Number</p>
              <p className="text-sm font-mono font-medium text-gray-900 mt-1">{bankAccount.accountNumber}</p>
            </div>
            <div className="py-2 border-b border-gray-100">
              <p className="text-xs text-gray-500 uppercase">Routing Code</p>
              <p className="text-sm font-mono font-medium text-gray-900 mt-1">{bankAccount.routing}</p>
            </div>
            {bankAccount.swift && (
              <div className="py-2">
                <p className="text-xs text-gray-500 uppercase">SWIFT / BIC</p>
                <p className="text-sm font-mono font-medium text-gray-900 mt-1">{bankAccount.swift}</p>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Recent Settlement Activity */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Recent Settlement Activity</h2>
          <p className="text-xs text-gray-500">Transactions involving {currency}</p>
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
                    {s.corridor} &rarr; {s.settlementCurrency} &middot; {s.status.replace(/_/g, " ")}
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

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Withdraw USDT</h2>
              <button
                onClick={() => { setShowWithdraw(false); setWithdrawSuccess(false); }}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                &times;
              </button>
            </div>

            {withdrawSuccess ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900">Withdrawal submitted</p>
                <p className="text-xs text-gray-500 mt-1">Processing on TRC-20 network</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Destination Address (TRC-20)</label>
                    <input
                      type="text"
                      value={withdrawAddress}
                      onChange={(e) => setWithdrawAddress(e.target.value)}
                      placeholder="TN..."
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-everypay-500 focus:border-everypay-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Amount (USDT)</label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      max={balance?.available}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-everypay-500 focus:border-everypay-500 outline-none"
                    />
                    {balance && (
                      <p className="text-xs text-gray-500 mt-1">Available: {formatCurrency(balance.available, "USDT")}</p>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-md p-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Network fee</span>
                      <span className="font-mono text-gray-700">~1.00 USDT</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-gray-500">Network</span>
                      <span className="font-mono text-gray-700">TRC-20 (Tron)</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleWithdraw}
                  disabled={!withdrawAddress.trim() || !withdrawAmount || parseFloat(withdrawAmount) <= 0 || withdrawLoading}
                  className="w-full mt-6 px-4 py-2.5 bg-everypay-600 text-white text-sm font-medium rounded-md hover:bg-everypay-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {withdrawLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      Processing...
                    </span>
                  ) : "Confirm Withdrawal"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
