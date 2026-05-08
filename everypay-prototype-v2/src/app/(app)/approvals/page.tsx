"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type ActivityType = "settlement" | "payment_agreement" | "procurement" | "sale";

type TaskItem = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  proposer: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  procurementId?: string;
  settlementId?: string;
  agreementId?: string;
  agreementStatus?: string;
};

const TYPE_COLORS: Record<ActivityType, string> = {
  settlement: "bg-indigo-100 text-indigo-700",
  payment_agreement: "bg-purple-100 text-purple-700",
  procurement: "bg-blue-100 text-blue-700",
  sale: "bg-green-100 text-green-700",
};

const TYPE_LABELS: Record<ActivityType, string> = {
  settlement: "Settlement",
  payment_agreement: "Payment Agreement",
  procurement: "Procurement",
  sale: "Sale",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  approved: "bg-green-50 text-green-700 border-green-100",
  rejected: "bg-red-50 text-red-700 border-red-100",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export default function ApprovalsPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";
  const orgParam = searchParams.get("org");

  const PENDING_ORGS = new Set(["org-beta", "org-delta"]);
  if (typeof window !== "undefined" && PENDING_ORGS.has(orgParam || "")) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("userId", userId);
    params.set("org", orgParam!);
    window.location.href = `/compliance-pending?${params.toString()}`;
    return null;
  }

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [typeFilter, setTypeFilter] = useState<ActivityType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    fetch(`/api/approvals/queue?userId=${userId}`)
      .then((r) => r.json())
      .then((result) => {
        if (result.data) setTasks(result.data as TaskItem[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const approvedTasks = tasks.filter((t) => t.status === "approved");
  const rejectedTasks = tasks.filter((t) => t.status === "rejected");

  let filteredTasks = statusFilter === "all"
    ? tasks
    : statusFilter === "pending"
      ? pendingTasks
      : statusFilter === "approved"
        ? approvedTasks
        : rejectedTasks;

  if (typeFilter !== "all") {
    filteredTasks = filteredTasks.filter((t) => t.type === typeFilter);
  }

  const counts = {
    all: tasks.length,
    settlement: tasks.filter((t) => t.type === "settlement").length,
    payment_agreement: tasks.filter((t) => t.type === "payment_agreement").length,
    procurement: tasks.filter((t) => t.type === "procurement").length,
    sale: tasks.filter((t) => t.type === "sale").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Task Review</h1>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium">Pending</p>
          <p className="text-xl font-bold font-mono text-amber-600 mt-1">{pendingTasks.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium">Approved</p>
          <p className="text-xl font-bold font-mono text-green-600 mt-1">{approvedTasks.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium">Rejected</p>
          <p className="text-xl font-bold font-mono text-red-600 mt-1">{rejectedTasks.length}</p>
        </div>
      </div>

      {/* Type filter */}
      <div className="flex gap-2 flex-wrap">
        {(
          [
            { value: "all" as const, label: "All" },
            { value: "settlement" as const, label: "Settlement" },
            { value: "payment_agreement" as const, label: "Payment Agreement" },
            { value: "procurement" as const, label: "Procurement" },
            { value: "sale" as const, label: "Sale" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.value}
            onClick={() => setTypeFilter(tab.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
              typeFilter === tab.value
                ? "bg-everypay-100 text-everypay-800 border-everypay-300"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {tab.label}
            <span className="ml-1 text-xs opacity-60">({counts[tab.value === "all" ? "all" : tab.value]})</span>
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex gap-2">
        {[
          { value: "all" as const, label: "All Status" },
          { value: "pending" as const, label: "Pending" },
          { value: "approved" as const, label: "Approved" },
          { value: "rejected" as const, label: "Rejected" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
              statusFilter === f.value
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task table */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <svg className="mx-auto h-12 w-12 text-green-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-medium text-gray-900">All caught up!</h3>
          <p className="text-sm text-gray-500 mt-1">No tasks to show.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Task</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Proposer</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-mono font-semibold text-gray-900">{task.id}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{task.title}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[task.type]}`}>
                      {TYPE_LABELS[task.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{task.proposer}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${STATUS_COLORS[task.status]}`}>
                      {task.status === "pending" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                      {STATUS_LABELS[task.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                    {new Date(task.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={
                        task.settlementId ? `/settlements/${task.settlementId}?userId=${userId}${orgParam ? `&org=${orgParam}` : ""}`
                        : task.agreementId ? `/approvals/${task.agreementId}?userId=${userId}&action=review${orgParam ? `&org=${orgParam}` : ""}`
                        : task.procurementId ? `/trading/${task.procurementId}?userId=${userId}${orgParam ? `&org=${orgParam}` : ""}`
                        : `/approvals?userId=${userId}${orgParam ? `&org=${orgParam}` : ""}`
                      }
                      className="text-everypay-600 hover:text-everypay-900"
                    >
                      Review
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
