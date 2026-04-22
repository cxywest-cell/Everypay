"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { TradePaymentAgreement, ProposalVersion } from "@/lib/types";

export default function PaymentAgreementReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";
  const [agreement, setAgreement] = useState<TradePaymentAgreement | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [counterRate, setCounterRate] = useState("");
  const [showCounter, setShowCounter] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

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

  const handleAction = async (action: "accept" | "reject" | "counter") => {
    setActionLoading(true);
    try {
      const body: Record<string, unknown> = { action, proposerRole: role === "buyer" ? "buyer" : "seller" };
      if (action === "counter") {
        body.newRate = parseFloat(counterRate);
      }
      const res = await fetch(`/api/payment-agreements/${params.id}`, {
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

  const handleInitiateSettlement = async () => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/settlements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agreementId: params.id,
          sellerId: agreement?.sellerId,
          buyerId: agreement?.buyerId,
          procurementId: agreement?.procurementId,
          lockedRate: agreement?.proposedRate,
          corridor: "BRL",
          settlementCurrency: "USD",
        }),
      });
      const result = await res.json();
      if (result.status === "success" && result.data) {
        router.push(`/settlements/${result.data.id}?userId=${userId}`);
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
        <h2 className="text-lg font-medium text-gray-900">Agreement not found</h2>
        <Link href={`/procurement?userId=${userId}`} className="text-sm text-everypay-600 hover:text-everypay-900">
          &larr; Back to Procurement
        </Link>
      </div>
    );
  }

  const STATUS_COLORS: Record<string, string> = {
    PROPOSED: "bg-blue-100 text-blue-800",
    SENT_TO_BUYER: "bg-indigo-100 text-indigo-800",
    ACCEPTED: "bg-green-100 text-green-800",
    COUNTER_PROPOSED: "bg-yellow-100 text-yellow-800",
    SENT_TO_SELLER: "bg-purple-100 text-purple-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  const isExpired = new Date(agreement.createdAt) < new Date(Date.now() - 48 * 60 * 60 * 1000);
  const marketRate = 5.18;
  const currentRate = agreement.proposedRate;
  const deviation = ((currentRate - marketRate) / marketRate * 100).toFixed(1);

  // Determine who can act based on status
  const isAwaitingInternalApproval = agreement.status === "PROPOSED" || agreement.status === "COUNTER_PROPOSED";
  const canCounterpartyAct = agreement.status === "SENT_TO_BUYER" && role === "buyer"
    || agreement.status === "SENT_TO_SELLER" && role === "seller";

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href={`/procurement?userId=${userId}`} className="hover:text-gray-700">Procurement</Link>
        <span>/</span>
        <Link href={`/procurement/${agreement.procurementId}?userId=${userId}`} className="hover:text-gray-700">{agreement.procurementId}</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Payment Agreement</span>
      </div>

      {/* Status */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[agreement.status]}`}>
              {agreement.status.replace(/_/g, " ")}
            </span>
            {isExpired && (agreement.status === "PROPOSED" || agreement.status === "SENT_TO_BUYER" || agreement.status === "SENT_TO_SELLER") && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                EXPIRED
              </span>
            )}
            <span className="text-xs text-gray-500">Round {agreement.proposalHistory?.length || 1}</span>
          </div>
          <p className="text-xs text-gray-500">
            Created {new Date(agreement.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Pending approval banner */}
      {isAwaitingInternalApproval && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-amber-800">Awaiting Internal Approval</h3>
              <p className="text-sm text-amber-700 mt-1">
                {agreement.status === "PROPOSED"
                  ? "This proposal is pending internal review by the seller's team. It will be sent to you once approved."
                  : "This counter-proposal is pending internal review. It will be sent to the counterparty once approved."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rate details */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-sm font-medium text-gray-900 mb-4">Current Proposal</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-gray-500 uppercase">Proposed Rate</p>
            <p className="text-2xl font-bold font-mono text-gray-900">{currentRate.toFixed(2)}</p>
            <p className={`text-xs mt-1 ${parseFloat(deviation) > 0 ? "text-red-500" : parseFloat(deviation) < 0 ? "text-green-500" : "text-gray-400"}`}>
              vs Market: {marketRate.toFixed(2)} ({deviation}%)
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Rate Method</p>
            <p className="text-sm font-medium text-gray-900">{agreement.rateMethod}</p>
            <p className="text-xs text-gray-400 mt-1">Pre-lock rate for settlement</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Proposed By</p>
            <p className="text-sm font-medium text-gray-900">
              {agreement.proposalHistory && agreement.proposalHistory.length > 0
                ? (agreement.proposalHistory[agreement.proposalHistory.length - 1].proposer === "seller" ? "Wei Zhang (Seller)" : "Carlos (Buyer)")
                : "Wei Zhang (Seller)"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {agreement.proposalHistory && agreement.proposalHistory.length > 0
                ? new Date(agreement.proposalHistory[agreement.proposalHistory.length - 1].timestamp).toLocaleDateString()
                : new Date(agreement.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Fee breakdown */}
        <div className="mt-4 bg-gray-50 rounded-md p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Fee Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-500">FX Fee</p>
              <p className="font-mono font-medium">{agreement.feeBreakdown.fxFee.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Platform Fee</p>
              <p className="font-mono font-medium">{agreement.feeBreakdown.platformFee.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Corridor Fee</p>
              <p className="font-mono font-medium">{agreement.feeBreakdown.corridorFee.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Fees</p>
              <p className="font-mono font-bold text-gray-900">{agreement.feeBreakdown.totalFees.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Negotiation History */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div
          className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50"
          onClick={() => setShowHistory(!showHistory)}
        >
          <div>
            <h2 className="text-sm font-medium text-gray-900">Negotiation History</h2>
            <p className="text-xs text-gray-500">{agreement.proposalHistory?.length || 1} round{agreement.proposalHistory?.length !== 1 ? "s" : ""}</p>
          </div>
          <svg className={`w-5 h-5 text-gray-400 transition-transform ${showHistory ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {showHistory && agreement.proposalHistory && (
          <div className="border-t border-gray-100">
            <div className="divide-y divide-gray-100">
              {agreement.proposalHistory.map((round: ProposalVersion) => (
                <div key={round.round} className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-everypay-100 text-everypay-700 text-xs font-bold">
                        {round.round}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {round.proposer === "seller" ? "Wei Zhang (Seller)" : "Carlos (Buyer)"}
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
                    </div>
                    <span className="text-xs text-gray-400">{new Date(round.timestamp).toLocaleDateString()}</span>
                  </div>

                  <div className="ml-8">
                    <div className="flex items-center gap-6 mb-2">
                      <div>
                        <span className="text-xs text-gray-500">Rate: </span>
                        <span className="text-sm font-mono font-bold">{round.rate.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Fees: </span>
                        <span className="text-sm font-mono">{round.feeBreakdown.totalFees.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Approval metadata */}
                    {round.status === "approved" && round.approvedBy && (
                      <div className="bg-indigo-50 rounded-md p-3 mt-2">
                        <p className="text-xs font-medium text-indigo-700">Internal Approval</p>
                        <p className="text-xs text-indigo-600 mt-1">
                          Approved by {round.approvedBy} on {new Date(round.approvedAt).toLocaleString()}
                        </p>
                        {round.approvalComment && (
                          <p className="text-xs text-indigo-600 mt-1">Comment: {round.approvalComment}</p>
                        )}
                      </div>
                    )}

                    {/* Changes from previous round */}
                    {round.round > 1 && (
                      <div className="bg-gray-50 rounded-md p-3 mt-2">
                        <p className="text-xs font-medium text-gray-700 mb-1">Changes from previous round:</p>
                        <ul className="space-y-0.5">
                          {round.changes.map((change, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                              <span className="text-everypay-500 mt-0.5">&rarr;</span>
                              {change}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Counterparty actions (only when sent to their side) */}
      {canCounterpartyAct && !isExpired && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Your Response</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleAction("accept")}
              disabled={actionLoading}
              className="flex-1 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Accept Rate
            </button>
            <button
              onClick={() => setShowCounter(!showCounter)}
              disabled={actionLoading}
              className="flex-1 px-4 py-2.5 bg-yellow-500 text-white text-sm font-medium rounded-md hover:bg-yellow-600 disabled:opacity-50"
            >
              Counter-Propose
            </button>
            <button
              onClick={() => handleAction("reject")}
              disabled={actionLoading}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              Reject
            </button>
          </div>

          {showCounter && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">Counter Rate</label>
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
                  onClick={() => handleAction("counter")}
                  disabled={actionLoading || !counterRate}
                  className="px-4 py-2 bg-everypay-600 text-white text-sm font-medium rounded-md hover:bg-everypay-700 disabled:opacity-50"
                >
                  Submit Counter
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Your counter-proposal will require internal team approval before being sent to the counterparty.
              </p>
            </div>
          )}
        </div>
      )}

      {agreement.status === "ACCEPTED" && (
        <div className="bg-everypay-50 border border-everypay-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-everypay-900 mb-1">Agreement Accepted</h3>
          <p className="text-sm text-everypay-700 mb-3">
            The rate has been locked after {agreement.proposalHistory?.length || 1} round{(agreement.proposalHistory?.length || 1) > 1 ? "s" : ""}. You can now initiate the settlement.
          </p>
          <button
            onClick={handleInitiateSettlement}
            disabled={actionLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-everypay-600 hover:bg-everypay-700 disabled:opacity-50"
          >
            {actionLoading ? "Initiating..." : "Initiate Settlement"}
          </button>
        </div>
      )}

      {agreement.status === "REJECTED" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-sm font-medium text-red-800">This payment agreement has been rejected.</p>
        </div>
      )}
    </div>
  );
}
