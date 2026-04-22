"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type TaskItem = {
  id: string;
  type: "terms_approval" | "payment_approval" | "counter_approval";
  title: string;
  description: string;
  counterparty: string;
  amount: number;
  currency: string;
  status: "pending" | "approved" | "rejected";
  riskLevel: "green" | "yellow" | "red";
  workflowStep: "initiated" | "risk_check" | "awaiting_approval" | "execution";
  submittedBy: string;
  submittedAt: string;
  round: number;
  procurementId?: string;
  agreementId?: string;
  agreementStatus?: string;
  proposedRate?: number;
  marketRate?: number;
  feeBreakdown?: { fxFee: number; platformFee: number; corridorFee: number; totalFees: number };
};

const TYPE_COLORS: Record<string, string> = {
  terms_approval: "bg-blue-50 text-blue-700 border-blue-100",
  payment_approval: "bg-purple-50 text-purple-700 border-purple-100",
  counter_approval: "bg-amber-50 text-amber-800 border-amber-100",
};

const TYPE_LABELS: Record<string, string> = {
  terms_approval: "Terms Approval",
  payment_approval: "Payment Approval",
  counter_approval: "Counter Approval",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  approved: "bg-green-50 text-green-700 border-green-100",
  rejected: "bg-red-50 text-red-700 border-red-100",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Wait for Sign",
  approved: "Signed",
  rejected: "Rejected",
};

export default function ApprovalsPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

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

  const filteredTasks = filter === "all"
    ? tasks
    : filter === "pending"
      ? pendingTasks
      : filter === "approved"
        ? approvedTasks
        : rejectedTasks;

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
        <h1 className="text-xl font-bold text-gray-900">Tasks</h1>
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

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[
          { value: "pending" as const, label: "Pending" },
          { value: "approved" as const, label: "Approved" },
          { value: "rejected" as const, label: "Rejected" },
          { value: "all" as const, label: "All" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
              filter === f.value
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
          <p className="text-sm text-gray-500 mt-1">No {filter === "all" ? "" : filter.toLowerCase()} tasks.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Task</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Workflow</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{task.id}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{task.title}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${TYPE_COLORS[task.type]}`}>
                      {TYPE_LABELS[task.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-mono font-bold text-gray-900">
                      {task.currency} {task.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border ${STATUS_COLORS[task.status]}`}>
                      {task.status === "pending" && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                      {STATUS_LABELS[task.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <WorkflowStep step={task.workflowStep} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                    {new Date(task.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    {task.status === "pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/approvals/${task.agreementId}?userId=${userId}&action=review`}
                          className="px-3 py-1 rounded-lg text-xs font-medium text-everypay-600 hover:bg-everypay-50 transition-colors"
                        >
                          Review
                        </Link>
                        <button
                          onClick={() => handleQuickAction(task, "approve", userId, setTasks)}
                          className="px-3 py-1 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors"
                        >
                          Sign
                        </button>
                      </div>
                    ) : (
                      <Link
                        href={`/approvals/${task.agreementId}?userId=${userId}`}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        View →
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
  );
}

function WorkflowStep({ step }: { step: string }) {
  const steps: Record<string, { label: string; color: string }> = {
    initiated: { label: "Initiated", color: "text-green-600" },
    risk_check: { label: "Risk Check", color: "text-green-600" },
    awaiting_approval: { label: "Awaiting Sign", color: "text-amber-600" },
    execution: { label: "Execution", color: "text-gray-400" },
  };
  const s = steps[step] || steps.initiated;
  return (
    <span className={`text-xs font-medium ${s.color}`}>
      {s.label}
    </span>
  );
}

async function handleQuickAction(
  task: TaskItem,
  action: "approve" | "reject",
  userId: string,
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>,
) {
  if (!task.agreementId) return;
  const apiAction = action === "approve" ? "approve" : "reject_approval";
  try {
    const res = await fetch(`/api/payment-agreements/${task.agreementId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: apiAction, userId }),
    });
    const result = await res.json();
    if (result.status === "success") {
      const queueRes = await fetch(`/api/approvals/queue?userId=${userId}`);
      const queueData = await queueRes.json();
      if (queueData.data) setTasks(queueData.data as TaskItem[]);
    }
  } catch {
    // Error handled silently
  }
}
