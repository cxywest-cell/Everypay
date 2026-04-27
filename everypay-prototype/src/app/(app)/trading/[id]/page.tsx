"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Procurement, TradePaymentAgreement, ProposalVersion } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
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

const STATUS_LABELS: Record<string, string> = {
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
  DISPUTED: "Disputed",
};

const DOC_TYPES = [
  { value: "contract", label: "Contract", icon: "📄" },
  { value: "invoice", label: "Invoice", icon: "📋" },
  { value: "po", label: "Purchase Order", icon: "📦" },
  { value: "packing_list", label: "Packing List", icon: "📃" },
  { value: "logistics", label: "Logistics", icon: "🚢" },
  { value: "customs", label: "Customs", icon: "🛃" },
  { value: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
  { value: "insurance", label: "Insurance", icon: "🛡️" },
  { value: "inspection", label: "Inspection", icon: "🔍" },
  { value: "supporting", label: "Supporting", icon: "📎" },
] as const;

type AttachedDoc = {
  id: string;
  type: string;
  name: string;
  uploadedBy: string;
  uploadedAt: Date;
  size: string;
};

export default function TradingActivityDetailPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";
  const orgParam = searchParams.get("org");
  const [procurement, setProcurement] = useState<Procurement | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [attachedDocs, setAttachedDocs] = useState<AttachedDoc[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadType, setUploadType] = useState("contract");
  const [uploadName, setUploadName] = useState("");
  const [docFilter, setDocFilter] = useState("all");
  const [agreement, setAgreement] = useState<TradePaymentAgreement | null>(null);
  const [counterRate, setCounterRate] = useState("");
  const [showCounter, setShowCounter] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const role = userId === "user-1" ? "buyer" : userId === "user-2" ? "seller" : "approver";

  useEffect(() => {
    fetch(`/api/procurements/${params.id}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.data) setProcurement(result.data as Procurement);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    if (procurement) {
      setAttachedDocs([
        {
          id: "doc-1",
          type: "po",
          name: `PO_${procurement.id}.pdf`,
          uploadedBy: procurement.buyerId,
          uploadedAt: new Date(procurement.createdAt),
          size: "1.2 MB",
        },
        {
          id: "doc-2",
          type: "contract",
          name: `Sales_Contract_${procurement.id}.pdf`,
          uploadedBy: procurement.sellerId,
          uploadedAt: new Date(Date.now() - 3600000),
          size: "2.4 MB",
        },
        ...(procurement.status !== "DRAFT" && procurement.status !== "SENT_TO_SELLER"
          ? [{
              id: "doc-3",
              type: "invoice",
              name: `Commercial_Invoice_${procurement.id}.pdf`,
              uploadedBy: procurement.sellerId,
              uploadedAt: new Date(Date.now() - 7200000),
              size: "856 KB",
            }]
          : []),
      ]);
    }
  }, [procurement]);

  useEffect(() => {
    if (procurement) {
      fetch("/api/payment-agreements")
        .then((res) => res.json())
        .then((result) => {
          if (result.data) {
            const agreements = result.data as Array<Record<string, unknown>>;
            const match = agreements.find((a) => a.procurementId === params.id);
            if (match) setAgreement(match as unknown as TradePaymentAgreement);
          }
        })
        .catch(() => {});
    }
  }, [procurement, params.id]);

  const handleAction = async (action: "send" | "accept_terms" | "counter" | "confirm_receipt" | "report_non_receipt") => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/procurements/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const result = await res.json();
      if (result.status === "success" && result.data) {
        setProcurement(result.data as Procurement);
      }
    } catch {
      // Error handled silently
    } finally {
      setActionLoading(false);
    }
  };

  const handleAgreementAction = async (action: "accept" | "reject" | "counter") => {
    if (!agreement) return;
    setActionLoading(true);
    try {
      const body: Record<string, unknown> = { action, proposerRole: role === "buyer" ? "buyer" : "seller" };
      if (action === "counter") {
        body.newRate = parseFloat(counterRate);
      }
      const res = await fetch(`/api/payment-agreements/${agreement.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (result.status === "success" && result.data) {
        setAgreement(result.data as TradePaymentAgreement);
        setShowCounter(false);
      }
    } catch {
      // Error handled silently
    } finally {
      setActionLoading(false);
    }
  };

  const handleAttachDoc = () => {
    if (!uploadName.trim()) return;
    const newDoc: AttachedDoc = {
      id: `doc-${Date.now()}`,
      type: uploadType,
      name: uploadName,
      uploadedBy: userId,
      uploadedAt: new Date(),
      size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
    };
    setAttachedDocs([...attachedDocs, newDoc]);
    setUploadName("");
    setShowUpload(false);
  };

  const filteredDocs =
    docFilter === "all" ? attachedDocs : attachedDocs.filter((d) => d.type === docFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  if (!procurement) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <h2 className="text-lg font-medium text-gray-900">Activity not found</h2>
        <Link href={`/trading?userId=${userId}${orgParam ? `&org=${orgParam}` : ""}`} className="text-sm text-everypay-600 hover:text-everypay-900">
          &larr; Back to Trading Activities
        </Link>
      </div>
    );
  }

  const canSend = procurement.status === "DRAFT";
  const canNegotiate = ["TERMS_PROPOSED", "NEGOTIATING"].includes(procurement.status);
  const canConfirmReceipt = procurement.status === "IN_TRANSIT";

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href={`/trading?userId=${userId}${orgParam ? `&org=${orgParam}` : ""}`} className="hover:text-gray-700">Trading</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{procurement.id}</span>
      </div>

      {/* Status & Header */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[procurement.status]}`}>
              {STATUS_LABELS[procurement.status]}
            </span>
            <span className="text-2xl font-bold text-gray-900">
              {procurement.currency} {procurement.totalAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex gap-2">
            {canSend && (
              <button
                onClick={() => handleAction("send")}
                disabled={actionLoading}
                className="px-3 py-1.5 bg-everypay-600 text-white text-sm font-medium rounded-md hover:bg-everypay-700 disabled:opacity-50"
              >
                Send to {role === "buyer" ? "Seller" : "Buyer"}
              </button>
            )}
            {canNegotiate && (
              <>
                <button
                  onClick={() => handleAction("accept_terms")}
                  disabled={actionLoading}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  Accept Terms
                </button>
                <button
                  onClick={() => handleAction("counter")}
                  disabled={actionLoading}
                  className="px-3 py-1.5 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-700 disabled:opacity-50"
                >
                  Counter-Propose
                </button>
              </>
            )}
            {canConfirmReceipt && (
              <>
                <button
                  onClick={() => handleAction("confirm_receipt")}
                  disabled={actionLoading}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  Confirm Receipt
                </button>
                <button
                  onClick={() => handleAction("report_non_receipt")}
                  disabled={actionLoading}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  Report Non-Receipt
                </button>
              </>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {procurement.status !== "DRAFT" && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Activity</span>
              <span>Negotiation</span>
              <span>Payment</span>
              <span>Transit</span>
              <span>Settled</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-everypay-600 h-2 rounded-full transition-all"
                style={{
                  width:
                    procurement.status === "SENT_TO_SELLER" ? "15%"
                    : procurement.status === "SELLER_RESPONDED" ? "25%"
                    : ["TERMS_PROPOSED", "NEGOTIATING"].includes(procurement.status) ? "40%"
                    : procurement.status === "TERMS_ACCEPTED" ? "55%"
                    : procurement.status === "PAYMENT_INITIATED" ? "65%"
                    : procurement.status === "IN_TRANSIT" ? "80%"
                    : procurement.status === "RECEIVED" ? "90%"
                    : "100%",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Parties & Line Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-3">Parties & Terms</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-xs text-gray-500 uppercase">Seller</span>
              <span className="text-sm font-medium text-gray-900">{procurement.sellerId}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-xs text-gray-500 uppercase">Buyer</span>
              <span className="text-sm font-medium text-gray-900">{procurement.buyerId}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-xs text-gray-500 uppercase">Corridor</span>
              <span className="text-sm text-gray-900">{procurement.corridor}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-gray-500 uppercase">Due Date</span>
              <span className="text-sm text-gray-900">
                {procurement.dueDate ? new Date(procurement.dueDate).toLocaleDateString() : "Not set"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-3">Line Items</h2>
          <div className="space-y-2">
            {procurement.lineItems.map((item) => (
              <div key={item.id} className="py-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">{item.description}</span>
                  <span className="text-sm font-mono font-medium">
                    {item.quantity} × {item.currency} {item.unitPrice.toLocaleString()}
                  </span>
                </div>
                {(item.hsCode || item.specs) && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    {item.hsCode && <span>HS: {item.hsCode}</span>}
                    {item.hsCode && item.specs && <span className="mx-1">·</span>}
                    {item.specs && <span>{item.specs}</span>}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-2 border-t border-gray-200 flex justify-between">
              <span className="text-sm font-semibold text-gray-900">Total</span>
              <span className="text-sm font-mono font-bold text-gray-900">
                {procurement.currency} {procurement.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
          {procurement.notes && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 uppercase mb-1">Notes</p>
              <p className="text-sm text-gray-700">{procurement.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Document Exchange */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Document Exchange</h2>
            <p className="text-xs text-gray-500">
              All documents shared between parties for this activity
            </p>
          </div>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="px-3 py-1.5 bg-everypay-600 text-white text-xs font-medium rounded-md hover:bg-everypay-700"
          >
            {showUpload ? "Cancel" : "Attach Document"}
          </button>
        </div>

        {showUpload && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Document Type</label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  {DOC_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">File Name</label>
                <input
                  type="text"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. Bill_of_Lading_12345.pdf"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={handleAttachDoc}
                disabled={!uploadName.trim()}
                className="px-4 py-1.5 bg-everypay-600 text-white text-sm font-medium rounded-md hover:bg-everypay-700 disabled:opacity-50"
              >
                Attach
              </button>
            </div>
          </div>
        )}

        {/* Document type filter */}
        <div className="px-6 py-3 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDocFilter("all")}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                docFilter === "all"
                  ? "bg-everypay-100 text-everypay-800 border-everypay-300"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              All ({attachedDocs.length})
            </button>
            {DOC_TYPES.map((t) => {
              const count = attachedDocs.filter((d) => d.type === t.value).length;
              if (count === 0) return null;
              return (
                <button
                  key={t.value}
                  onClick={() => setDocFilter(t.value)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    docFilter === t.value
                      ? "bg-everypay-100 text-everypay-800 border-everypay-300"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {t.icon} {t.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Document list */}
        <div className="divide-y divide-gray-100">
          {filteredDocs.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-400">No documents attached yet</p>
            </div>
          ) : (
            filteredDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{DOC_TYPES.find((t) => t.value === doc.type)?.icon || "📎"}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">
                      {doc.type.replace("_", " ")} · {doc.size} · by {doc.uploadedBy}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {doc.uploadedAt.toLocaleDateString()}
                  </span>
                  <span className="text-xs text-everypay-600 hover:text-everypay-900 cursor-pointer">
                    View →
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Payment Terms — inline */}
      {agreement && (
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Payment Terms</h2>
            <p className="text-xs text-gray-500">Negotiation &amp; bilateral approval</p>
          </div>

          {/* Status bar */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              agreement.status === "PROPOSED" ? "bg-blue-100 text-blue-800"
                : agreement.status === "SENT_TO_BUYER" ? "bg-indigo-100 text-indigo-800"
                : agreement.status === "ACCEPTED" ? "bg-green-100 text-green-800"
                : agreement.status === "COUNTER_PROPOSED" ? "bg-yellow-100 text-yellow-800"
                : agreement.status === "SENT_TO_SELLER" ? "bg-purple-100 text-purple-800"
                : "bg-red-100 text-red-800"
            }`}>
              {agreement.status.replace(/_/g, " ")}
            </span>
            <span className="text-xs text-gray-500">
              Round {agreement.proposalHistory?.length || 1} &middot; {agreement.rateMethod}
            </span>
          </div>

          {/* Awaiting internal approval banner */}
          {(agreement.status === "PROPOSED" || agreement.status === "COUNTER_PROPOSED") && (
            <div className="px-6 py-3 bg-amber-50 border-b border-amber-200">
              <p className="text-sm font-medium text-amber-800">Awaiting Internal Approval</p>
              <p className="text-xs text-amber-700 mt-0.5">
                {agreement.status === "PROPOSED"
                  ? "Pending internal review by the seller's team."
                  : "Pending internal review before being sent to the counterparty."}
              </p>
            </div>
          )}

          {/* Rate & fees */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase">Proposed Rate</p>
                <p className="text-2xl font-bold font-mono text-gray-900">{agreement.proposedRate.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-1">vs Market: {agreement.marketRate?.toFixed(2) ?? "5.18"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Rate Method</p>
                <p className="text-sm font-medium text-gray-900">{agreement.rateMethod}</p>
                <p className="text-xs text-gray-400 mt-1">Pre-lock rate</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Total Fees</p>
                <p className="text-2xl font-bold font-mono text-gray-900">{agreement.feeBreakdown.totalFees.toFixed(2)}</p>
              </div>
            </div>

            {/* Fee breakdown row */}
            <div className="mt-3 bg-gray-50 rounded-md p-3 grid grid-cols-3 gap-3 text-sm">
              <div><p className="text-xs text-gray-500">FX Fee</p><p className="font-mono font-medium">{agreement.feeBreakdown.fxFee.toFixed(2)}</p></div>
              <div><p className="text-xs text-gray-500">Platform Fee</p><p className="font-mono font-medium">{agreement.feeBreakdown.platformFee.toFixed(2)}</p></div>
              <div><p className="text-xs text-gray-500">Corridor Fee</p><p className="font-mono font-medium">{agreement.feeBreakdown.corridorFee.toFixed(2)}</p></div>
            </div>
          </div>

          {/* Negotiation History (collapsible) */}
          {agreement.proposalHistory && agreement.proposalHistory.length > 0 && (
            <div className="border-t border-gray-100">
              <div
                className="flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-gray-50"
                onClick={() => setShowHistory(!showHistory)}
              >
                <div>
                  <h3 className="text-xs font-medium text-gray-700">Negotiation History</h3>
                  <p className="text-xs text-gray-400">{agreement.proposalHistory.length} round{(agreement.proposalHistory.length !== 1) ? "s" : ""}</p>
                </div>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${showHistory ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {showHistory && (
                <div className="border-t border-gray-100 divide-y divide-gray-100">
                  {agreement.proposalHistory.map((round: ProposalVersion) => (
                    <div key={round.round} className="px-6 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-everypay-100 text-everypay-700 text-xs font-bold">
                          {round.round}
                        </span>
                        <span className="text-xs font-medium text-gray-700">
                          {round.proposer === "seller" ? "Seller" : "Buyer"}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          round.status === "accepted" ? "bg-green-100 text-green-800"
                            : round.status === "countered" ? "bg-yellow-100 text-yellow-800"
                            : round.status === "rejected" ? "bg-red-100 text-red-800"
                            : round.status === "approved" ? "bg-indigo-100 text-indigo-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {round.status === "countered" ? "Countered" : round.status === "approved" ? "Internally Approved" : round.status.charAt(0).toUpperCase() + round.status.slice(1)}
                        </span>
                        <span className="text-xs text-gray-400 ml-auto">{new Date(round.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="ml-7 flex items-center gap-4 text-xs">
                        <span className="font-mono font-medium">Rate: {round.rate.toFixed(2)}</span>
                        <span className="font-mono">Fees: {round.feeBreakdown.totalFees.toFixed(2)}</span>
                      </div>
                      {round.changes && round.changes.length > 0 && (
                        <ul className="ml-7 mt-1 space-y-0.5">
                          {round.changes.map((c, i) => (
                            <li key={i} className="text-xs text-gray-500">&rarr; {c}</li>
                          ))}
                        </ul>
                      )}
                      {round.status === "approved" && round.approvalComment && (
                        <p className="ml-7 mt-1 text-xs text-indigo-600">Comment: {round.approvalComment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          {(() => {
            const isAwaitingInternal = agreement.status === "PROPOSED" || agreement.status === "COUNTER_PROPOSED";
            const isSentToMe = (agreement.status === "SENT_TO_BUYER" && role === "buyer")
              || (agreement.status === "SENT_TO_SELLER" && role === "seller");
            const isExpired = new Date(agreement.createdAt) < new Date(Date.now() - 48 * 60 * 60 * 1000);

            // Sent to counterparty — they can act
            if (isSentToMe && !isExpired) {
              return (
                <div className="px-6 py-4 border-t border-gray-100">
                  <h3 className="text-xs font-medium text-gray-700 mb-3">Your Response</h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleAgreementAction("accept")}
                      disabled={actionLoading}
                      className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      Accept Rate
                    </button>
                    <button
                      onClick={() => setShowCounter(!showCounter)}
                      disabled={actionLoading}
                      className="flex-1 px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600 disabled:opacity-50"
                    >
                      Counter-Propose
                    </button>
                    <button
                      onClick={() => handleAgreementAction("reject")}
                      disabled={actionLoading}
                      className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>

                  {showCounter && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step={0.01}
                          value={counterRate}
                          onChange={(e) => setCounterRate(e.target.value)}
                          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
                          placeholder="e.g. 5.20"
                        />
                        <button
                          onClick={() => handleAgreementAction("counter")}
                          disabled={actionLoading || !counterRate}
                          className="px-4 py-2 bg-everypay-600 text-white text-sm font-medium rounded-md hover:bg-everypay-700 disabled:opacity-50"
                        >
                          Submit Counter
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5">
                        Your counter will require internal team approval before being sent.
                      </p>
                    </div>
                  )}
                </div>
              );
            }

            // Accepted — settlement ready
            if (agreement.status === "ACCEPTED") {
              return (
                <div className="px-6 py-4 bg-everypay-50 border-t border-everypay-200">
                  <p className="text-sm font-medium text-everypay-900 mb-1">Agreement Accepted</p>
                  <p className="text-xs text-everypay-700 mb-3">Rate locked. You can now initiate settlement.</p>
                  <Link
                    href={`/settlements?userId=${userId}${orgParam ? `&org=${orgParam}` : ""}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-everypay-600 hover:bg-everypay-700"
                  >
                    Initiate Settlement →
                  </Link>
                </div>
              );
            }

            // Rejected
            if (agreement.status === "REJECTED") {
              return (
                <div className="px-6 py-4 bg-red-50 border-t border-red-200 text-center">
                  <p className="text-sm font-medium text-red-800">This payment agreement has been rejected.</p>
                </div>
              );
            }

            // Awaiting internal approval
            if (isAwaitingInternal) {
              return (
                <div className="px-6 py-4 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-400">Pending internal team approval — no action needed yet.</p>
                </div>
              );
            }

            return null;
          })()}
        </div>
      )}
    </div>
  );
}
