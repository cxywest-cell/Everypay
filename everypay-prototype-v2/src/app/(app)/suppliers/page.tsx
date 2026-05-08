"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface Supplier {
  id: string;
  companyName: string;
  jurisdiction: string;
  registrationNumber: string;
  status: "active" | "pending" | "blocked";
  kybStatus: "verified" | "pending" | "rejected";
  lastActivity: string;
}

const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: "SUP-001",
    companyName: "Beta Trading Co., Ltd.",
    jurisdiction: "Hong Kong",
    registrationNumber: "HK-12345678",
    status: "active",
    kybStatus: "verified",
    lastActivity: "2026-04-18",
  },
  {
    id: "SUP-002",
    companyName: "Gamma Electronics Ltd.",
    jurisdiction: "Malaysia",
    registrationNumber: "MY-7890-AB",
    status: "pending",
    kybStatus: "pending",
    lastActivity: "2026-04-20",
  },
  {
    id: "SUP-003",
    companyName: "Epsilon Manufacturing",
    jurisdiction: "Vietnam",
    registrationNumber: "VN-3344-CD",
    status: "active",
    kybStatus: "verified",
    lastActivity: "2026-04-22",
  },
  {
    id: "SUP-004",
    companyName: "Zeta Global Trading",
    jurisdiction: "UAE",
    registrationNumber: "AE-9988-EF",
    status: "blocked",
    kybStatus: "rejected",
    lastActivity: "2026-03-10",
  },
];

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  blocked: "bg-red-100 text-red-700",
};

const KYB_COLORS: Record<string, string> = {
  verified: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

export default function SuppliersPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "blocked">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuppliers(MOCK_SUPPLIERS);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [userId]);

  const filtered = suppliers.filter((s) => {
    if (filter !== "all" && s.status !== filter) return false;
    if (searchQuery && !s.companyName.toLowerCase().includes(searchQuery.toLowerCase()) && !s.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const activeCount = suppliers.filter((s) => s.status === "active").length;
  const pendingCount = suppliers.filter((s) => s.status === "pending").length;

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
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Active Suppliers</p>
          <p className="text-xl font-mono font-bold text-green-600 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Pending Review</p>
          <p className="text-xl font-mono font-bold text-amber-600 mt-1">{pendingCount}</p>
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
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-everypay-500/20 focus:border-everypay-500 sm:w-48"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Suppliers</h2>
            <p className="text-xs text-gray-500 mt-0.5">{filtered.length} of {suppliers.length} suppliers</p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No suppliers</h3>
            <p className="mt-1 text-sm text-gray-500">Suppliers will appear here once added.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Supplier</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Jurisdiction</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">KYB</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-everypay-100 flex items-center justify-center text-everypay-700 font-bold text-xs flex-shrink-0">
                          {supplier.companyName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{supplier.companyName}</p>
                          <p className="text-xs text-gray-500">{supplier.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-600">{supplier.jurisdiction}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[supplier.status]}`}>
                        {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${KYB_COLORS[supplier.kybStatus]}`}>
                        {supplier.kybStatus.charAt(0).toUpperCase() + supplier.kybStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{new Date(supplier.lastActivity).toLocaleDateString()}</td>
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
