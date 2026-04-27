"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Settlement } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  INITIATED: "bg-gray-100 text-gray-800",
  FIAT_RECEIVED: "bg-blue-100 text-blue-800",
  USDT_CONFIRMED: "bg-green-100 text-green-800",
  FIAT_TO_USDT_COMPLETE: "bg-sky-100 text-sky-800",
  USDT_TO_FIAT_IN_PROGRESS: "bg-indigo-100 text-indigo-800",
  FIAT_CONVERSION_CONFIRMED: "bg-violet-100 text-violet-800",
  USD_HKD_READY: "bg-teal-100 text-teal-800",
  TRANSFER_IN_PROGRESS: "bg-orange-100 text-orange-800",
  TRANSFERRED: "bg-emerald-100 text-emerald-800",
  SETTLED_PENDING_CONFIRMATION: "bg-yellow-100 text-yellow-800",
  SETTLED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  DISPUTED: "bg-red-200 text-red-900",
};

const STATUS_LABELS: Record<string, string> = {
  INITIATED: "Initiated",
  FIAT_RECEIVED: "Fiat Received",
  USDT_CONFIRMED: "USDT Confirmed",
  FIAT_TO_USDT_COMPLETE: "Fiat → USDT",
  USDT_TO_FIAT_IN_PROGRESS: "USDT → Fiat",
  FIAT_CONVERSION_CONFIRMED: "Conversion Confirmed",
  USD_HKD_READY: "USD/HKD Ready",
  TRANSFER_IN_PROGRESS: "Transfer In Progress",
  TRANSFERRED: "Transferred",
  SETTLED_PENDING_CONFIRMATION: "Pending Confirmation",
  SETTLED: "Settled",
  FAILED: "Failed",
  DISPUTED: "Disputed",
};

type AccountingTab = "settlements" | "fees" | "audit";

