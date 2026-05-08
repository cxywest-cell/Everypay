"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { ApprovalChain } from "@/lib/types";

export default function ApprovalTeamPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";
  const [loading, setLoading] = useState(true);
  const [chains, setChains] = useState<ApprovalChain[]>([]);
  const [organizations, setOrganizations] = useState<Array<{ id: string; name: string }>>([]);
  const [users, setUsers] = useState<Array<{ id: string; firstName: string; lastName: string; organizationId: string | null }>>([]);
  const [editingThreshold, setEditingThreshold] = useState<string | null>(null);
  const [thresholdValue, setThresholdValue] = useState(0);
  const [saving, setSaving] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState<string | null>(null);
  const [addUserId, setAddUserId] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/approvals").then((r) => r.json()),
      fetch("/api/organizations").then((r) => r.json()),
      fetch("/api/users").then((r) => r.json()).catch(() => ({ data: [] })),
    ])
      .then(([chainsRes, orgsRes, usersRes]) => {
        if (chainsRes.data) setChains(chainsRes.data as ApprovalChain[]);
        if (orgsRes.data) setOrganizations(orgsRes.data);
        if (usersRes.data) setUsers(usersRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveThreshold = async (chainId: string) => {
    setSaving(true);
    try {
      await fetch("/api/approvals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chainId, threshold: thresholdValue }),
      });
      const res = await fetch("/api/approvals").then((r) => r.json());
      if (res.data) setChains(res.data);
      setEditingThreshold(null);
      showSuccess();
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
      await fetch("/api/approvals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chainId, addApproverUserId: addUserId }),
      });
      const res = await fetch("/api/approvals").then((r) => r.json());
      if (res.data) setChains(res.data);
      setAddUserOpen(null);
      setAddUserId("");
      showSuccess();
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
        body: JSON.stringify({ chainId, removeApproverUserId: userIdToRemove }),
      });
      const res = await fetch("/api/approvals").then((r) => r.json());
      if (res.data) setChains(res.data);
      showSuccess();
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
        body: JSON.stringify({ chainId, moveApproverUserId: userIdToMove, moveDirection: direction }),
      });
      const res = await fetch("/api/approvals").then((r) => r.json());
      if (res.data) setChains(res.data);
    } catch {
      // Error handled silently
    } finally {
      setSaving(false);
    }
  };

  const showSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getUserName = (userIdStr: string) => {
    const u = users.find((u) => u.id === userIdStr);
    return u ? `${u.firstName} ${u.lastName}` : userIdStr;
  };

  const getOrgUsers = (orgId: string) => {
    return users.filter((u) => u.organizationId === orgId);
  };

  const getOrgName = (orgId: string) => {
    return organizations.find((o) => o.id === orgId)?.name || orgId;
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
        <div>
          <h1 className="text-xl font-bold text-gray-900">Approval & Review Team Setup</h1>
          <p className="text-sm text-gray-500 mt-1">Configure approval chains, thresholds, and reviewers per organization</p>
        </div>
      </div>

      {/* Success banner */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          Changes saved successfully.
        </div>
      )}

      {/* Info banner */}
      <div className="bg-everypay-50 border border-everypay-200 rounded-xl p-4">
        <h3 className="text-sm font-medium text-everypay-900 mb-1">How Approval Flows Work</h3>
        <p className="text-sm text-everypay-700 leading-relaxed">
          When a payment agreement is created, the system checks the proposer's organization threshold.
          If the amount exceeds the threshold, the proposal enters the internal approval queue before
          being sent to the counterparty. Once approved, the status moves to{" "}
          <code className="bg-everypay-100 px-1.5 py-0.5 rounded text-xs">SENT_TO_BUYER</code> or{" "}
          <code className="bg-everypay-100 px-1.5 py-0.5 rounded text-xs">SENT_TO_SELLER</code>.
        </p>
      </div>

      {/* Approval chains */}
      <div className="space-y-6">
        {chains.map((chain) => (
          <div key={chain.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Chain header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">{getOrgName(chain.organizationId)}</h2>
                <p className="text-xs text-gray-500 mt-0.5">Chain: {chain.id}</p>
              </div>
              {editingThreshold === chain.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={thresholdValue}
                    onChange={(e) => setThresholdValue(parseInt(e.target.value) || 0)}
                    className="w-36 rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                    placeholder="Threshold"
                    autoFocus
                  />
                  <button
                    onClick={() => setEditingThreshold(null)}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveThreshold(chain.id)}
                    disabled={saving}
                    className="px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditingThreshold(chain.id);
                    setThresholdValue(chain.threshold);
                  }}
                  className="text-sm text-everypay-600 hover:text-everypay-900 font-medium"
                >
                  Edit Threshold
                </button>
              )}
            </div>

            <div className="p-6">
              {/* Threshold display */}
              {editingThreshold !== chain.id && (
                <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Approval Threshold</p>
                  <p className="text-lg font-mono font-bold text-gray-900">
                    USD {chain.threshold.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Payment agreements above this amount require internal team approval
                  </p>
                </div>
              )}

              {/* Approvers list */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Reviewers & Approvers</h3>
                  <button
                    onClick={() => setAddUserOpen(addUserOpen === chain.id ? null : chain.id)}
                    className="text-sm text-everypay-600 hover:text-everypay-900 font-medium"
                  >
                    + Add Approver
                  </button>
                </div>

                {/* Add approver dropdown */}
                {addUserOpen === chain.id && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Select a user from this organization</p>
                    <div className="flex gap-2">
                      <select
                        value={addUserId}
                        onChange={(e) => setAddUserId(e.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="">Select user...</option>
                        {getOrgUsers(chain.organizationId)
                          .filter((u) => !chain.approvers.some((a) => a.userId === u.id))
                          .map((u) => (
                            <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.id})</option>
                          ))}
                      </select>
                      <button
                        onClick={() => handleAddApprover(chain.id)}
                        disabled={saving || !addUserId}
                        className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {/* Approvers */}
                {chain.approvers.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">No approvers configured</p>
                ) : (
                  <div className="space-y-2">
                    {chain.approvers
                      .sort((a, b) => a.order - b.order)
                      .map((approver, i) => (
                        <div key={i} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-everypay-100 text-everypay-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {approver.order}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {getUserName(approver.userId)}
                              </p>
                              <p className="text-xs text-gray-500">{approver.userId} &middot; {approver.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Move up/down */}
                            <div className="flex flex-col">
                              <button
                                onClick={() => handleMoveApprover(chain.id, approver.userId, "up")}
                                disabled={saving || i === 0}
                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-0.5"
                                title="Move up"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleMoveApprover(chain.id, approver.userId, "down")}
                                disabled={saving || i === chain.approvers.length - 1}
                                className="text-gray-400 hover:text-gray-600 disabled:opacity-30 p-0.5"
                                title="Move down"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div>

                            {/* Status badge */}
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              approver.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : approver.status === "approved"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                            }`}>
                              {approver.status}
                            </span>

                            {/* Remove */}
                            <button
                              onClick={() => handleRemoveApprover(chain.id, approver.userId)}
                              disabled={saving}
                              className="text-gray-400 hover:text-red-600 disabled:opacity-50 ml-1"
                              title="Remove approver"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Flow diagram */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-700 mb-3">Approval Flow</p>
                <div className="flex items-center gap-1 text-sm flex-wrap">
                  <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs text-gray-600 font-medium">
                    PROPOSED
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="px-2.5 py-1 bg-yellow-50 rounded-lg text-xs text-yellow-700 font-medium">
                    Internal Review
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="px-2.5 py-1 bg-everypay-50 rounded-lg text-xs text-everypay-700 font-medium">
                    SENT_TO_COUNTERPARTY
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="px-2.5 py-1 bg-green-50 rounded-lg text-xs text-green-700 font-medium">
                    ACCEPTED
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {chains.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
            <p className="text-sm text-gray-400">No approval chains configured</p>
          </div>
        )}
      </div>

      {/* Auto-Approval Rules */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-base font-bold text-gray-900">Auto-Approval Rules</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
            <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Below Threshold</p>
              <p className="text-xs text-gray-600 mt-0.5">
                Payment agreements below the org threshold are auto-approved and sent directly to the counterparty.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
            <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Above Threshold</p>
              <p className="text-xs text-gray-600 mt-0.5">
                Proposals enter the internal approval queue. An approver must review and approve before the counterparty sees them.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
            <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Counter-Proposals</p>
              <p className="text-xs text-gray-600 mt-0.5">
                When the counterparty counters, the new proposal goes back through the other side's approval chain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
