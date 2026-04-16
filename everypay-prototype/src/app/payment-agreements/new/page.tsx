"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { FeeBreakdown } from "@/lib/types";

export default function PaymentAgreementNewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("invoiceId") || "";
  const sellerId = searchParams.get("sellerId") || "user-2";
  const buyerId = searchParams.get("buyerId") || "user-1";
  const amount = parseFloat(searchParams.get("amount") || "0");

  const [proposedRate, setProposedRate] = useState(5.18);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const marketRate = 5.18;
  const deviation = Math.abs(proposedRate - marketRate) / marketRate;
  const exceedsDeviation = deviation > 0.05;

  // Fee calculation
  const feeBreakdown: FeeBreakdown = {
    fxFee: Math.round(proposedRate * proposedRate * 0.01 * 100) / 100,
    platformFee: Math.round(proposedRate * proposedRate * 0.005 * 100) / 100,
    corridorFee: Math.round(proposedRate * proposedRate * 0.003 * 100) / 100,
    totalFees: 0,
  };
  feeBreakdown.totalFees = feeBreakdown.fxFee + feeBreakdown.platformFee + feeBreakdown.corridorFee;

  const handleSubmit = async () => {
    if (exceedsDeviation) {
      setError("Proposed rate exceeds 5% deviation from market rate");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/payment-agreements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId,
          sellerId,
          buyerId,
          proposedRate,
          feeBreakdown,
        }),
      });
      const result = await res.json();
      if (result.status === "success" && result.data) {
        router.push(`/payment-agreements/${result.data.id}/review`);
      } else if (result.error) {
        setError(result.error);
      }
    } catch {
      setError("Failed to create payment agreement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Create Payment Agreement</h1>
            <p className="text-sm text-gray-500">Propose an exchange rate for settlement</p>
          </div>
          <Link href={`/invoices/${invoiceId}`} className="text-sm text-gray-500 hover:text-gray-700">
            &larr; Back
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Invoice summary */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-900 mb-3">Invoice Summary</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Invoice</p>
              <p className="text-sm font-medium text-gray-900">{invoiceId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Seller</p>
              <p className="text-sm text-gray-900">{sellerId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Buyer</p>
              <p className="text-sm text-gray-900">{buyerId}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 uppercase">Amount</p>
            <p className="text-xl font-bold text-gray-900">USD {amount.toLocaleString()}</p>
          </div>
        </div>

        {/* Rate proposal */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Rate Proposal</h2>
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-500">Market Rate</span>
              <span className="font-mono font-medium">{marketRate.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-4">
              <span className="text-gray-500">Allowed Range (5%)</span>
              <span className="font-mono text-gray-600">
                {(marketRate * 0.95).toFixed(2)} - {(marketRate * 1.05).toFixed(2)}
              </span>
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proposed Rate</label>
            <input
              type="number"
              step={0.01}
              value={proposedRate}
              onChange={(e) => setProposedRate(parseFloat(e.target.value) || 0)}
              className={`w-full rounded-md border ${exceedsDeviation ? "border-red-300" : "border-gray-300"} px-3 py-2 text-sm font-mono`}
            />
            {exceedsDeviation && (
              <p className="mt-1 text-xs text-red-600">
                Deviation: {(deviation * 100).toFixed(1)}% - exceeds 5% limit
              </p>
            )}
          </div>

          {/* Fee breakdown */}
          <div className="bg-gray-50 rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Fee Breakdown</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">FX Fee (1.0%)</span>
                <span className="font-mono">{feeBreakdown.fxFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Platform Fee (0.5%)</span>
                <span className="font-mono">{feeBreakdown.platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Corridor Fee (0.3%)</span>
                <span className="font-mono">{feeBreakdown.corridorFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                <span>Total Fees</span>
                <span className="font-mono">{feeBreakdown.totalFees.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm text-gray-500">Valid for 48 hours</span>
            <button
              onClick={handleSubmit}
              disabled={submitting || exceedsDeviation}
              className="px-6 py-2 bg-everypay-600 text-white text-sm font-medium rounded-md hover:bg-everypay-700 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Agreement"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