export default function AccountingPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";
  const [loading, setLoading] = useState(true);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [activeTab, setActiveTab] = useState<AccountingTab>("settlements");
  const [statusFilter, setStatusFilter] = useState("all");

  const role = userId === "user-2" ? "seller" : "buyer";

  useEffect(() => {
    fetch("/api/settlements")
      .then((r) => r.json())
      .then((result) => {
        if (result.data) setSettlements(result.data as Settlement[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const mySettlements = settlements.filter(
    (s) => s.buyerId === userId || s.sellerId === userId
  );

  const filteredSettlements =
    statusFilter === "all"
      ? mySettlements
      : mySettlements.filter((s) => s.status === statusFilter);

  const totalSettled = mySettlements
    .filter((s) => s.status === "SETTLED")
    .reduce((sum, s) => sum + s.finalAmount, 0);

  const totalInFlight = mySettlements
    .filter((s) => !["SETTLED", "FAILED"].includes(s.status))
    .reduce((sum, s) => sum + s.fiatAmount, 0);

  const totalFees = mySettlements.reduce((sum, s) => {
    return sum + s.legs.reduce((legSum, leg) => legSum + leg.fees, 0);
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SummaryCard label="Total Settled" value={`$${totalSettled.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
        <SummaryCard label="In-Flight" value={`$${totalInFlight.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
        <SummaryCard label="Total Fees" value={`$${totalFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
        <SummaryCard label="Settlements" value={mySettlements.length.toString()} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {([
          { value: "settlements", label: "Settlements" },
          { value: "fees", label: "Fee Breakdown" },
          { value: "audit", label: "Audit Log" },
        ] as const).map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.value ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settlements tab */}
      {activeTab === "settlements" && (
        <>
          {/* Status filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                statusFilter === "all" ? "bg-everypay-100 text-everypay-800 border-everypay-300" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            {Object.entries(STATUS_LABELS).map(([key, label]) => {
              const count = mySettlements.filter((s) => s.status === key).length;
              if (count === 0) return null;
              return (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    statusFilter === key ? "bg-everypay-100 text-everypay-800 border-everypay-300" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>

          {/* Settlements table */}
          {filteredSettlements.length === 0 ? (
            <div className="bg-white rounded-lg shadow border border-gray-200 py-16 text-center">
              <p className="text-sm text-gray-500">No settlements found</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Corridor</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Fiat Amount</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Final Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSettlements.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-mono font-medium text-gray-900">{s.id}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{s.corridor}</span>
                        <span className="text-xs text-gray-400 mx-0.5"> → </span>
                        <span className="text-xs font-mono font-semibold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">USDT</span>
                        <span className="text-xs text-gray-400 mx-0.5"> → </span>
                        <span className="text-sm text-gray-900">{s.settlementCurrency}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <span className="text-sm font-mono text-gray-900">{s.fiatAmount.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <span className="text-sm font-mono font-medium text-gray-900">{s.settlementCurrency} {s.finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-600">{s.lockedRate}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[s.status]}`}>
                          {STATUS_LABELS[s.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <Link href={`/settlements/${s.id}?userId=${userId}`} className="text-everypay-600 hover:text-everypay-900 text-sm font-medium">
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Fees tab */}
      {activeTab === "fees" && (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Settlement</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leg</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversion</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Fee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mySettlements.flatMap((s) =>
                s.legs.map((leg) => (
                  <tr key={`${leg.id}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-900">{s.id}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs text-gray-500">Leg {leg.legOrder}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {leg.currencyFrom} → {leg.currencyTo}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">@{leg.exchangeRate}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <span className="text-sm font-mono font-medium text-amber-600">
                        ${leg.fees.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {leg.timestamp ? new Date(leg.timestamp).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900">Total Fees</td>
                <td className="px-4 py-3 text-right text-sm font-mono font-bold text-amber-600">
                  ${totalFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Audit log tab */}
      {activeTab === "audit" && (
        <AuditLog userId={userId} mySettlements={mySettlements} />
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-mono font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function AuditLog({ userId, mySettlements }: { userId: string; mySettlements: Settlement[] }) {
  const [logs, setLogs] = useState<Array<{ id: string; eventType: string; actor: string; timestamp: Date; settlementId: string | null; metadata: Record<string, unknown> }>>([]);

  useEffect(() => {
    fetch("/api/audit-log")
      .then((r) => r.json())
      .then((result) => {
        if (result.data) setLogs(result.data);
      })
      .catch(() => {});
  }, []);

  // If no audit log API exists, derive events from settlements
  const events: Array<{ desc: string; actor: string; timestamp: string; settlementId: string }> = [];

  mySettlements.forEach((s) => {
    events.push({
      desc: `Settlement ${s.id} created: ${s.corridor} → ${s.settlementCurrency} ${s.fiatAmount.toLocaleString()}`,
      actor: s.buyerId,
      timestamp: new Date(s.createdAt).toISOString(),
      settlementId: s.id,
    });

    s.legs.forEach((leg) => {
      if (leg.timestamp) {
        events.push({
          desc: `Leg ${leg.legOrder}: ${leg.currencyFrom} → ${leg.currencyTo} @ ${leg.exchangeRate} (fee: $${leg.fees.toFixed(2)})`,
          actor: "system",
          timestamp: new Date(leg.timestamp).toISOString(),
          settlementId: s.id,
        });
      }
    });

    if (s.completedAt) {
      events.push({
        desc: `Settlement ${s.id} completed`,
        actor: "system",
        timestamp: new Date(s.completedAt).toISOString(),
        settlementId: s.id,
      });
    }
  });

  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">Audit Trail</h2>
        <p className="text-xs text-gray-500">Chronological record of settlement events</p>
      </div>
      <div className="divide-y divide-gray-100">
        {events.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-400">No audit events yet</p>
          </div>
        ) : (
          events.map((e, i) => (
            <div key={i} className="flex items-start gap-3 px-6 py-3">
              <span className="w-2 h-2 rounded-full bg-everypay-600 mt-1.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{e.desc}</p>
                <p className="text-xs text-gray-500">
                  by {e.actor} · {new Date(e.timestamp).toLocaleString()}
                </p>
              </div>
              <Link
                href={`/settlements/${e.settlementId}?userId=${userId}`}
                className="text-xs text-everypay-600 hover:text-everypay-900 flex-shrink-0"
              >
                View →
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
