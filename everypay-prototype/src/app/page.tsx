"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { User, Invoice, Settlement } from "@/lib/types";
import { Role } from "@/lib/types";

type DashboardRole = "buyer" | "seller" | "approver";

const ROLE_NAV: Record<DashboardRole, { label: string; href: string; desc: string }[]> = {
  buyer: [
    { label: "Purchase Ledger", href: "/purchase-ledger", desc: "View pending invoices and payment history" },
    { label: "Counterparties", href: "/counterparties", desc: "Trading partners and trust indicators" },
    { label: "Settlements", href: "/settlements", desc: "Track active settlements" },
    { label: "KYC", href: "/kyc", desc: "Identity verification status" },
  ],
  seller: [
    { label: "Sales Ledger", href: "/sales-ledger", desc: "Receivables, aging, and FX exposure" },
    { label: "Invoices", href: "/invoices", desc: "Manage invoices and templates" },
    { label: "Counterparties", href: "/counterparties", desc: "Trading partners and trust indicators" },
    { label: "Settlements", href: "/settlements", desc: "Track active settlements" },
    { label: "KYB", href: "/kyb", desc: "Business verification status" },
  ],
  approver: [
    { label: "Approvals", href: "/approvals", desc: "Review and approve settlements" },
    { label: "Compliance", href: "/compliance", desc: "AML screening and KYC records" },
    { label: "Team", href: "/team", desc: "Manage team members" },
  ],
};

function getRole(user: User): DashboardRole {
  if (user.roles.includes(Role.APPROVER) || user.roles.includes(Role.COMPLIANCE)) return "approver";
  // Heuristic: users whose org buys (buyerId in settlements) are buyers
  return "buyer"; // default; overridden per-user below
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("user-1");

  // Read userId from a query-param-like mechanism; default to user-1 (Carlos)
  // In the prototype we let the user switch via a small selector for demo purposes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get("userId");
    if (uid) setUserId(uid);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/api/users").then((r) => r.json()),
      fetch(`/api/invoices`).then((r) => r.json()),
      fetch(`/api/settlements`).then((r) => r.json()),
    ])
      .then(([userRes, invRes, stlRes]) => {
        if (userRes.data) {
          const found = (userRes.data as User[]).find((u) => u.id === userId);
          setUser(found || null);
        }
        if (invRes.data) setInvoices(invRes.data as Invoice[]);
        if (stlRes.data) setSettlements(stlRes.data as Settlement[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">No user found. Please select a demo user:</p>
        <DemoUserSwitcher current={userId} onChange={setUserId} />
      </div>
    );
  }

  const role: DashboardRole = user.id === "user-3" ? "approver" : user.id === "user-2" ? "seller" : "buyer";

  const myInvoices = invoices.filter(
    (i) => (role === "buyer" ? i.buyerId === user.id : i.sellerId === user.id)
  );
  const mySettlements = settlements.filter(
    (s) => s.buyerId === user.id || s.sellerId === user.id
  );

  const pendingInvoices = myInvoices.filter((i) => i.status === "SENT");
  const activeSettlements = mySettlements.filter((s) => s.status !== "SETTLED" && s.status !== "FAILED");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-everypay-600 flex items-center justify-center text-white font-bold text-sm">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Welcome, {user.firstName} {user.lastName}
              </h1>
              <p className="text-xs text-gray-500">
                {user.email} &middot; {user.roles.join(", ")}
              </p>
            </div>
          </div>
          <DemoUserSwitcher current={userId} onChange={setUserId} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <MetricCard
            label={role === "buyer" ? "Pending Invoices" : "Outstanding Invoices"}
            value={pendingInvoices.length.toString()}
            detail={
              pendingInvoices.length > 0
                ? `$${pendingInvoices.reduce((s, i) => s + i.totalAmount, 0).toLocaleString()}`
                : role === "buyer"
                  ? "All invoices paid"
                  : "All collected"
            }
            color={pendingInvoices.length > 0 ? "amber" : "green"}
          />
          <MetricCard
            label="Active Settlements"
            value={activeSettlements.length.toString()}
            detail={
              activeSettlements.length > 0
                ? `$${activeSettlements.reduce((s, st) => s + st.fiatAmount, 0).toLocaleString()}`
                : "No active settlements"
            }
            color={activeSettlements.length > 0 ? "everypay" : "gray"}
          />
          <MetricCard
            label="KYC Status"
            value={user.kycStatus}
            detail={user.organizationId || "No organization"}
            color={user.kycStatus === "VERIFIED" ? "green" : "amber"}
          />
        </div>

        {/* Navigation cards */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ROLE_NAV[role].map((item) => (
              <Link
                key={item.href}
                href={`${item.href}?userId=${userId}`}
                className="block rounded-lg border border-gray-200 p-4 hover:border-everypay-300 hover:bg-everypay-50 transition-colors group"
              >
                <p className="text-sm font-semibold text-gray-900 group-hover:text-everypay-700">
                  {item.label}
                </p>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        {(myInvoices.length > 0 || mySettlements.length > 0) && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mt-6">
            <h2 className="text-sm font-medium text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {mySettlements.slice(0, 3).map((stl) => (
                <div key={stl.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <StatusDot status={stl.status} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Settlement {stl.id}</p>
                      <p className="text-xs text-gray-500">{stl.corridor} &middot; {stl.settlementCurrency}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-medium text-gray-900">${stl.fiatAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{stl.status}</p>
                  </div>
                </div>
              ))}
              {myInvoices.slice(0, 2).map((inv) => (
                <div key={inv.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <InvoiceDot status={inv.status} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Invoice {inv.id}</p>
                      <p className="text-xs text-gray-500">{inv.currency} &middot; {role === "buyer" ? inv.sellerId : inv.buyerId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-medium text-gray-900">{inv.currency} {inv.totalAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{inv.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, detail, color }: { label: string; value: string; detail: string; color: string }) {
  const colorMap: Record<string, string> = {
    amber: "text-amber-600",
    green: "text-green-600",
    everypay: "text-everypay-600",
    gray: "text-gray-400",
  };
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-3xl font-mono font-bold mt-1 ${colorMap[color] || "text-gray-900"}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{detail}</p>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const isActive = status !== "SETTLED" && status !== "FAILED";
  return (
    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isActive ? "bg-everypay-600" : "bg-green-500"}`} />
  );
}

function InvoiceDot({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    DRAFT: "bg-gray-400",
    SENT: "bg-blue-500",
    PAID: "bg-green-500",
    OVERDUE: "bg-red-500",
  };
  return <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${colorMap[status] || "bg-gray-400"}`} />;
}

function DemoUserSwitcher({ current, onChange }: { current: string; onChange: (id: string) => void }) {
  const users = [
    { id: "user-1", label: "Carlos (Buyer)" },
    { id: "user-2", label: "Wei (Seller)" },
    { id: "user-3", label: "Li (CFO)" },
  ];
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400">Demo:</span>
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs rounded-md border border-gray-300 px-2 py-1 bg-white"
      >
        {users.map((u) => (
          <option key={u.id} value={u.id}>{u.label}</option>
        ))}
      </select>
    </div>
  );
}
