"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

type ComplianceItem = {
  id: string;
  type: "sanctions" | "kyc_review" | "kyb_review" | "transaction_flag";
  entity: string;
  description: string;
  severity: "high" | "medium" | "low";
  status: "open" | "in_review" | "resolved";
  createdAt: Date;
};

export default function CompliancePage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-3";
  const [screeningResult, setScreeningResult] = useState<"pending" | "clear" | "flagged">("pending");
  const [screeningName, setScreeningName] = useState("");
  const [screening, setScreening] = useState(false);
  const [activeTab, setActiveTab] = useState<"queue" | "records" | "audit">("queue");

  const mockSanctionLists = ["OFAC SDN", "UN Sanctions", "EU Sanctions", "Local Jurisdiction"];

  const handleScreen = () => {
    if (!screeningName.trim()) return;
    setScreening(true);
    setScreeningResult("pending");
    setTimeout(() => {
      if (screeningName.toLowerCase().includes("sanctioned")) {
        setScreeningResult("flagged");
      } else {
        setScreeningResult("clear");
      }
      setScreening(false);
    }, 1500);
  };

  const mockQueue: ComplianceItem[] = [
    {
      id: "COMP-001",
      type: "sanctions",
      entity: "user-new-001",
      description: "Potential OFAC match during onboarding screening",
      severity: "high",
      status: "open",
      createdAt: new Date(Date.now() - 7200000),
    },
    {
      id: "COMP-002",
      type: "kyc_review",
      entity: "user-4",
      description: "KYC documents require manual review — ID photo unclear",
      severity: "medium",
      status: "in_review",
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: "COMP-003",
      type: "transaction_flag",
      entity: "STL-005",
      description: "Large settlement ($150K) — enhanced due diligence triggered",
      severity: "medium",
      status: "open",
      createdAt: new Date(Date.now() - 3600000),
    },
  ];

  const mockAuditLog = [
    { event: "KYC record accessed", actor: "user-3 (Compliance)", target: "user-1", timestamp: "2026-04-14 11:00", hash: "a1b2c3" },
    { event: "Sanctions screening completed", actor: "system", target: "user-new-001", timestamp: "2026-04-14 10:45", hash: "d4e5f6" },
    { event: "KYC tier elevated", actor: "user-3 (Compliance)", target: "user-2", timestamp: "2026-04-14 09:30", hash: "g7h8i9" },
    { event: "KYB documents reviewed", actor: "user-3 (Compliance)", target: "org-alpha", timestamp: "2026-04-13 16:00", hash: "j1k2l3" },
    { event: "Settlement evidence pack generated", actor: "system", target: "STL-001", timestamp: "2026-04-14 11:05", hash: "m4n5o6" },
  ];

  const tabs = [
    { id: "queue" as const, label: "Queue", count: mockQueue.length },
    { id: "records" as const, label: "KYC/KYB Records" },
    { id: "audit" as const, label: "Audit Log" },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
            {"count" in tab && tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-800 text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Queue Tab */}
      {activeTab === "queue" && (
        <div className="space-y-6">
          {/* Sanctions Screening */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-900 mb-4">Sanctions Screening</h2>
            <p className="text-xs text-gray-500 mb-4">
              Screen against: {mockSanctionLists.join(", ")}
            </p>
            <div className="flex gap-2">
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
              <div className={`mt-4 rounded-md p-4 ${
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

          {/* Compliance Queue */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-gray-900">Compliance Queue</h2>
            {mockQueue.length === 0 ? (
              <div className="bg-white rounded-lg shadow border border-gray-200 py-16 text-center">
                <p className="text-sm text-gray-500">No items requiring compliance review</p>
              </div>
            ) : (
              mockQueue.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900">{item.id}</span>
                        <SeverityBadge severity={item.severity} />
                        <StatusBadge status={item.status} />
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Entity: {item.entity} &middot; {item.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 capitalize">{item.type.replace("_", " ")}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Records Tab */}
      {activeTab === "records" && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">KYC/KYB Record Retention</h2>
          <p className="text-xs text-gray-500 mb-4">
            Records retained for 7 years per regulatory requirements
          </p>
          <div className="space-y-3">
            {[
              { user: "user-1 (Carlos Silva)", kyc: "VERIFIED", kyb: null, tier: "TIER_1", retention: "2033-04-15" },
              { user: "user-2 (Wei Zhang)", kyc: "VERIFIED", kyb: "VERIFIED", tier: "TIER_3", retention: "2033-03-15" },
              { user: "user-3 (CFO)", kyc: "VERIFIED", kyb: null, tier: "TIER_1", retention: "2033-04-01" },
              { user: "user-new-001", kyc: "FLAGGED_FOR_REVIEW", kyb: null, tier: "TIER_0", retention: "—" },
            ].map((record) => (
              <div key={record.user} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{record.user}</p>
                  <p className="text-xs text-gray-500">
                    KYC: {record.kyc.replace(/_/g, " ")}
                    {record.kyb && ` · KYB: ${record.kyb}`}
                    {` · Tier: ${record.tier}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Retention until</p>
                  <p className="text-sm font-mono text-gray-900">{record.retention}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Log Tab */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Audit Log</h2>
          <p className="text-xs text-gray-500 mb-4">
            Immutable record of all compliance-related events
          </p>
          <div className="space-y-0">
            {mockAuditLog.map((entry, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    i === 0 ? "bg-everypay-600" : "bg-gray-300"
                  }`} />
                  {i < mockAuditLog.length - 1 && <div className="w-px h-full bg-gray-200" />}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium text-gray-900">{entry.event}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">{entry.actor}</span>
                    <span className="text-xs text-gray-400">Target: {entry.target}</span>
                    <span className="text-xs text-gray-400">{entry.timestamp}</span>
                    <span className="text-xs font-mono text-gray-400">{entry.hash}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SeverityBadge({ severity }: { severity: "high" | "medium" | "low" }) {
  const map = {
    high: "bg-red-100 text-red-800",
    medium: "bg-amber-100 text-amber-800",
    low: "bg-blue-100 text-blue-800",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[severity]}`}>
      {severity}
    </span>
  );
}

function StatusBadge({ status }: { status: "open" | "in_review" | "resolved" }) {
  const map = {
    open: "bg-yellow-100 text-yellow-800",
    in_review: "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
}
