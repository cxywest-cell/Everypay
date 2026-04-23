"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { ApprovalChain, Approver } from "@/lib/types";

const FLOW_TYPES = [
  { key: "SETTLEMENT", label: "Settlement Approval", desc: "Approve outgoing settlement payments" },
  { key: "PAYMENT_TERMS", label: "Payment Terms Approval", desc: "Review and approve payment terms with counterparties" },
  { key: "ACTIVITY", label: "Sale & Procurement Approval", desc: "Approve new trading activities and procurement orders" },
];

export default function ApprovalFlowPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";
  const [loading, setLoading] = useState(true);
  const [chains, setChains] = useState<ApprovalChain[]>([]);
  const [users, setUsers] = useState<Array<{ id: string; firstName: string; lastName: string; roles: string[]; organizationId: string | null; walletAddress: string | null }>>([]);
  const [saving, setSaving] = useState(false);
  const [addUserOpenFor, setAddUserOpenFor] = useState<string | null>(null);
  const [addUserId, setAddUserId] = useState("");
  const [pendingConfirmations, setPendingConfirmations] = useState<Set<string>>(new Set());
  const [confirmedSuccess, setConfirmedSuccess] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/approvals").then((r) => r.json()),
      fetch("/api/users").then((r) => r.json()).catch(() => ({ data: [] })),
    ])
      .then(([chainsRes, usersRes]) => {
        if (chainsRes.data) setChains(chainsRes.data as ApprovalChain[]);
        if (usersRes.data) setUsers(usersRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const orgId = "org-alpha";
  const orgUsers = users.filter((u) => u.organizationId === orgId);

  const getChain = (type: string) => chains.find((c) => c.organizationId === orgId && c.type === type) || null;

  const markModified = (type: string) => {
    setPendingConfirmations((prev) => new Set(prev).add(type));
  };

  const handleConfirm = async (type: string, chainId: string) => {
    setSaving(true);
    try {
      await fetch("/api/approvals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chainId, status: "active" }),
      });
      setPendingConfirmations((prev) => {
        const next = new Set(prev);
        next.delete(type);
        return next;
      });
      const res = await fetch("/api/approvals").then((r) => r.json());
      if (res.data) setChains(res.data);
      setConfirmedSuccess(type);
      setTimeout(() => setConfirmedSuccess(null), 3000);
    } catch {
      // Error handled silently
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (type: string, chainId: string) => {
    setSaving(true);
    try {
      await fetch("/api/approvals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chainId, status: "active" }),
      });
      setPendingConfirmations((prev) => {
        const next = new Set(prev);
        next.delete(type);
        return next;
      });
      const res = await fetch("/api/approvals").then((r) => r.json());
      if (res.data) setChains(res.data);
    } catch {
      // Error handled silently
    } finally {
      setSaving(false);
    }
  };

  const handleAddApprover = async (chainId: string) => {
    if (!addUserId) return;
    setSaving(true);
    try {
      const chain = chains.find((c) => c.id === chainId);
      const nextOrder = chain ? chain.approvers.length + 1 : 1;
      await fetch("/api/approvals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chainId, addApproverUserId: addUserId, approverOrder: nextOrder, status: "draft" }),
      });
      const res = await fetch("/api/approvals").then((r) => r.json());
      if (res.data) setChains(res.data);
      setAddUserOpenFor(null);
      setAddUserId("");
      markModified(getChainType(chainId));
    } catch {
      // Error handled silently
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveApprover = async (chainId: string, userIdToRemove: string) => {
    setSaving(true);
    try {
      await fetch("/api/approvals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chainId, removeApproverUserId: userIdToRemove, status: "draft" }),
      });
      const res = await fetch("/api/approvals").then((r) => r.json());
      if (res.data) setChains(res.data);
      markModified(getChainType(chainId));
    } catch {
      // Error handled silently
    } finally {
      setSaving(false);
    }
  };

  const handleMoveApprover = async (chainId: string, userIdToMove: string, direction: "up" | "down") => {
    setSaving(true);
    try {
      await fetch("/api/approvals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chainId, moveApproverUserId: userIdToMove, moveDirection: direction, status: "draft" }),
      });
      const res = await fetch("/api/approvals").then((r) => r.json());
      if (res.data) setChains(res.data);
      markModified(getChainType(chainId));
    } catch {
      // Error handled silently
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Approval Flows</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configure separate approval sequences for settlements, payment terms, and activities.</p>
      </div>

      {/* Success banner */}
      {confirmedSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
          {FLOW_TYPES.find((f) => f.key === confirmedSuccess)?.label} confirmed successfully.
        </div>
      )}

      {/* Flow type cards */}
      <div className="space-y-4">
        {FLOW_TYPES.map((ft) => {
          const chain = getChain(ft.key);
          const isOpen = addUserOpenFor === ft.key;
          const isPending = pendingConfirmations.has(ft.key);
          const sortedApprovers = chain ? [...chain.approvers].sort((a, b) => a.order - b.order) : [];
          const showWallets = ft.key === "SETTLEMENT";

          return (
            <div key={ft.key} className={`bg-white rounded-lg border overflow-hidden transition-colors ${isPending ? "border-amber-300 ring-1 ring-amber-100" : "border-gray-200"}`}>
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">{ft.label}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{ft.desc}</p>
                  </div>
                  {/* Status badge */}
                  {isPending ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                      Pending Confirmation
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Active
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isPending && (
                    <>
                      <button
                        onClick={() => chain && handleCancel(ft.key, chain.id)}
                        disabled={saving}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 disabled:opacity-50"
                      >
                        {saving ? "Cancelling..." : "Cancel"}
                      </button>
                      <button
                        onClick={() => chain && handleConfirm(ft.key, chain.id)}
                        disabled={saving}
                        className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        {saving ? "Confirming..." : "Confirm"}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setAddUserOpenFor(isOpen ? null : ft.key)}
                    className="text-sm text-everypay-600 hover:text-everypay-900 font-medium"
                  >
                    + Add Approver
                  </button>
                </div>
              </div>

              {/* Add approver dropdown */}
              {isOpen && (
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <div className="flex gap-2">
                    <select
                      value={addUserId}
                      onChange={(e) => setAddUserId(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                      <option value="">Select user...</option>
                      {orgUsers
                        .filter((u) => !chain?.approvers.some((a) => a.userId === u.id))
                        .filter((u) => u.roles.includes("APPROVER") || u.roles.includes("ADMIN"))
                        .map((u) => (
                          <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
                        ))}
                    </select>
                    <button
                      onClick={() => chain && handleAddApprover(chain.id)}
                      disabled={saving || !addUserId}
                      className="px-4 py-2 bg-everypay-600 text-white text-sm font-medium rounded-lg hover:bg-everypay-700 disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Approvers */}
              {sortedApprovers.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-gray-400">No approvers configured.</p>
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {sortedApprovers.map((approver, i) => (
                    <ApproverRow
                      key={approver.userId}
                      approver={approver}
                      index={i}
                      total={sortedApprovers.length}
                      users={users}
                      chainId={chain!.id}
                      saving={saving}
                      showWallet={showWallets}
                      onMove={handleMoveApprover}
                      onRemove={handleRemoveApprover}
                    />
                  ))}
                </div>
              )}

              {/* Flow diagram */}
              {sortedApprovers.length > 0 && (
                <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
                  <p className="text-xs font-medium text-gray-500 mb-2">Flow</p>
                  <div className="flex items-center gap-1 text-xs flex-wrap">
                    <span className="px-2 py-1 bg-gray-200 rounded text-gray-600 font-medium">Proposed</span>
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="px-2 py-1 bg-yellow-50 rounded text-yellow-700 font-medium">
                      {sortedApprovers.map((a, i) => (
                        <span key={a.userId}>
                          {i > 0 && <span className="text-gray-400 mx-0.5"> → </span>}
                          #{a.order}
                        </span>
                      ))}
                    </span>
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="px-2 py-1 bg-green-50 rounded text-green-700 font-medium">Approved</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getChainType(chainId: string) {
  if (chainId.includes("settlement")) return "SETTLEMENT";
  if (chainId.includes("terms")) return "PAYMENT_TERMS";
  return "ACTIVITY";
}

function ApproverRow({
  approver,
  index,
  total,
  users,
  chainId,
  saving,
  showWallet,
  onMove,
  onRemove,
}: {
  approver: Approver;
  index: number;
  total: number;
  users: Array<{ id: string; firstName: string; lastName: string; walletAddress: string | null }>;
  chainId: string;
  saving: boolean;
  showWallet: boolean;
  onMove: (chainId: string, userId: string, direction: "up" | "down") => void;
  onRemove: (chainId: string, userId: string) => void;
}) {
  const u = users.find((u) => u.id === approver.userId);
  const name = u ? `${u.firstName} ${u.lastName}` : approver.userId;
  const wallet = showWallet && u?.walletAddress ? u.walletAddress : null;

  return (
    <div className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-lg border border-gray-100">
      {/* Order badge */}
      <div className="w-7 h-7 rounded-full bg-everypay-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
        {approver.order}
      </div>

      {/* Connector arrow */}
      {index > 0 && (
        <svg className="w-4 h-4 text-gray-300 -mx-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{name}</p>
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-500">{approver.userId}</p>
          {wallet && (
            <span className="text-xs font-mono text-everypay-600 bg-everypay-50 px-1.5 py-0.5 rounded">{wallet}</span>
          )}
        </div>
      </div>

      {/* Move controls */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => onMove(chainId, approver.userId, "up")}
          disabled={saving || index === 0}
          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
          title="Move up"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={() => onMove(chainId, approver.userId, "down")}
          disabled={saving || index === total - 1}
          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
          title="Move down"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(chainId, approver.userId)}
        disabled={saving}
        className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-50"
        title="Remove"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
