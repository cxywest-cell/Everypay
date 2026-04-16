"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { KycTierConfig } from "@/lib/kycTierTypes";

const TIER_COLORS = {
  TIER_1: "bg-green-100 text-green-800 border-green-200",
  TIER_2: "bg-yellow-100 text-yellow-800 border-yellow-200",
  TIER_3: "bg-red-100 text-red-800 border-red-200",
};

export default function KycTiersPage() {
  const [tiers, setTiers] = useState<KycTierConfig[]>([]);
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [editTransactionAmount, setEditTransactionAmount] = useState("");
  const [editMonthlyVolume, setEditMonthlyVolume] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Test evaluation state
  const [testUserId, setTestUserId] = useState("user-1");
  const [testAmount, setTestAmount] = useState("");
  const [testResult, setTestResult] = useState<{
    allowed: boolean;
    currentTier: string;
    reason: string | null;
    requiredTier: string | null;
  } | null>(null);

  useEffect(() => {
    fetch("/api/kyc-tiers")
      .then((res) => res.json())
      .then((result) => {
        if (result.data) setTiers(result.data as KycTierConfig[]);
      })
      .catch(() => {});
  }, []);

  const startEdit = (tier: KycTierConfig) => {
    setEditingTier(tier.tier);
    setEditTransactionAmount(tier.maxTransactionAmount.toString());
    setEditMonthlyVolume(tier.maxMonthlyVolume.toString());
    setError(null);
    setSuccess(null);
  };

  const saveTier = async (tierKey: string) => {
    const transactionAmount = parseFloat(editTransactionAmount);
    const monthlyVolume = parseFloat(editMonthlyVolume);

    if (isNaN(transactionAmount) || transactionAmount <= 0) {
      setError("Invalid transaction amount");
      return;
    }
    if (isNaN(monthlyVolume) || monthlyVolume <= 0) {
      setError("Invalid monthly volume");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/kyc-tiers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: tierKey,
          maxTransactionAmount: transactionAmount,
          maxMonthlyVolume: monthlyVolume,
        }),
      });

      const result = await response.json();
      if (result.status === "success") {
        setTiers((prev) =>
          prev.map((t) => (t.tier === tierKey ? (result.data as KycTierConfig) : t))
        );
        setSuccess(`${tierKey} thresholds updated`);
        setEditingTier(null);
      } else {
        setError(result.error || "Failed to update tier");
      }
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const evaluateTier = async () => {
    const amount = parseFloat(testAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    try {
      const response = await fetch("/api/kyc-tiers/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: testUserId,
          amount,
        }),
      });

      const result = await response.json();
      setTestResult(result.data);
    } catch {
      setError("Failed to evaluate tier");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center space-x-4">
          <Link
            href="/"
            className="flex h-8 w-8 items-center justify-center bg-everypay-600 text-lg font-bold text-white rounded-lg hover:bg-everypay-700 transition-colors"
          >
            E
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">KYC Tier Configuration</h1>
            <p className="text-sm text-gray-500">Configure verification tiers and transaction limits</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        {success && (
          <div className="mb-4 rounded-md bg-green-50 p-4 border border-green-200">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {tiers.map((tier) => (
            <div
              key={tier.tier}
              className={`rounded-lg border-2 shadow-sm ${
                editingTier === tier.tier
                  ? TIER_COLORS[tier.tier as keyof typeof TIER_COLORS].replace("text-", "border-everypay-300 ")
                  : TIER_COLORS[tier.tier as keyof typeof TIER_COLORS]
              }`}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">{tier.name}</h3>
                  <button
                    onClick={() => startEdit(tier)}
                    className="text-xs text-everypay-600 hover:text-everypay-800"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">{tier.description}</p>

                {editingTier === tier.tier ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Max Transaction (USD)
                      </label>
                      <input
                        type="number"
                        value={editTransactionAmount}
                        onChange={(e) => setEditTransactionAmount(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Max Monthly Volume (USD)
                      </label>
                      <input
                        type="number"
                        value={editMonthlyVolume}
                        onChange={(e) => setEditMonthlyVolume(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => saveTier(tier.tier)}
                        disabled={saving}
                        className="flex-1 py-1.5 text-xs font-medium text-white bg-everypay-600 rounded-md hover:bg-everypay-700 disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingTier(null)}
                        className="flex-1 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Max Transaction</span>
                      <span className="font-medium">${tier.maxTransactionAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Max Monthly Volume</span>
                      <span className="font-medium">${tier.maxMonthlyVolume.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500">Required Documents:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tier.requiredDocuments.map((doc) => (
                          <span
                            key={doc}
                            className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {doc.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-gray-500">
                        Min KYC Status: <span className="font-medium">{tier.kycStatusRequired}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tier Evaluation Tester */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tier Evaluation Tester</h3>
          <p className="text-sm text-gray-500 mb-4">
            Test whether a user&apos;s KYC tier allows a specific transaction amount.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">User ID</label>
              <select
                value={testUserId}
                onChange={(e) => setTestUserId(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500"
              >
                <option value="user-1">Carlos (VERIFIED)</option>
                <option value="user-2">Wei (VERIFIED)</option>
                <option value="user-3">Li Chen (VERIFIED)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Transaction Amount (USD)</label>
              <input
                type="number"
                value={testAmount}
                onChange={(e) => setTestAmount(e.target.value)}
                placeholder="e.g., 50000"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={evaluateTier}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-everypay-600 hover:bg-everypay-700 transition-colors"
              >
                Evaluate
              </button>
            </div>
          </div>

          {testResult && (
            <div
              className={`rounded-md p-4 border ${
                testResult.allowed
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <p className="text-sm font-medium">
                {testResult.allowed ? "ALLOWED" : "BLOCKED"}
              </p>
              <p className="text-sm text-gray-600">
                Current Tier: {testResult.currentTier}
                {testResult.reason && <span className="ml-2">({testResult.reason})</span>}
              </p>
              {!testResult.allowed && testResult.requiredTier && (
                <p className="text-sm text-gray-600">
                  Required Tier: {testResult.requiredTier}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
