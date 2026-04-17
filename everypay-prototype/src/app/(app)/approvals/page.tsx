"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type ApprovalItem = {
  id: string;
  type: "terms" | "prepayment" | "counter_proposal";
  title: string;
  counterparty: string;
  amount: number;
  currency: string;
  status: "pending" | "approved" | "rejected";
  riskLevel: "green" | "yellow" | "red";
  submittedBy: string;
  submittedAt: Date;
  round: number;
  documents: { type: string; name: string }[];
  riskNotes: string[];
  myAction: boolean;
};

type ApprovalTab = "queue" | "settings";

export default function ApprovalsPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-3";
  const [activeTab, setActiveTab] = useState<ApprovalTab>("queue");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ApprovalItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [comment, setComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Mock approval queue
  useEffect(() => {
    setItems([
      {
        id: "APR-001",
        type: "terms",
        title: "Payment Terms — Round 1",
        counterparty: "Wei Zhang (seller)",
        amount: 25000,
        currency: "USD",
        status: "pending",
        riskLevel: "green",
        submittedBy: "user-2",
        submittedAt: new Date(Date.now() - 7200000),
        round: 1,
        documents: [
          { type: "contract", name: "Sales_Contract.pdf" },
          { type: "invoice", name: "Commercial_Invoice.pdf" },
          { type: "po", name: "Purchase_Order.pdf" },
        ],
        riskNotes: ["Counterparty trust score: 92%", "No prior disputes", "Within auto-acceptance threshold"],
        myAction: true,
      },
      {
        id: "APR-002",
        type: "prepayment",
        title: "Pre-Payment Request",
        counterparty: "Carlos Silva (buyer)",
        amount: 45000,
        currency: "USD",
        status: "pending",
        riskLevel: "yellow",
        submittedBy: "user-1",
        submittedAt: new Date(Date.now() - 3600000),
        round: 1,
        documents: [
          { type: "bank_transfer", name: "Bank_Transfer_Receipt.pdf" },
          { type: "invoice", name: "Invoice_INV-007.pdf" },
        ],
        riskNotes: ["Large amount — exceeds $30K threshold", "Buyer has 2 pending settlements", "Rate deviation: 2.3% from market"],
        myAction: true,
      },
      {
        id: "APR-003",
        type: "counter_proposal",
        title: "Counter-Proposal — Round 2",
        counterparty: "Wei Zhang (seller)",
        amount: 12400,
        currency: "USD",
        status: "pending",
        riskLevel: "red",
        submittedBy: "user-2",
        submittedAt: new Date(Date.now() - 1800000),
        round: 2,
        documents: [
          { type: "contract", name: "Revised_Contract_v2.pdf" },
          { type: "invoice", name: "Revised_Invoice_v2.pdf" },
        ],
        riskNotes: ["Rate deviation: 5.1% — exceeds 5% threshold", "Prior dispute with this counterparty", "Corridor BRL: enhanced scrutiny required"],
        myAction: true,
      },
    ]);
    setLoading(false);
  }, []);

  const handleAction = async (itemId: string, action: "approve" | "reject") => {
    if (action === "reject" && !comment.trim()) {
      alert("Rejection reason is required");
      return;
    }
    setActionLoading(true);
    setTimeout(() => {
      setItems(items.map((item) =>
        item.id === itemId ? { ...item, status: action as "approved" | "rejected" } : item
      ));
      setSelectedItem(null);
      setComment("");
      setActionLoading(false);
    }, 500);
  };

  const handleBulkAction = async (action: "approve") => {
    setActionLoading(true);
    setTimeout(() => {
      setItems(items.map((item) =>
        selectedIds.includes(item.id) ? { ...item, status: "approved" as const } : item
      ));
      setSelectedIds([]);
      setBulkMode(false);
      setActionLoading(false);
    }, 500);
  };

  const pendingItems = items.filter((i) => i.status === "pending");
  const approvedItems = items.filter((i) => i.status === "approved");
  const rejectedItems = items.filter((i) => i.status === "rejected");

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => { setActiveTab("queue"); setSelectedItem(null); }}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "queue" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Queue ({pendingItems.length})
        </button>
        <button
          onClick={() => { setActiveTab("settings"); setSelectedItem(null); }}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "settings" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Settings
        </button>
      </div>

      {activeTab === "queue" && !selectedItem && (
        <>
          {/* Risk summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-gray-900">Low Risk</span>
              </div>
              <p className="text-2xl font-mono font-bold text-green-600">
                {pendingItems.filter((i) => i.riskLevel === "green").length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ${pendingItems.filter((i) => i.riskLevel === "green").reduce((s, i) => s + i.amount, 0).toLocaleString()} total
              </p>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm font-medium text-gray-900">Medium Risk</span>
              </div>
              <p className="text-2xl font-mono font-bold text-yellow-600">
                {pendingItems.filter((i) => i.riskLevel === "yellow").length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ${pendingItems.filter((i) => i.riskLevel === "yellow").reduce((s, i) => s + i.amount, 0).toLocaleString()} total
              </p>
            </div>
            <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm font-medium text-gray-900">High Risk</span>
              </div>
              <p className="text-2xl font-mono font-bold text-red-600">
                {pendingItems.filter((i) => i.riskLevel === "red").length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ${pendingItems.filter((i) => i.riskLevel === "red").reduce((s, i) => s + i.amount, 0).toLocaleString()} total
              </p>
            </div>
          </div>

          {/* Bulk actions */}
          {pendingItems.length > 1 && (
            <div className="flex items-center justify-between">
              <button
                onClick={() => setBulkMode(!bulkMode)}
                className="text-sm text-everypay-600 hover:text-everypay-900 font-medium"
              >
                {bulkMode ? "Cancel Bulk" : "Bulk Review"}
              </button>
              {bulkMode && selectedIds.length > 0 && (
                <button
                  onClick={() => handleBulkAction("approve")}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  Approve Selected ({selectedIds.length})
                </button>
              )}
            </div>
          )}

          {/* Approval queue */}
          <div className="space-y-4">
            {pendingItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow border border-gray-200 py-16 text-center">
                <svg className="mx-auto h-12 w-12 text-green-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-sm font-medium text-gray-900">All caught up!</h3>
                <p className="text-sm text-gray-500 mt-1">No pending approvals.</p>
              </div>
            ) : (
              pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between p-5">
                    <div className="flex items-start gap-3">
                      {bulkMode && (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={(e) => {
                            setSelectedIds(
                              e.target.checked
                                ? [...selectedIds, item.id]
                                : selectedIds.filter((id) => id !== item.id)
                            );
                          }}
                          className="mt-1"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-gray-900">{item.id}</h3>
                          <RiskBadge level={item.riskLevel} />
                          <TypeBadge type={item.type} round={item.round} />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.counterparty} &middot; {item.submittedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-mono font-bold text-gray-900">
                      ${item.amount.toLocaleString()} {item.currency}
                    </span>
                  </div>

                  {/* Risk indicators */}
                  <div className="px-5 pb-3">
                    <div className="flex flex-wrap gap-2">
                      {item.riskNotes.map((note, i) => (
                        <span
                          key={i}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            item.riskLevel === "green"
                              ? "bg-green-50 text-green-700"
                              : item.riskLevel === "yellow"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-red-50 text-red-700"
                          }`}
                        >
                          {item.riskLevel === "green" ? "✓" : item.riskLevel === "yellow" ? "⚠" : "✕"} {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Documents preview */}
                  <div className="px-5 pb-3 flex flex-wrap gap-2">
                    {item.documents.map((doc, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                        <DocIcon type={doc.type} /> {doc.name}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-sm text-everypay-600 hover:text-everypay-900 font-medium"
                    >
                      Review Details &rarr;
                    </button>
                    {item.myAction && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setTimeout(() => handleAction(item.id, "approve"), 0);
                          }}
                          disabled={actionLoading}
                          className="px-4 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="px-4 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* History */}
            {approvedItems.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Recently Approved</h3>
                <div className="space-y-2">
                  {approvedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 bg-white rounded-lg border border-gray-200 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm font-medium text-gray-900">{item.id}</span>
                        <span className="text-xs text-gray-500">{item.title}</span>
                      </div>
                      <span className="text-sm font-mono text-gray-600">${item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {rejectedItems.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Rejected</h3>
                <div className="space-y-2">
                  {rejectedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 bg-white rounded-lg border border-gray-200 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-sm font-medium text-gray-900">{item.id}</span>
                        <span className="text-xs text-gray-500">{item.title}</span>
                      </div>
                      <span className="text-sm font-mono text-gray-600">${item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Detail view */}
      {activeTab === "queue" && selectedItem && (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedItem(null)}
            className="text-sm text-everypay-600 hover:text-everypay-900 font-medium"
          >
            &larr; Back to Queue
          </button>

          {/* Item details */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-gray-900">{selectedItem.id}</h2>
                  <RiskBadge level={selectedItem.riskLevel} />
                </div>
                <p className="text-sm text-gray-600 mt-1">{selectedItem.title}</p>
              </div>
              <span className="text-xl font-mono font-bold text-gray-900">
                ${selectedItem.amount.toLocaleString()} {selectedItem.currency}
              </span>
            </div>

            {/* Risk summary */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-xs font-medium text-gray-700 mb-2">Risk Summary</h3>
              <div className="space-y-1">
                {selectedItem.riskNotes.map((note, i) => (
                  <p key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className={
                      selectedItem.riskLevel === "green" ? "text-green-600" :
                      selectedItem.riskLevel === "yellow" ? "text-yellow-600" : "text-red-600"
                    }>
                      {selectedItem.riskLevel === "green" ? "✓" : selectedItem.riskLevel === "yellow" ? "⚠" : "✕"}
                    </span>
                    {note}
                  </p>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div className="mb-4">
              <h3 className="text-xs font-medium text-gray-700 mb-2">Attached Documents</h3>
              <div className="space-y-1">
                {selectedItem.documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-2">
                      <DocIcon type={doc.type} />
                      <span className="text-sm text-gray-900">{doc.name}</span>
                    </div>
                    <span className="text-xs text-everypay-600 cursor-pointer">View &rarr;</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Counterparty profile */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-xs font-medium text-gray-700 mb-2">Counterparty</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{selectedItem.counterparty.split("(")[0].trim()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Trust Score</p>
                  <p className="font-mono font-bold text-green-600">92%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Prior Disputes</p>
                  <p className="font-mono text-gray-900">0</p>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-4 border-t border-gray-200">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm mb-3"
                placeholder="Add a comment (required for rejection)"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(selectedItem.id, "approve")}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(selectedItem.id, "reject")}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-900 mb-4">Approval Chain Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auto-Acceptance Threshold (USD)</label>
                <input
                  type="number"
                  defaultValue={100000}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Settlements below this amount are auto-approved</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Approvers</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border border-gray-200 rounded-md px-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">user-3</p>
                      <p className="text-xs text-gray-500">APPROVER &middot; Order 1</p>
                    </div>
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RiskBadge({ level }: { level: "green" | "yellow" | "red" }) {
  const map = {
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
  };
  const label = { green: "Low Risk", yellow: "Medium Risk", red: "High Risk" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[level]}`}>
      {label[level]}
    </span>
  );
}

function TypeBadge({ type, round }: { type: string; round: number }) {
  const map: Record<string, string> = {
    terms: "bg-blue-50 text-blue-700",
    prepayment: "bg-purple-50 text-purple-700",
    counter_proposal: "bg-amber-50 text-amber-700",
  };
  const label: Record<string, string> = {
    terms: "Terms",
    prepayment: "Pre-Payment",
    counter_proposal: "Counter",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[type] || "bg-gray-100 text-gray-800"}`}>
      {label[type] || type} (R{round})
    </span>
  );
}

function DocIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    contract: "📄",
    invoice: "📋",
    po: "📦",
    logistics: "🚢",
    customs: "🛃",
    bank_transfer: "🏦",
    insurance: "🛡️",
  };
  return <span>{icons[type] || "📎"}</span>;
}
