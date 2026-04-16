"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CompliancePage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-3";
  const [screeningResult, setScreeningResult] = useState<"pending" | "clear" | "flagged">("pending");
  const [screeningName, setScreeningName] = useState("");
  const [screening, setScreening] = useState(false);

  const mockSanctionLists = ["OFAC SDN", "UN Sanctions", "EU Sanctions", "Local Jurisdiction"];

  const handleScreen = () => {
    if (!screeningName.trim()) return;
    setScreening(true);
    setScreeningResult("pending");

    // Mock: names containing "sanctioned" are flagged
    setTimeout(() => {
      if (screeningName.toLowerCase().includes("sanctioned")) {
        setScreeningResult("flagged");
      } else {
        setScreeningResult("clear");
      }
      setScreening(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">AML & Compliance</h1>
            <p className="text-sm text-gray-500">Sanctions screening and KYC record retention</p>
          </div>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">&larr; Home</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sanctions Screening */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Sanctions Screening (FR52)</h2>
          <p className="text-xs text-gray-500 mb-4">
            Screen against: OFAC, UN, EU, and local sanctions lists
          </p>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={screeningName}
              onChange={(e) => setScreeningName(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Enter name to screen (try 'sanctioned' for demo)"
              onKeyDown={(e) => e.key === "Enter" && handleScreen()}
            />
            <button
              onClick={handleScreen}
              disabled={screening || !screeningName.trim()}
              className="px-4 py-2 bg-everypay-600 text-white text-sm font-medium rounded-md hover:bg-everypay-700 disabled:opacity-50"
            >
              {screening ? "Screening..." : "Screen"}
            </button>
          </div>

          {screeningResult !== "pending" && (
            <div className={`rounded-md p-4 ${
              screeningResult === "clear" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
            }`}>
              <p className={`text-sm font-medium ${
                screeningResult === "clear" ? "text-green-800" : "text-red-800"
              }`}>
                {screeningResult === "clear"
                  ? "Clear — no matches found across all sanctions lists"
                  : "FLAGGED — potential match found. Requires compliance review."}
              </p>
              <div className="mt-2 space-y-1 text-xs text-gray-600">
                {mockSanctionLists.map((list) => (
                  <div key={list} className="flex items-center space-x-2">
                    <span className={screeningResult === "clear" ? "text-green-500" : "text-red-500"}>
                      {screeningResult === "clear" ? "✓" : screeningName.toLowerCase().includes("sanctioned") && list === "OFAC SDN" ? "!" : "✓"}
                    </span>
                    <span>{list}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* KYC Record Retention (FR55) */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">KYC/KYB Record Retention</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-900">user-1 (Carlos)</span>
              <div className="flex items-center space-x-4 text-xs">
                <span className="text-gray-500">KYC: VERIFIED</span>
                <span className="text-gray-500">Tier: TIER_1</span>
                <span className="text-gray-500">Retention until: 2033-04-15</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-900">user-2 (Wei)</span>
              <div className="flex items-center space-x-4 text-xs">
                <span className="text-gray-500">KYC: VERIFIED</span>
                <span className="text-gray-500">KYB: VERIFIED</span>
                <span className="text-gray-500">Retention until: 2033-03-15</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-900">user-3 (CFO)</span>
              <div className="flex items-center space-x-4 text-xs">
                <span className="text-gray-500">KYC: VERIFIED</span>
                <span className="text-gray-500">Retention until: 2033-04-01</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Queue */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Compliance Queue</h2>
          <div className="py-8 text-center text-sm text-gray-500">
            No items requiring compliance review
          </div>
        </div>
      </div>
    </div>
  );
}
