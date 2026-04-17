"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { Procurement, ProcurementStatus } from "@/lib/types";

const STATUS_COLORS: Record<ProcurementStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  SENT_TO_SELLER: "bg-blue-100 text-blue-800",
  SELLER_RESPONDED: "bg-purple-100 text-purple-800",
  TERMS_PROPOSED: "bg-amber-100 text-amber-800",
  NEGOTIATING: "bg-orange-100 text-orange-800",
  TERMS_ACCEPTED: "bg-green-100 text-green-800",
  PAYMENT_INITIATED: "bg-indigo-100 text-indigo-800",
  IN_TRANSIT: "bg-sky-100 text-sky-800",
  RECEIVED: "bg-emerald-100 text-emerald-800",
  SETTLED: "bg-teal-100 text-teal-800",
};

const STATUS_LABELS: Record<ProcurementStatus, string> = {
  DRAFT: "Draft",
  SENT_TO_SELLER: "Sent to Seller",
  SELLER_RESPONDED: "Seller Responded",
  TERMS_PROPOSED: "Terms Proposed",
  NEGOTIATING: "Negotiating",
  TERMS_ACCEPTED: "Terms Accepted",
  PAYMENT_INITIATED: "Payment Initiated",
  IN_TRANSIT: "In Transit",
  RECEIVED: "Received",
  SETTLED: "Settled",
};

export default function ProcurementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";
  const [procurements, setProcurements] = useState<Procurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch(`/api/procurements?buyerId=${userId}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.data) {
          setProcurements(result.data as Procurement[]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const activeStatuses = ["DRAFT", "SENT_TO_SELLER", "SELLER_RESPONDED", "TERMS_PROPOSED", "NEGOTIATING"];
  const completedStatuses = ["TERMS_ACCEPTED", "PAYMENT_INITIATED", "IN_TRANSIT", "RECEIVED", "SETTLED"];

  const filteredProcurements =
    filter === "all"
      ? procurements
      : filter === "active"
        ? procurements.filter((p) => activeStatuses.includes(p.status))
        : filter === "completed"
          ? procurements.filter((p) => completedStatuses.includes(p.status))
          : procurements.filter((p) => p.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Procurement</h1>
        <Link
          href={`/procurement/create?userId=${userId}`}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-everypay-600 hover:bg-everypay-700"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Procurement
        </Link>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 mb-6">
        {[
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
          { value: "completed", label: "Completed" },
          { value: "TERMS_PROPOSED", label: "Terms Proposed" },
          { value: "NEGOTIATING", label: "Negotiating" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
              filter === f.value
                ? "bg-everypay-100 text-everypay-800 border-everypay-300"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Procurement List */}
      {filteredProcurements.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 py-16 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No procurements yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create your first procurement order to get started.
          </p>
          <div className="mt-6">
            <Link
              href={`/procurement/create?userId=${userId}`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-everypay-600 hover:bg-everypay-700"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Procurement
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Procurement
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProcurements.map((procurement) => (
                <tr key={procurement.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{procurement.id}</div>
                    <div className="text-xs text-gray-500">
                      {procurement.lineItems.length} item(s)
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{procurement.sellerId}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-mono font-medium text-gray-900">
                      {procurement.currency} {procurement.totalAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_COLORS[procurement.status]
                      }`}
                    >
                      {STATUS_LABELS[procurement.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {procurement.dueDate
                      ? new Date(procurement.dueDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/procurement/${procurement.id}?userId=${userId}`}
                      className="text-everypay-600 hover:text-everypay-900"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
