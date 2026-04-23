"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface Counterparty {
  id: string;
  name: string;
  entityType: "supplier" | "customer" | "both";
  jurisdiction: string;
  registrationNumber: string;
  status: "active" | "pending" | "suspended";
  totalTrades: number;
  totalVolume: number;
  lastActivity: string;
  kycStatus: "verified" | "pending" | "rejected";
}

const MOCK_COUNTERPARTIES: Counterparty[] = [
  {
    id: "CP-001",
    name: "Beta Trading Co., Ltd.",
    entityType: "supplier",
    jurisdiction: "Hong Kong",
    registrationNumber: "HK-12345678",
    status: "active",
    totalTrades: 12,
    totalVolume: 485000,
    lastActivity: "2026-04-18",
    kycStatus: "verified",
  },
  {
    id: "CP-002",
    name: "Delta Logistics Inc.",
    entityType: "customer",
    jurisdiction: "Singapore",
    registrationNumber: "SG-2024-5567",
    status: "active",
    totalTrades: 8,
    totalVolume: 230000,
    lastActivity: "2026-04-15",
    kycStatus: "verified",
  },
  {
    id: "CP-003",
    name: "Gamma Electronics Ltd.",
    entityType: "both",
    jurisdiction: "Malaysia",
    registrationNumber: "MY-7890-AB",
    status: "pending",
    totalTrades: 2,
    totalVolume: 45000,
    lastActivity: "2026-04-20",
    kycStatus: "pending",
  },
  {
    id: "CP-004",
    name: "Epsilon Manufacturing",
    entityType: "supplier",
    jurisdiction: "Vietnam",
    registrationNumber: "VN-3344-CD",
    status: "active",
    totalTrades: 15,
    totalVolume: 620000,
    lastActivity: "2026-04-22",
    kycStatus: "verified",
  },
  {
    id: "CP-005",
    name: "Zeta Global Trading",
    entityType: "customer",
    jurisdiction: "UAE",
    registrationNumber: "AE-9988-EF",
    status: "suspended",
    totalTrades: 3,
    totalVolume: 89000,
    lastActivity: "2026-03-10",
    kycStatus: "rejected",
  },
];

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  suspended: "bg-red-100 text-red-700",
};

const KYC_COLORS: Record<string, string> = {
  verified: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

const ENTITY_LABELS: Record<string, string> = {
  supplier: "Supplier",
  customer: "Customer",
  both: "Supplier & Customer",
};

export default function CounterpartiesPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "suspended">("all");
  const [entityFilter, setEntityFilter] = useState<"all" | "supplier" | "customer">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setCounterparties(MOCK_COUNTERPARTIES);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [userId]);

  const filtered = counterparties.filter((cp) => {
    if (filter !== "all" && cp.status !== filter) return false;
    if (entityFilter !== "all" && cp.entityType !== entityFilter && cp.entityType !== "both") return false;
    if (searchQuery && !cp.name.toLowerCase().includes(searchQuery.toLowerCase()) && !cp.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const activeCount = counterparties.filter((c) => c.status === "active").length;
  const pendingCount = counterparties.filter((c) => c.status === "pending").length;
  const totalVolume = counterparties.reduce((sum, cp) => sum + cp.totalVolume, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Active Counterparties</p>
          <p className="text-xl font-mono font-bold text-green-600 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Pending Onboarding</p>
          <p className="text-xl font-mono font-bold text-amber-600 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Total Trade Volume</p>
          <p className="text-xl font-mono font-bold text-everypay-600 mt-1">${totalVolume.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-everypay-500/20 focus:border-everypay-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-everypay-500/20 focus:border-everypay-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value as typeof entityFilter)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-everypay-500/20 focus:border-everypay-500"
            >
              <option value="all">All Types</option>
              <option value="supplier">Suppliers</option>
              <option value="customer">Customers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Counterparties Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Counterparties</h2>
            <p className="text-xs text-gray-500 mt-0.5">{filtered.length} of {counterparties.length} counterparties</p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No counterparties</h3>
            <p className="mt-1 text-sm text-gray-500">Counterparties will appear here once a trading relationship is established.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Counterparty</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Jurisdiction</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">KYC</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trades</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Volume</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((cp) => (
                  <tr key={cp.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-everypay-100 flex items-center justify-center text-everypay-700 font-bold text-xs flex-shrink-0">
                          {cp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{cp.name}</p>
                          <p className="text-xs text-gray-500">{cp.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-600">{ENTITY_LABELS[cp.entityType]}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-600">{cp.jurisdiction}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[cp.status]}`}>
                        {cp.status.charAt(0).toUpperCase() + cp.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${KYC_COLORS[cp.kycStatus]}`}>
                        {cp.kycStatus.charAt(0).toUpperCase() + cp.kycStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-xs text-gray-600">{cp.totalTrades}</td>
                    <td className="px-6 py-4 text-right font-mono text-xs font-medium text-gray-900">${cp.totalVolume.toLocaleString()}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{new Date(cp.lastActivity).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
