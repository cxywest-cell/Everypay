"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Procurement } from "@/lib/types";

type ActivityType = "SALE" | "PROCUREMENT";

type UnifiedTask = {
  type: ActivityType;
  id: string;
  counterparty: string;
  amount: string;
  currency: string;
  status: string;
  date: string;
  href: string;
};

const TYPE_LABELS: Record<ActivityType, string> = {
  SALE: "Sale",
  PROCUREMENT: "Procurement",
};

const TYPE_COLORS: Record<ActivityType, string> = {
  SALE: "bg-green-100 text-green-700",
  PROCUREMENT: "bg-blue-100 text-blue-700",
};

const PROCUREMENT_STATUS_COLORS: Record<string, string> = {
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
  DISPUTED: "bg-red-100 text-red-800",
};

function getStatusColor(type: ActivityType, status: string): string {
  return PROCUREMENT_STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
}

function formatStatus(status: string): string {
  return status.replace(/_/g, " ");
}

export default function ActivitiesPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<UnifiedTask[]>([]);
  const [typeFilter, setTypeFilter] = useState<ActivityType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetch(`/api/procurements?userId=${userId}`)
      .then((r) => r.json())
      .then((procurementsRes) => {
        const procurements = (procurementsRes.data || []) as Procurement[];
        const unified: UnifiedTask[] = [];

        procurements.forEach((p) => {
          const role = p.buyerId === userId ? "buyer" : "seller";
          if (role === "buyer") {
            unified.push({
              type: "PROCUREMENT",
              id: p.id,
              counterparty: p.sellerId,
              amount: `${p.totalAmount.toLocaleString()}`,
              currency: p.currency,
              status: p.status,
              date: p.createdAt?.toString() || "",
              href: `/trading/${p.id}`,
            });
          } else if (role === "seller") {
            unified.push({
              type: "SALE",
              id: p.id,
              counterparty: p.buyerId,
              amount: `${p.totalAmount.toLocaleString()}`,
              currency: p.currency,
              status: p.status,
              date: p.createdAt?.toString() || "",
              href: `/trading/${p.id}`,
            });
          }
        });

        unified.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTasks(unified);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  let filtered = tasks;
  if (typeFilter !== "all") {
    filtered = filtered.filter((t) => t.type === typeFilter);
  }
  if (statusFilter !== "all") {
    if (statusFilter === "active") {
      const activeStatuses = ["DRAFT", "SENT_TO_SELLER", "SELLER_RESPONDED", "TERMS_PROPOSED", "NEGOTIATING"];
      filtered = filtered.filter((t) => activeStatuses.includes(t.status));
    } else if (statusFilter === "completed") {
      const completedStatuses = ["TERMS_ACCEPTED", "SETTLED", "RECEIVED"];
      filtered = filtered.filter((t) => completedStatuses.includes(t.status));
    } else {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }
  }

  const counts = {
    all: tasks.length,
    SALE: tasks.filter((t) => t.type === "SALE").length,
    PROCUREMENT: tasks.filter((t) => t.type === "PROCUREMENT").length,
  };

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
        <h1 className="text-xl font-semibold text-gray-900">Activities</h1>
        <Link
          href={`/trading/create?userId=${userId}`}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-everypay-600 hover:bg-everypay-700"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Activity
        </Link>
      </div>

      {/* Type tabs */}
      <div className="flex space-x-2 mb-3">
        {(
          [
            { value: "all" as const, label: "All" },
            { value: "SALE" as const, label: "Sale" },
            { value: "PROCUREMENT" as const, label: "Procurement" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setTypeFilter(tab.value); setStatusFilter("all"); }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
              typeFilter === tab.value
                ? "bg-everypay-100 text-everypay-800 border-everypay-300"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {tab.label}
            <span className="ml-1 text-xs opacity-60">({counts[tab.value]})</span>
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex space-x-2 mb-6">
        {[
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
          { value: "completed", label: "Completed" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
              statusFilter === f.value
                ? "bg-everypay-100 text-everypay-800 border-everypay-300"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 py-16 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No activities yet</h3>
          <p className="mt-1 text-sm text-gray-500">Create your first trading activity to get started.</p>
          <div className="mt-6">
            <Link
              href={`/trading/create?userId=${userId}`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-everypay-600 hover:bg-everypay-700"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Activity
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Counterparty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((task) => (
                <tr key={`${task.type}-${task.id}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[task.type]}`}>
                      {TYPE_LABELS[task.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">{task.id}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{task.counterparty}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-mono font-medium text-gray-900">
                      {task.currency} {task.amount}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.type, task.status)}`}>
                      {formatStatus(task.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(task.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`${task.href}?userId=${userId}`} className="text-everypay-600 hover:text-everypay-900">
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
