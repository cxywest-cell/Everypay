"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Procurement, Settlement, TradePaymentAgreement } from "@/lib/types";

type DashboardRole = "buyer" | "seller" | "approver";

export default function HomePage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";
  const orgParam = searchParams.get("org");

  const PENDING_ORGS = new Set(["org-beta", "org-delta"]);
  if (typeof window !== "undefined" && PENDING_ORGS.has(orgParam || "")) {
    const params = new URLSearchParams();
    params.set("userId", userId);
    params.set("org", orgParam!);
    window.location.href = `/compliance-pending?${params.toString()}`;
    return null;
  }

  const [loading, setLoading] = useState(true);
  const [procurements, setProcurements] = useState<Procurement[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [agreements, setAgreements] = useState<TradePaymentAgreement[]>([]);

  const role: DashboardRole =
    userId === "user-3" ? "approver" : userId === "user-2" ? "seller" : "buyer";

  const fetchData = async (url: string) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      const res = await fetch(url, { signal: controller.signal });
      return await res.json();
    } finally {
      clearTimeout(timeout);
    }
  };

  useEffect(() => {
    Promise.all([
      fetchData("/api/procurements"),
      fetchData("/api/settlements"),
      fetchData("/api/payment-agreements"),
    ])
      .then(([poRes, stlRes, agrRes]) => {
        if (poRes.data) setProcurements(poRes.data as Procurement[]);
        if (stlRes.data) setSettlements(stlRes.data as Settlement[]);
        if (agrRes.data) setAgreements(agrRes.data as TradePaymentAgreement[]);
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

  // Filter data by role
  const myProcurements = procurements.filter((p) =>
    role === "buyer" ? p.buyerId === userId : p.sellerId === userId
  );
  const mySettlements = settlements.filter(
    (s) => s.buyerId === userId || s.sellerId === userId
  );

  const activeStatuses = ["DRAFT", "SENT_TO_SELLER", "SELLER_RESPONDED", "TERMS_PROPOSED", "NEGOTIATING", "TERMS_ACCEPTED", "PAYMENT_INITIATED"];
  const activeProcurements = myProcurements.filter((p) => activeStatuses.includes(p.status));
  const negotiatingProcurements = myProcurements.filter((p) =>
    ["TERMS_PROPOSED", "NEGOTIATING", "SELLER_RESPONDED"].includes(p.status)
  );
  const activeSettlements = mySettlements.filter(
    (s) => s.status !== "SETTLED" && s.status !== "FAILED"
  );

  // Agreements needing action
  const pendingAgreements = agreements.filter(
    (a) => a.status === "SENT_TO_BUYER" && role === "buyer"
      || a.status === "SENT_TO_SELLER" && role === "seller"
  );

  const totalVolume = myProcurements.reduce((sum, p) => sum + p.totalAmount, 0);
  const inFlightValue = activeSettlements.reduce((sum, s) => sum + s.fiatAmount, 0);

  const activityTitle = role === "seller" ? "Active Sales" : "Active Procurements";
  const activitySubtitle = role === "seller"
    ? "Sales orders you're currently fulfilling"
    : "Procurement orders needing your attention";

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label={activityTitle}
          value={activeProcurements.length.toString()}
          accent
        />
        <StatCard
          label="Active Settlements"
          value={activeSettlements.length.toString()}
        />
        <StatCard
          label="Total Volume"
          value={`$${totalVolume.toLocaleString()}`}
        />
        <StatCard
          label="In-Flight Value"
          value={`$${inFlightValue.toLocaleString()}`}
        />
      </div>

      {/* Buyer: Approvals awaiting response */}
      {role === "buyer" && pendingAgreements.length > 0 && (
        <Card
          title="Payment Terms Awaiting Your Response"
          subtitle="Agreements ready for you to accept or counter"
          action={<Link href={`/trading?userId=${userId}${orgParam ? `&org=${orgParam}` : ""}`} className="text-sm text-everypay-600 hover:text-everypay-900">View all →</Link>}
        >
          <div className="space-y-2">
            {pendingAgreements.slice(0, 3).map((agr) => {
              const po = procurements.find((p) => p.id === agr.procurementId);
              return (
                <Link
                  key={agr.id}
                  href={`/payment-agreements/${agr.id}/review?userId=${userId}${orgParam ? `&org=${orgParam}` : ""}`}
                  className="flex items-center justify-between py-2 hover:bg-gray-50 -mx-2 px-2 rounded"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-900">{po?.id || agr.procurementId}</span>
                    <span className="ml-2 text-xs text-gray-500">Rate: {agr.proposedRate.toFixed(2)}</span>
                  </div>
                  <span className="font-mono text-sm font-medium">
                    ${(po?.totalAmount || 0).toLocaleString()} {po?.currency || "USD"}
                  </span>
                </Link>
              );
            })}
          </div>
        </Card>
      )}

      {/* Active Trading Activities */}
      <Card
        title={activityTitle}
        subtitle={activitySubtitle}
        action={<Link href={`/trading?userId=${userId}${orgParam ? `&org=${orgParam}` : ""}`} className="text-sm text-everypay-600 hover:text-everypay-900">View all →</Link>}
      >
        {activeProcurements.length === 0 ? (
          <EmptyState message={role === "seller" ? "No active sales" : "No active procurements"} />
        ) : (
          <div className="space-y-2">
            {activeProcurements.slice(0, 5).map((po) => (
              <Link
                key={po.id}
                href={`/trading/${po.id}?userId=${userId}${orgParam ? `&org=${orgParam}` : ""}`}
                className="flex items-center justify-between py-2 hover:bg-gray-50 -mx-2 px-2 rounded"
              >
                <div className="flex items-center gap-3">
                  <StatusDot status={po.status} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{po.id}</p>
                    <p className="text-xs text-gray-500">
                      {role === "seller" ? po.buyerId : po.sellerId} · {po.status.replace(/_/g, " ")}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-sm font-medium">
                  {po.currency} {(po.totalAmount ?? 0).toLocaleString()}
                </span>
              </Link>
            ))}
            {negotiatingProcurements.length > 0 && (
              <div className="pt-2 mt-2 border-t border-gray-100">
                <p className="text-xs text-amber-600 font-medium">
                  {negotiatingProcurements.length} in negotiation
                </p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Active Settlements */}
      <Card
        title="Active Settlements"
        subtitle="In-progress settlements with real-time status"
        action={<Link href={`/settlements?userId=${userId}${orgParam ? `&org=${orgParam}` : ""}`} className="text-sm text-everypay-600 hover:text-everypay-900">View all →</Link>}
      >
        {activeSettlements.length === 0 ? (
          <EmptyState message="No active settlements" />
        ) : (
          <div className="space-y-2">
            {activeSettlements.slice(0, 4).map((stl) => (
              <Link
                key={stl.id}
                href={`/settlements/${stl.id}?userId=${userId}${orgParam ? `&org=${orgParam}` : ""}`}
                className="flex items-center justify-between py-2 hover:bg-gray-50 -mx-2 px-2 rounded"
              >
                <div className="flex items-center gap-3">
                  <StatusDot status={stl.status} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{stl.id}</p>
                    <p className="text-xs text-gray-500">{stl.corridor} → {stl.settlementCurrency}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-medium">${(stl.fiatAmount ?? 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{stl.status.replace(/_/g, " ")}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>

      {/* Approver: Pending Approvals */}
      {role === "approver" && (
        <Card
          title="Pending Approvals"
          subtitle="Items requiring your review"
          action={<Link href={`/approvals?userId=${userId}${orgParam ? `&org=${orgParam}` : ""}`} className="text-sm text-everypay-600 hover:text-everypay-900">View queue →</Link>}
        >
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500">Pending Review</p>
              <p className="text-lg font-mono font-bold text-amber-600">—</p>
              <p className="text-xs text-gray-400 mt-0.5">Check approval queue</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Value Awaiting</p>
              <p className="text-lg font-mono font-bold text-gray-900">—</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Team Members</p>
              <p className="text-lg font-mono font-bold text-gray-900">1</p>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Activity */}
      <Card title="Recent Activity" subtitle="Latest events across your activities">
        <RecentActivityFeed userId={userId} role={role} />
      </Card>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg p-4 ${accent ? "bg-everypay-50 border border-everypay-200" : "bg-white border border-gray-200 shadow-sm"}`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-xl font-mono font-bold mt-1 ${accent ? "text-everypay-700" : "text-gray-900"}`}>
        {value}
      </p>
    </div>
  );
}

function Card({ title, subtitle, action, children }: { title: string; subtitle: string; action?: React.ReactNode; children: React.ReactNode }) {
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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-8 text-center">
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const isActive = status !== "SETTLED" && status !== "FAILED" && status !== "TRANSFERRED";
  return (
    <span
      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
        isActive ? "bg-everypay-600" : "bg-green-500"
      }`}
    />
  );
}

function RecentActivityFeed({ userId, role }: { userId: string; role: string }) {
  const [items, setItems] = useState<Array<{ type: string; desc: string; amount: string; status: string; time: string }>>([]);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    Promise.all([
      fetch("/api/settlements", { signal: controller.signal }).then((r) => r.json()),
      fetch("/api/procurements", { signal: controller.signal }).then((r) => r.json()),
    ])
      .then(([stlRes, poRes]) => {
        const settlements = (stlRes.data || []).slice(0, 3);
        const procurements = (poRes.data || []).slice(0, 2);

        const feed: Array<{ type: string; desc: string; amount: string; status: string; time: string }> = [];

        settlements.forEach((s: Record<string, unknown>) => {
          feed.push({
            type: "settlement",
            desc: `${s.corridor} → ${s.settlementCurrency}`,
            amount: `$${(s.fiatAmount as number)?.toLocaleString() || "—"}`,
            status: (s.status as string)?.replace(/_/g, " ") || "",
            time: new Date(s.createdAt as string).toLocaleDateString(),
          });
        });

        procurements.forEach((p: Record<string, unknown>) => {
          feed.push({
            type: "trading",
            desc: `${p.id} with ${role === "buyer" ? p.sellerId : p.buyerId}`,
            amount: `${(p.currency as string)} ${(p.totalAmount as number)?.toLocaleString() || "—"}`,
            status: (p.status as string)?.replace(/_/g, " ") || "",
            time: new Date(p.createdAt as string).toLocaleDateString(),
          });
        });

        setItems(feed);
      })
      .catch(() => {})
      .finally(() => clearTimeout(timeout));
  }, [userId, role]);

  if (items.length === 0) {
    return <EmptyState message="No recent activity" />;
  }

  return (
    <div className="space-y-3">
      {items.map((event, i) => (
        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
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
  );
}

function ActivityDot({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    settlement: "bg-everypay-600",
    trading: "bg-blue-500",
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
