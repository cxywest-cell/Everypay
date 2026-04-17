"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Invoice, Settlement } from "@/lib/types";

type LedgerTab = "invoices" | "aging" | "fx";

export default function PurchaseLedgerPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "SENT" | "PAID" | "OVERDUE">("all");
  const [activeTab, setActiveTab] = useState<LedgerTab>("invoices");

  useEffect(() => {
    Promise.all([
      fetch(`/api/invoices?buyerId=${userId}`).then((res) => res.json()),
      fetch(`/api/settlements?buyerId=${userId}`).then((res) => res.json()),
    ])
      .then(([invoiceResult, settlementResult]) => {
        if (invoiceResult.data) setInvoices(invoiceResult.data as Invoice[]);
        if (settlementResult.data) setSettlements(settlementResult.data as Settlement[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const filtered = filter === "all" ? invoices : invoices.filter((i) => i.status === filter);

  const totalBySeller = invoices.reduce<Record<string, { billed: number; paid: number }>>((acc, inv) => {
    if (!acc[inv.sellerId]) acc[inv.sellerId] = { billed: 0, paid: 0 };
    acc[inv.sellerId].billed += inv.totalAmount;
    if (inv.status === "PAID") acc[inv.sellerId].paid += inv.totalAmount;
    return acc;
  }, {});

  // Running balance per buyer (FR79)
  const runningBalance = Object.entries(totalBySeller).map(([sellerId, totals]) => ({
    sellerId,
    runningBalance: totals.billed - totals.paid,
    totalBilled: totals.billed,
    totalPaid: totals.paid,
  }));

  // Aging
  const now = new Date();
  const aging = { current: 0, days31to60: 0, days60plus: 0 };
  invoices.forEach((inv) => {
    if (inv.status === "PAID" || inv.status === "DRAFT") return;
    const dueDate = inv.dueDate ? new Date(inv.dueDate) : null;
    if (!dueDate) { aging.current += inv.totalAmount; return; }
    const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysOverdue <= 0) aging.current += inv.totalAmount;
    else if (daysOverdue <= 60) aging.days31to60 += inv.totalAmount;
    else aging.days60plus += inv.totalAmount;
  });

  // FX exposure
  const fxExposure = invoices
    .filter((i) => i.status !== "PAID" && i.status !== "DRAFT")
    .reduce<Record<string, number>>((acc, inv) => {
      acc[inv.currency] = (acc[inv.currency] || 0) + inv.totalAmount;
      return acc;
    }, {});

  const STATUS_COLORS: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-800",
    SENT: "bg-blue-100 text-blue-800",
    PAID: "bg-green-100 text-green-800",
    OVERDUE: "bg-red-100 text-red-800",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  const tabs: { id: LedgerTab; label: string }[] = [
    { id: "invoices", label: "Invoices" },
    { id: "aging", label: "Aging" },
    { id: "fx", label: "FX Exposure" },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Invoices Tab */}
      {activeTab === "invoices" && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {(["all", "SENT", "PAID", "OVERDUE"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                  filter === f
                    ? "bg-everypay-100 text-everypay-800 border-everypay-300"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {f === "all" ? "All" : f === "SENT" ? "Pending" : f === "PAID" ? "Paid" : "Overdue"}
              </button>
            ))}
          </div>

          {/* Running balance per seller */}
          {runningBalance.length > 0 && (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-sm font-medium text-gray-900 mb-3">Running Balance per Seller</h2>
              <div className="space-y-2">
                {runningBalance.map((entry) => (
                  <div key={entry.sellerId} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm font-medium text-gray-900">{entry.sellerId}</span>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-gray-500">Billed: ${entry.totalBilled.toLocaleString()}</span>
                      <span className="text-gray-500">Paid: ${entry.totalPaid.toLocaleString()}</span>
                      <span className={`font-mono font-medium ${entry.runningBalance > 0 ? "text-red-600" : "text-green-600"}`}>
                        Outstanding: ${entry.runningBalance.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoice list */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-lg shadow border border-gray-200 py-16 text-center">
              <h3 className="text-sm font-medium text-gray-900">
                {filter === "SENT" ? "No pending invoices" : "No invoices found"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">All clear — no payment obligations outstanding.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.id}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{invoice.sellerId}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-right text-gray-900">
                        {invoice.currency} {invoice.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[invoice.status]}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/invoices/${invoice.id}?userId=${userId}`} className="text-everypay-600 hover:text-everypay-900">
                          View
                        </Link>
                        {invoice.status === "SENT" && (
                          <Link
                            href={`/payment-agreements/new?invoiceId=${invoice.id}&sellerId=${invoice.sellerId}&buyerId=${invoice.buyerId}&amount=${invoice.totalAmount}&userId=${userId}`}
                            className="ml-3 text-green-600 hover:text-green-900 font-medium"
                          >
                            Pay Now
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Aging Tab */}
      {activeTab === "aging" && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Current (0-30 days)</h3>
              <p className="text-2xl font-mono font-bold text-green-600">${aging.current.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">31-60 days overdue</h3>
              <p className={`text-2xl font-mono font-bold ${aging.days31to60 > 0 ? "text-amber-600" : "text-gray-400"}`}>
                ${aging.days31to60.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">60+ days overdue</h3>
              <p className={`text-2xl font-mono font-bold ${aging.days60plus > 0 ? "text-red-600" : "text-gray-400"}`}>
                ${aging.days60plus.toLocaleString()}
              </p>
            </div>
          </div>
          {invoices.filter((i) => i.status === "OVERDUE").length > 0 && (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-sm font-medium text-gray-900 mb-3">Overdue Invoices</h2>
              <div className="space-y-2">
                {invoices.filter((i) => i.status === "OVERDUE").map((inv) => {
                  const dueDate = inv.dueDate ? new Date(inv.dueDate) : null;
                  const daysOverdue = dueDate ? Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
                  return (
                    <div key={inv.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{inv.id}</span>
                        <span className="ml-2 text-xs text-gray-500">{inv.sellerId}</span>
                        <span className="ml-2 text-xs text-red-500">{daysOverdue} days overdue</span>
                      </div>
                      <span className="font-mono text-sm font-medium">${inv.totalAmount.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FX Exposure Tab */}
      {activeTab === "fx" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-900 mb-4">Currency Holdings</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-md p-4">
                <p className="text-xs text-gray-500">BRL</p>
                <p className="text-lg font-mono font-bold text-gray-900">285,000</p>
              </div>
              <div className="bg-gray-50 rounded-md p-4">
                <p className="text-xs text-gray-500">ARS</p>
                <p className="text-lg font-mono font-bold text-gray-400">0</p>
              </div>
              <div className="bg-gray-50 rounded-md p-4">
                <p className="text-xs text-gray-500">USD Offshore</p>
                <p className="text-lg font-mono font-bold text-gray-900">$52,400</p>
              </div>
              <div className="bg-gray-50 rounded-md p-4">
                <p className="text-xs text-gray-500">USDT</p>
                <p className="text-lg font-mono font-bold text-gray-900">15,000</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-900 mb-4">Open FX Exposure</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(fxExposure).map(([currency, amount]) => (
                <div key={currency} className="bg-gray-50 rounded-md p-4">
                  <p className="text-xs text-gray-500">{currency}</p>
                  <p className="text-lg font-mono font-bold text-gray-900">{amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-900 mb-4">Active Settlements</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Total Open Volume</p>
                <p className="text-xl font-mono font-bold text-gray-900">
                  ${settlements.filter((s) => s.status !== "SETTLED").reduce((s, st) => s + st.fiatAmount, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Active Settlements</p>
                <p className="text-xl font-mono font-bold text-gray-900">
                  {settlements.filter((s) => s.status !== "SETTLED").length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
