"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { User, Invoice, Settlement, Procurement } from "@/lib/types";

type DashboardRole = "buyer" | "seller" | "approver";

export default function HomePage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";

  const [user, setUser] = useState<User | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [procurements, setProcurements] = useState<Procurement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/users").then((r) => r.json()),
      fetch(`/api/invoices`).then((r) => r.json()),
      fetch(`/api/settlements`).then((r) => r.json()),
      fetch(`/api/procurements`).then((r) => r.json()),
    ])
      .then(([userRes, invRes, stlRes, poRes]) => {
        if (userRes.data) {
          const found = (userRes.data as User[]).find((u: User) => u.id === userId);
          setUser(found || null);
        }
        if (invRes.data) setInvoices(invRes.data as Invoice[]);
        if (stlRes.data) setSettlements(stlRes.data as Settlement[]);
        if (poRes.data) setProcurements(poRes.data as Procurement[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <p className="text-gray-600">No user found. Use the demo switcher above to select a user.</p>
      </div>
    );
  }

  const role: DashboardRole =
    user.id === "user-3" ? "approver" : user.id === "user-2" ? "seller" : "buyer";

  const myInvoices = invoices.filter(
    (i) => (role === "buyer" ? i.buyerId === user.id : i.sellerId === user.id)
  );
  const mySettlements = settlements.filter(
    (s) => s.buyerId === user.id || s.sellerId === user.id
  );

  const activeProcurementStatuses = ["SENT_TO_SELLER", "SELLER_RESPONDED", "TERMS_PROPOSED", "NEGOTIATING", "TERMS_ACCEPTED", "PAYMENT_INITIATED"];
  const myProcurements = procurements.filter((p) => p.buyerId === user.id);

  const pendingInvoices = myInvoices.filter((i) => i.status === "SENT");
  const overdueInvoices = myInvoices.filter((i) => i.status === "OVERDUE");
  const activeSettlements = mySettlements.filter(
    (s) => s.status !== "SETTLED" && s.status !== "FAILED"
  );
  const completedSettlements = mySettlements.filter((s) => s.status === "SETTLED");

  const now = new Date();

  // Compute per-section data
  const procurementAwaitingPayment = role === "buyer"
    ? myProcurements.filter((p) => activeProcurementStatuses.includes(p.status))
    : [];
  const salesAwaitingPayment = role === "seller"
    ? myInvoices.filter((i) => i.status === "SENT" || i.status === "OVERDUE")
    : [];

  // Asset balances (mock)
  const assets = {
    totalUSD: 142850,
    BRL: 285000,
    ARS: 0,
    USDOffshore: 52400,
    HKDOffshore: 180000,
    USDT: 15000,
  };

  // Stats (mock)
  const stats = {
    trustScore: 92,
    counterpartyCount: 8,
    settlementSuccessRate: 99.2,
    corridorExposure: "$12,400 BRL",
    complianceFlags: 0,
  };

  // Recent activity feed
  const recentActivity = [
    { type: "settlement", id: "STL-001", desc: "BRL → USDT → USD", amount: "$25,000", status: "USDT_CONFIRMED", time: "2 min ago" },
    { type: "invoice", id: "INV-007", desc: "Invoice received from Wei Zhang", amount: "$12,400", status: "SENT", time: "1 hour ago" },
    { type: "payment", id: "PAY-014", desc: "Payment confirmed — rate locked", amount: "$8,200", status: "LOCKED", time: "3 hours ago" },
    { type: "settlement", id: "STL-003", desc: "USD delivered to offshore HK account", amount: "$45,000", status: "SETTLED", time: "1 day ago" },
    { type: "approval", id: "APR-002", desc: "Terms approved by CFO", amount: "$32,000", status: "ACCEPTED", time: "1 day ago" },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Welcome, {user.firstName} {user.lastName}
        </h1>
        <p className="text-sm text-gray-500">
          {user.email} &middot; {role} &middot; {user.roles.join(", ")}
        </p>
      </div>

      {/* Assets Section */}
      <Section title="Assets" subtitle="Current balance across all currencies">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <AssetCard label="Total (USD equiv.)" value={`$${assets.totalUSD.toLocaleString()}`} accent />
          <AssetCard label="BRL Holdings" value={`${assets.BRL.toLocaleString()} BRL`} />
          <AssetCard label="ARS Holdings" value={assets.ARS > 0 ? `${assets.ARS.toLocaleString()} ARS` : "$0"} />
          <AssetCard label="USD Offshore" value={`$${assets.USDOffshore.toLocaleString()}`} />
          <AssetCard label="HKD Offshore" value={`${assets.HKDOffshore.toLocaleString()} HKD`} />
          <AssetCard label="USDT Balance" value={`${assets.USDT.toLocaleString()} USDT`} />
        </div>
      </Section>

      {/* Sales Awaiting Payment (Seller) */}
      {role === "seller" && (
        <Section
          title="Sales Awaiting Payment"
          subtitle="Outbound invoices sent to buyers, waiting for payment"
          action={<Link href={`/invoices?userId=${userId}`} className="text-sm text-everypay-600 hover:text-everypay-900">View all &rarr;</Link>}
        >
          {salesAwaitingPayment.length === 0 ? (
            <EmptyState message="No outstanding invoices" />
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Count Outstanding</p>
                  <p className="text-lg font-mono font-bold text-amber-600">{salesAwaitingPayment.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Value</p>
                  <p className="text-lg font-mono font-bold text-gray-900">
                    ${salesAwaitingPayment.reduce((s, i) => s + i.totalAmount, 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Overdue</p>
                  <p className="text-lg font-mono font-bold text-red-600">{overdueInvoices.length}</p>
                </div>
              </div>
              {overdueInvoices.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-2">Top Overdue</p>
                  {overdueInvoices.slice(0, 3).map((inv) => {
                    const dueDate = inv.dueDate ? new Date(inv.dueDate) : null;
                    const daysOverdue = dueDate ? Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
                    return (
                      <div key={inv.id} className="flex items-center justify-between py-2 border-t border-gray-100">
                        <div>
                          <span className="text-sm font-medium text-gray-900">{inv.id}</span>
                          <span className="ml-2 text-xs text-red-500">{daysOverdue} days overdue</span>
                        </div>
                        <span className="font-mono text-sm font-medium">${inv.totalAmount.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </Section>
      )}

      {/* Procurement Awaiting Payment (Buyer) */}
      {role === "buyer" && (
        <Section
          title="Procurement Awaiting Payment"
          subtitle="Active procurement orders needing your attention"
          action={<Link href={`/procurement?userId=${userId}`} className="text-sm text-everypay-600 hover:text-everypay-900">View all &rarr;</Link>}
        >
          {procurementAwaitingPayment.length === 0 ? (
            <EmptyState message="No pending procurements" />
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Active</p>
                  <p className="text-lg font-mono font-bold text-amber-600">{procurementAwaitingPayment.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Value</p>
                  <p className="text-lg font-mono font-bold text-gray-900">
                    ${procurementAwaitingPayment.reduce((s, p) => s + p.totalAmount, 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Due Soon</p>
                  <p className="text-lg font-mono font-bold text-everypay-600">
                    {procurementAwaitingPayment.filter((p) => {
                      if (!p.dueDate) return false;
                      const days = Math.floor((new Date(p.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                      return days <= 7;
                    }).length}
                  </p>
                </div>
              </div>
              {procurementAwaitingPayment.slice(0, 3).map((po) => (
                <Link
                  key={po.id}
                  href={`/procurement/${po.id}?userId=${userId}`}
                  className="flex items-center justify-between py-2 border-t border-gray-100 hover:bg-gray-50 -mx-2 px-2 rounded"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-900">{po.id}</span>
                    <span className="ml-2 text-xs text-gray-500">{po.sellerId}</span>
                    <span className="ml-2 text-xs text-amber-600">{po.status.replace(/_/g, " ")}</span>
                  </div>
                  <span className="font-mono text-sm font-medium">${po.totalAmount.toLocaleString()}</span>
                </Link>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Active Settlements */}
      <Section
        title="Active Settlements"
        subtitle="In-progress settlements with real-time status"
        action={<Link href={`/settlements?userId=${userId}`} className="text-sm text-everypay-600 hover:text-everypay-900">View all &rarr;</Link>}
      >
        {activeSettlements.length === 0 ? (
          <EmptyState message="No active settlements" />
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500">Count Active</p>
                <p className="text-lg font-mono font-bold text-everypay-600">{activeSettlements.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total In-Flight</p>
                <p className="text-lg font-mono font-bold text-gray-900">
                  ${activeSettlements.reduce((s, st) => s + st.fiatAmount, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Completed</p>
                <p className="text-lg font-mono font-bold text-green-600">{completedSettlements.length}</p>
              </div>
            </div>
            {activeSettlements.slice(0, 4).map((stl) => (
              <Link
                key={stl.id}
                href={`/settlements/${stl.id}?userId=${userId}`}
                className="flex items-center justify-between py-2 border-t border-gray-100 hover:bg-gray-50 -mx-2 px-2 rounded"
              >
                <div className="flex items-center gap-3">
                  <StatusDot status={stl.status} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{stl.id}</p>
                    <p className="text-xs text-gray-500">{stl.corridor} &rarr; {stl.settlementCurrency}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-medium">${stl.fiatAmount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{stl.status.replace(/_/g, " ")}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Section>

      {/* Pending Approvals (Approver) */}
      {role === "approver" && (
        <Section
          title="Pending Approvals"
          subtitle="Settlements requiring your review"
          action={<Link href={`/approvals?userId=${userId}`} className="text-sm text-everypay-600 hover:text-everypay-900">View queue &rarr;</Link>}
        >
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500">Pending Review</p>
              <p className="text-lg font-mono font-bold text-amber-600">3</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Value Awaiting</p>
              <p className="text-lg font-mono font-bold text-gray-900">$89,000</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Oldest Pending</p>
              <p className="text-lg font-mono font-bold text-gray-900">2h 15m</p>
            </div>
          </div>
        </Section>
      )}

      {/* Recent Activity */}
      <Section title="Recent Activity" subtitle="Chronological feed of recent events">
        <div className="space-y-3">
          {recentActivity.map((event) => (
            <div key={event.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <ActivityDot type={event.type} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{event.desc}</p>
                  <p className="text-xs text-gray-500">{event.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono font-medium text-gray-900">{event.amount}</p>
                <p className="text-xs text-gray-500">{event.status}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Stats */}
      <Section title="Stats" subtitle="Quick metrics across all domains">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <StatCard label="Trust Score" value={`${stats.trustScore}%`} />
          <StatCard label="Counterparties" value={stats.counterpartyCount.toString()} />
          <StatCard label="Settlement Success" value={`${stats.settlementSuccessRate}%`} />
          <StatCard label="Corridor Exposure" value={stats.corridorExposure} />
          <StatCard label="Compliance Flags" value={stats.complianceFlags.toString()} color={stats.complianceFlags === 0 ? "green" : "red"} />
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function AssetCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-lg p-4 ${accent ? "bg-everypay-50 border border-everypay-200" : "bg-gray-50"}`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-lg font-mono font-bold mt-1 ${accent ? "text-everypay-700" : "text-gray-900"}`}>
        {value}
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    green: "text-green-600",
    red: "text-red-600",
  };
  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-xl font-mono font-bold mt-1 ${colorMap[color || ""] || "text-gray-900"}`}>{value}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-8 text-center">
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const isActive =
    status !== "SETTLED" && status !== "FAILED" && status !== "TRANSFERRED";
  return (
    <span
      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
        isActive ? "bg-everypay-600" : "bg-green-500"
      }`}
    />
  );
}

function ActivityDot({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    settlement: "bg-everypay-600",
    invoice: "bg-blue-500",
    payment: "bg-green-500",
    approval: "bg-amber-500",
  };
  return (
    <span
      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
        colorMap[type] || "bg-gray-400"
      }`}
    />
  );
}
