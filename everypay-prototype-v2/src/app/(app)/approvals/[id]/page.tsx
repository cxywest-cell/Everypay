"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { TradePaymentAgreement, ProposalVersion } from "@/lib/types";

export default function TaskReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";
  const [agreement, setAgreement] = useState<TradePaymentAgreement | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const role = userId === "user-1" ? "buyer" : userId === "user-2" ? "seller" : "approver";

  useEffect(() => {
    fetch(`/api/payment-agreements/${params.id}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.data) setAgreement(result.data as TradePaymentAgreement);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleAction = async (action: "approve" | "reject") => {
    if (action === "reject" && !comment.trim()) {
      alert("Rejection reason is required");
      return;
    }
    setActionLoading(true);
    try {
      const apiAction = action === "approve" ? "approve" : "reject_approval";
      const res = await fetch(`/api/payment-agreements/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: apiAction, comment, userId }),
      });
      const result = await res.json();
      if (result.status === "success") {
        router.push(`/approvals?userId=${userId}`);
      }
    } catch {
      // Error handled silently
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <h2 className="text-lg font-medium text-gray-900">Task not found</h2>
        <Link href={`/approvals?userId=${userId}`} className="text-sm text-everypay-600 hover:text-everypay-900">
          &larr; Back to Tasks
        </Link>
      </div>
    );
  }

  const isAwaitingInternal = agreement.status === "PROPOSED" || agreement.status === "COUNTER_PROPOSED";
  const isSentToMe = (agreement.status === "SENT_TO_BUYER" && role === "buyer")
    || (agreement.status === "SENT_TO_SELLER" && role === "seller");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/approvals?userId=${userId}`} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-base font-bold text-gray-900">Review {agreement.id}</h1>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            isAwaitingInternal
              ? "bg-amber-50 text-amber-700 border-amber-100"
              : isSentToMe
                ? "bg-blue-50 text-blue-700 border-blue-100"
                : "bg-gray-100 text-gray-600 border-gray-200"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
              isAwaitingInternal ? "bg-amber-500" : isSentToMe ? "bg-blue-500" : "bg-gray-400"
            }`} />
            {isAwaitingInternal ? "Wait for Sign" : isSentToMe ? "Awaiting Your Response" : agreement.status.replace(/_/g, " ")}
          </span>
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Transaction Details (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-base font-bold text-gray-900">Payment Terms</h2>
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  {agreement.rateMethod}
                </span>
              </div>

              <div className="p-6 space-y-6">
                {/* Amount / Rate display */}
                <div className="flex flex-col items-center justify-center py-6 bg-gray-50 rounded-lg border border-gray-100 border-dashed">
                  <span className="text-sm text-gray-500 font-medium">Proposed Rate</span>
                  <div className="text-3xl font-bold text-gray-900 mt-1">{agreement.proposedRate.toFixed(2)}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">
                      Market: {agreement.marketRate?.toFixed(2) ?? "5.18"}
                    </span>
                  </div>
                </div>

                {/* Fee breakdown */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Fee Breakdown</label>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: "FX Fee", value: agreement.feeBreakdown.fxFee },
                      { label: "Platform Fee", value: agreement.feeBreakdown.platformFee },
                      { label: "Corridor Fee", value: agreement.feeBreakdown.corridorFee },
                      { label: "Total Fees", value: agreement.feeBreakdown.totalFees },
                    ].map((fee) => (
                      <div key={fee.label} className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">{fee.label}</p>
                        <p className={`text-sm font-mono font-bold ${fee.label === "Total Fees" ? "text-gray-900" : "text-gray-700"}`}>
                          {fee.value.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proposal / description */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Proposal</label>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-700 leading-relaxed">
                    {(() => {
                      const last = agreement.proposalHistory?.slice(-1)[0];
                      return last?.changes?.join(". ") || "Payment terms proposal for trade settlement.";
                    })()}
                  </div>
                </div>

                {/* Meta info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500">Unit</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-5 h-5 rounded-full bg-everypay-50 border border-everypay-100 flex items-center justify-center text-everypay-600 text-[10px] font-bold">E</div>
                      <span className="text-sm font-medium text-gray-900">Everypay</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Created At</div>
                    <div className="text-sm font-medium text-gray-900 mt-1">{new Date(agreement.createdAt).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Round</div>
                    <div className="text-sm font-medium text-gray-900 mt-1">#{agreement.proposalHistory?.length || 1}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Task ID</div>
                    <div className="text-sm font-medium font-mono text-gray-900 mt-1">#{agreement.id}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Negotiation History */}
            {agreement.proposalHistory && agreement.proposalHistory.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-base font-bold text-gray-900">Negotiation History</h2>
                </div>
                <div className="p-6 space-y-4">
                  {agreement.proposalHistory.map((round: ProposalVersion) => (
                    <div key={round.round} className="flex gap-4">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          round.status === "accepted" ? "bg-green-100 text-green-700" :
                          round.status === "countered" ? "bg-amber-100 text-amber-700" :
                          round.status === "rejected" ? "bg-red-100 text-red-700" :
                          round.status === "approved" ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {round.round}
                        </div>
                        {round.round < (agreement.proposalHistory?.length || 1) && (
                          <div className="w-0.5 h-full bg-gray-200 mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-900">
                            {round.proposer === "seller" ? "Seller" : "Buyer"}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                            round.status === "accepted" ? "bg-green-50 text-green-700" :
                            round.status === "countered" ? "bg-amber-50 text-amber-700" :
                            round.status === "rejected" ? "bg-red-50 text-red-700" :
                            round.status === "approved" ? "bg-blue-50 text-blue-700" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {round.status}
                          </span>
                          <span className="text-xs text-gray-400">{new Date(round.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs mb-2">
                          <span className="font-mono font-medium">Rate: {round.rate.toFixed(2)}</span>
                          <span className="font-mono">Fees: {round.feeBreakdown.totalFees.toFixed(2)}</span>
                        </div>
                        {round.changes && (
                          <ul className="space-y-0.5">
                            {round.changes.map((c, i) => (
                              <li key={i} className="text-xs text-gray-500">&rarr; {c}</li>
                            ))}
                          </ul>
                        )}
                        {round.approvalComment && (
                          <p className="text-xs text-blue-600 mt-1 bg-blue-50 px-2 py-1 rounded">
                            Approval comment: {round.approvalComment}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Linked trading activity */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
              <h2 className="text-base font-bold text-gray-900 mb-3">Related Activity</h2>
              <Link
                href={`/trading/${agreement.procurementId}?userId=${userId}`}
                className="text-sm text-everypay-600 hover:text-everypay-900 font-medium"
              >
                View Trading Activity &rarr;
              </Link>
            </div>
          </div>

          {/* Right: Approval Flow (1/3) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-base font-bold text-gray-900">Approval Flow</h2>
              </div>
              <div className="p-6">
                <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
                  {/* Step 1: Initiated */}
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">Initiated</span>
                      <span className="text-xs text-gray-600 mt-0.5">{agreement.sellerId}</span>
                      <span className="text-[10px] text-gray-400 mt-1">{new Date(agreement.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Step 2: Risk Check */}
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">Risk Policy Check</span>
                      <span className="text-xs text-green-600 font-medium mt-1">Passed (Auto)</span>
                      <span className="text-[10px] text-gray-400 mt-1">Deviation within threshold</span>
                    </div>
                  </div>

                  {/* Step 3: Awaiting Approval */}
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-sm ring-4 ring-amber-50 animate-pulse" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">Awaiting Approval</span>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-6 h-6 rounded-full bg-everypay-100 border border-white flex items-center justify-center text-[10px] font-bold text-everypay-700">
                          {role === "approver" ? "A" : role === "buyer" ? "B" : "S"}
                        </div>
                        <span className="text-xs text-amber-600 font-medium">You</span>
                      </div>
                      <div className="mt-2 text-[10px] text-gray-500 bg-amber-50 p-2 rounded border border-amber-100">
                        {isAwaitingInternal
                          ? "Internal team review required before sending to counterparty."
                          : isSentToMe
                            ? "Counterparty proposal awaits your response."
                            : "Awaiting further action."}
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Execution */}
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-gray-200 border-2 border-white" />
                    <div className="flex flex-col opacity-50">
                      <span className="text-sm font-semibold text-gray-900">Execution</span>
                      <span className="text-xs text-gray-500 mt-1">Pending approval</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky bottom actions */}
      <div className="h-16 bg-white border-t border-gray-200 px-6 lg:px-8 flex items-center justify-between flex-shrink-0 z-30">
        <div className="text-sm text-gray-500">
          Reviewing task <span className="font-mono text-gray-900">#{agreement.id}</span>
        </div>
        {(isAwaitingInternal || isSentToMe) && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={actionLoading}
              className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition-colors shadow-sm disabled:opacity-50"
            >
              Reject
            </button>
            <button
              onClick={() => handleAction("approve")}
              disabled={actionLoading}
              className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-50"
            >
              {actionLoading ? "Processing..." : isAwaitingInternal ? "Approve & Send" : "Approve"}
            </button>
          </div>
        )}
        {!isAwaitingInternal && !isSentToMe && (
          <span className="text-sm text-gray-400">No action available</span>
        )}
      </div>

      {/* Reject modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-base font-bold text-gray-900 mb-2">Reject this task?</h3>
            <p className="text-sm text-gray-500 mb-4">Please provide a reason for rejection.</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm mb-4"
              placeholder="Rejection reason..."
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => { handleAction("reject"); setShowRejectModal(false); }}
                disabled={actionLoading || !comment.trim()}
                className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
