"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { TradePaymentAgreement } from "@/lib/types";

export default function PaymentAgreementReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";
  const [agreement, setAgreement] = useState<TradePaymentAgreement | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [counterRate, setCounterRate] = useState("");
  const [showCounter, setShowCounter] = useState(false);

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
      const body: Record<string, unknown> = { action };
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
          invoiceId: agreement?.invoiceId,
          lockedRate: agreement?.proposedRate,
          corridor: "BRL",
          settlementCurrency: "USD",
        }),
      });
      const result = await res.json();
      if (result.status === "success" && result.data) {
        router.push(`/settlements/${result.data.id}`);
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

  if (!agreement) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">Agreement not found</h2>
          <Link href="/invoices" className="mt-4 inline-block text-everypay-600 hover:text-everypay-900 text-sm">
            &larr; Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

  const STATUS_COLORS: Record<string, string> = {
    PROPOSED: "bg-blue-100 text-blue-800",
    ACCEPTED: "bg-green-100 text-green-800",
    COUNTER_PROPOSED: "bg-yellow-100 text-yellow-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  const isExpired = new Date(agreement.createdAt) < new Date(Date.now() - 48 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Payment Agreement {agreement.id}</h1>
            <p className="text-sm text-gray-500">Review and respond to rate proposal</p>
          </div>
          <Link href={`/invoices/${agreement.invoiceId}`} className="text-sm text-gray-500 hover:text-gray-700">
            &larr; Back to Invoice
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[agreement.status]}`}>
                {agreement.status.replace("_", " ")}
              </span>
              {isExpired && agreement.status === "PROPOSED" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  EXPIRED
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Created {new Date(agreement.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Rate details */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Rate Proposal</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase">Proposed Rate</p>
              <p className="text-2xl font-bold font-mono text-gray-900">{agreement.proposedRate.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">
                vs Market: 5.18 ({((agreement.proposedRate - 5.18) / 5.18 * 100).toFixed(1)}% deviation)
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Rate Method</p>
              <p className="text-sm font-medium text-gray-900">{agreement.rateMethod}</p>
              <p className="text-xs text-gray-400 mt-1">Pre-lock rate for settlement</p>
            </div>
          </div>

          {/* Fee breakdown */}
          <div className="mt-4 bg-gray-50 rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Fee Breakdown</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">FX Fee</span>
                <span className="font-mono">{agreement.feeBreakdown.fxFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Platform Fee</span>
                <span className="font-mono">{agreement.feeBreakdown.platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Corridor Fee</span>
                <span className="font-mono">{agreement.feeBreakdown.corridorFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                <span>Total Fees</span>
                <span className="font-mono">{agreement.feeBreakdown.totalFees.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {agreement.status === "PROPOSED" && !isExpired && (
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
              </div>
            )}
          </div>
        )}

        {agreement.status === "ACCEPTED" && (
          <div className="bg-everypay-50 border border-everypay-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-everypay-900 mb-1">Agreement Accepted</h3>
            <p className="text-sm text-everypay-700 mb-3">
              The rate has been locked. You can now initiate the settlement.
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
    </div>
  );
}
