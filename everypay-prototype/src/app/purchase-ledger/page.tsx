"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Invoice } from "@/lib/types";

export default function PurchaseLedgerPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "SENT" | "PAID" | "OVERDUE">("all");

  useEffect(() => {
    fetch(`/api/invoices?buyerId=${userId}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.data) setInvoices(result.data as Invoice[]);
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

  const STATUS_COLORS: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-800",
    SENT: "bg-blue-100 text-blue-800",
    PAID: "bg-green-100 text-green-800",
    OVERDUE: "bg-red-100 text-red-800",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Purchase Ledger</h1>
            <p className="text-sm text-gray-500">Manage your invoices and payment obligations</p>
          </div>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">&larr; Home</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex space-x-2 mb-6">
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

        {/* Balance summary per seller */}
        {Object.keys(totalBySeller).length > 0 && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Balance by Seller</h2>
            <div className="space-y-3">
              {Object.entries(totalBySeller).map(([sellerId, totals]) => {
                const balance = totals.billed - totals.paid;
                return (
                  <div key={sellerId} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-900">{sellerId}</span>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-500">Billed: ${totals.billed.toLocaleString()}</span>
                      <span className="text-gray-500">Paid: ${totals.paid.toLocaleString()}</span>
                      <span className={`font-mono font-medium ${balance > 0 ? "text-red-600" : "text-green-600"}`}>
                        Balance: ${balance.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
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
                      <Link href={`/invoices/${invoice.id}`} className="text-everypay-600 hover:text-everypay-900">
                        View
                      </Link>
                      {invoice.status === "SENT" && (
                        <span className="ml-3 text-gray-400">|</span>
                      )}
                      {invoice.status === "SENT" && (
                        <Link
                          href={`/payment-agreements/new?invoiceId=${invoice.id}&sellerId=${invoice.sellerId}&buyerId=${invoice.buyerId}&amount=${invoice.totalAmount}`}
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
    </div>
  );
}
