"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type ApprovalChain = {
  id: string;
  organizationId: string;
  threshold: number;
  approvers: Array<{
    userId: string;
    role: string;
    order: number;
    status: string;
    comment: string | null;
    timestamp: string | null;
  }>;
  createdAt: string;
  updatedAt: string;
};

export default function ApprovalsPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-3";
  const [chains, setChains] = useState<ApprovalChain[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [orgId, setOrgId] = useState("org-beta");
  const [threshold, setThreshold] = useState(100000);
  const [comment, setComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetch("/api/approvals")
      .then((res) => res.json())
      .then((result) => {
        if (result.data) setChains(result.data as ApprovalChain[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    try {
      const res = await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: orgId,
          threshold,
          approvers: [{ userId, role: "APPROVER", order: 1 }],
        }),
      });
      const result = await res.json();
      if (result.status === "success" && result.data) {
        setChains([...chains, result.data as ApprovalChain]);
        setShowCreate(false);
      }
    } catch {
      // Error handled silently
    }
  };

  const handleAction = async (chainId: string, action: "approve" | "reject") => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/approvals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chainId,
          approverUserId: userId,
          action,
          comment: comment || `${action}d by approver`,
        }),
      });
      const result = await res.json();
      if (result.status === "success" && result.data) {
        setChains(
          chains.map((c) => (c.id === chainId ? (result.data as ApprovalChain) : c))
        );
        setComment("");
      }
    } catch {
      // Error handled silently
    } finally {
      setActionLoading(false);
    }
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
            <h1 className="text-xl font-semibold text-gray-900">Approval Workflow</h1>
            <p className="text-sm text-gray-500">Review and approve high-value settlements</p>
          </div>
          <div className="flex space-x-3">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2">
              &larr; Home
            </Link>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="px-4 py-2 bg-everypay-600 text-white text-sm font-medium rounded-md hover:bg-everypay-700"
            >
              New Approval Chain
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create form */}
        {showCreate && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <h2 className="text-sm font-medium text-gray-900 mb-4">Create Approval Chain</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization ID</label>
                <input
                  type="text"
                  value={orgId}
                  onChange={(e) => setOrgId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Threshold (USD)</label>
                <input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700">
                Cancel
              </button>
              <button onClick={handleCreate} className="px-4 py-2 bg-everypay-600 text-white rounded-md text-sm hover:bg-everypay-700">
                Create
              </button>
            </div>
          </div>
        )}

        {/* Approval chains */}
        {chains.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-200 py-16 text-center">
            <h3 className="text-sm font-medium text-gray-900">No approval chains</h3>
            <p className="mt-1 text-sm text-gray-500">Create an approval chain for high-value settlements.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chains.map((chain) => (
              <div key={chain.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{chain.id}</h3>
                    <p className="text-xs text-gray-500">
                      Org: {chain.organizationId} &middot; Threshold: ${chain.threshold.toLocaleString()}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    Created {new Date(chain.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Approvers */}
                <div className="space-y-2">
                  {chain.approvers.map((approver, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-medium text-gray-500 w-16">Order {approver.order}</span>
                        <span className="text-sm text-gray-900">{approver.userId}</span>
                        <span className="text-xs text-gray-400">{approver.role}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          approver.status === "approved" ? "bg-green-100 text-green-800"
                            : approver.status === "rejected" ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {approver.status}
                        </span>
                        {approver.comment && (
                          <span className="text-xs text-gray-500 max-w-48 truncate">{approver.comment}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action for pending approver */}
                {chain.approvers.some((a) => a.userId === userId && a.status === "pending") && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mb-2"
                      placeholder="Add a comment (optional)"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAction(chain.id, "approve")}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(chain.id, "reject")}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
