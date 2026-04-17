"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { NAV_SECTIONS } from "./nav-config";
import {
  IconDashboard,
  IconProcurement,
  IconInvoices,
  IconSettlements,
  IconAgreements,
  IconTemplates,
  IconPurchaseLedger,
  IconSalesLedger,
  IconCounterparties,
  IconApprovals,
  IconCompliance,
  IconKYC,
  IconTeam,
  IconAdmin,
} from "./icons";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: IconDashboard,
  procurement: IconProcurement,
  invoices: IconInvoices,
  settlements: IconSettlements,
  agreements: IconAgreements,
  templates: IconTemplates,
  purchaseLedger: IconPurchaseLedger,
  salesLedger: IconSalesLedger,
  counterparties: IconCounterparties,
  approvals: IconApprovals,
  compliance: IconCompliance,
  kyc: IconKYC,
  team: IconTeam,
  admin: IconAdmin,
};

type DashboardRole = "buyer" | "seller" | "approver";

interface SidebarProps {
  collapsed: boolean;
  mobile?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

export function Sidebar({ collapsed, mobile, onClose }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";

  const role: DashboardRole =
    userId === "user-3" ? "approver" : userId === "user-2" ? "seller" : "buyer";

  const visibleSections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => item.roles.includes(role)),
  })).filter((section) => section.items.length > 0);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const withUserId = (href: string) => {
    const separator = href.includes("?") ? "&" : "?";
    return `${href}${separator}userId=${userId}`;
  };

  return (
    <div className={`flex h-full flex-col bg-everypay-900 text-white ${mobile ? "shadow-2xl" : ""}`}>
      {/* Logo */}
      <div className={`flex h-14 items-center ${collapsed ? "justify-center px-2" : "px-4 gap-3"}`}>
        <Link href={withUserId("/")} className="flex items-center gap-2" onClick={mobile ? onClose : undefined}>
          <div className="h-8 w-8 rounded-lg bg-everypay-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            E
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold tracking-tight">Everypay</span>
          )}
        </Link>
        {mobile && (
          <button onClick={onClose} className="ml-auto p-1.5 rounded-md hover:bg-everypay-800">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {visibleSections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <h3 className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-everypay-300">
                {section.label}
              </h3>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = ICON_MAP[item.icon];
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={withUserId(item.href)}
                      onClick={mobile ? onClose : undefined}
                      className={`flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                        collapsed ? "justify-center px-1" : ""
                      } ${
                        active
                          ? "bg-everypay-700 text-white"
                          : "text-everypay-200 hover:bg-everypay-800 hover:text-white"
                      }`}
                    >
                      {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}
