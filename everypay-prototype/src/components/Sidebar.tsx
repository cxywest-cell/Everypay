"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { NAV_SECTIONS } from "./nav-config";
import {
  IconDashboard,
  IconTrading,
  IconSettlements,
  IconAccounting,
  IconAssets,
  IconApprovals,
  IconApprovalFlow,
  IconTeam,
} from "./icons";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: IconDashboard,
  trading: IconTrading,
  settlements: IconSettlements,
  accounting: IconAccounting,
  assets: IconAssets,
  approvals: IconApprovals,
  approvalFlow: IconApprovalFlow,
  team: IconTeam,
};

const ORG_COLORS = [
  { bg: "from-blue-500 to-cyan-400", border: "border-blue-400/20" },
  { bg: "from-amber-500 to-orange-400", border: "border-amber-400/20" },
  { bg: "from-emerald-500 to-teal-400", border: "border-emerald-400/20" },
  { bg: "from-violet-500 to-purple-400", border: "border-violet-400/20" },
];

type DashboardRole = "buyer" | "seller" | "approver" | "admin";

interface SidebarProps {
  collapsed: boolean;
  mobile?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

export function Sidebar({ collapsed, mobile, onClose }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("userId") || "user-1";
  const orgParam = searchParams.get("org");

  const role: DashboardRole =
    userId === "user-3" ? "approver" : userId === "user-2" ? "seller" : "buyer";

  const [orgs, setOrgs] = useState<Array<{ id: string; name: string }>>([
    { id: "org-alpha", name: "Alpha Supplies Ltda." },
    { id: "org-beta", name: "Beta Trading Co., Ltd." },
    { id: "org-gamma", name: "Global Payments Ltd." },
  ]);
  const [orgOpen, setOrgOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/organizations")
      .then((r) => r.json())
      .then((res) => { if (res.data) setOrgs(res.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOrgOpen(false);
      }
    }
    if (orgOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [orgOpen]);

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

  const withParams = (href: string, newOrgId?: string) => {
    const params = new URLSearchParams();
    params.set("userId", userId);
    if (newOrgId) params.set("org", newOrgId);
    return `${href}?${params.toString()}`;
  };

  // Default to org-delta (pending org) when no org param is set
  const defaultOrg = orgs.find((o) => o.id === "org-delta")
    ?? (userId === "user-2" ? orgs.find((o) => o.id === "org-beta") : orgs.find((o) => o.id === "org-alpha"))
    ?? orgs[0];

  const currentOrg = orgParam
    ? orgs.find((o) => o.id === orgParam)
    : defaultOrg;

  // Progress stepper only shown on the compliance-pending page itself
  const showProgress = pathname === "/compliance-pending";

  const switchOrg = (orgId: string) => {
    setOrgOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("org", orgId);
    window.location.search = params.toString();
  };

  const getOrgColor = (id: string) => {
    const idx = orgs.findIndex((o) => o.id === id);
    return ORG_COLORS[idx % ORG_COLORS.length];
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

      {/* Nav / Progress */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {showProgress ? (
          <div className="px-1">
            <div className="text-[11px] font-semibold text-everypay-300 uppercase tracking-wider mb-4">Progress</div>

            {/* Pre-Approval */}
            <div className="mb-6">
              <div className="text-[10px] font-semibold text-everypay-400 uppercase tracking-wider mb-3">Pre-Approval</div>
              <div className="relative">
                <div className="absolute left-[8px] top-3 bottom-0 w-0.5 bg-everypay-700" />
                <div className="space-y-3 relative">
                  {/* Step 1: Business Identity — Completed */}
                  <div className="flex items-center gap-3 pl-0.5">
                    <div className="w-[18px] h-[18px] rounded-full bg-everypay-700 border-2 border-everypay-400 flex items-center justify-center z-10 flex-shrink-0">
                      <svg className="w-2 h-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-everypay-200">Business Identity</div>
                      {!collapsed && <div className="text-xs text-everypay-500">Completed</div>}
                    </div>
                  </div>
                  {/* Step 2: Compliance Review — In Progress */}
                  <div className="flex items-center gap-3 pl-0.5">
                    <div className="w-[18px] h-[18px] rounded-full bg-blue-500 flex items-center justify-center z-10 flex-shrink-0 animate-pulse shadow-lg shadow-blue-500/30">
                      <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3" /></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-blue-400">Compliance Review</div>
                      {!collapsed && <div className="text-xs text-blue-500/70 font-medium">In Progress</div>}
                    </div>
                  </div>
                  {/* Step 3: Final Approval — Pending */}
                  <div className="flex items-center gap-3 pl-0.5">
                    <div className="w-[18px] h-[18px] rounded-full bg-everypay-800 border-2 border-everypay-600 flex items-center justify-center z-10 flex-shrink-0">
                      <span className="text-[10px] font-medium text-everypay-500">3</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-everypay-500">Final Approval</div>
                      {!collapsed && <div className="text-xs text-everypay-600">Pending</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Onboarding */}
            <div>
              <div className="text-[10px] font-semibold text-everypay-400 uppercase tracking-wider mb-3">Onboarding</div>
              <div className="relative">
                <div className="absolute left-[8px] top-[22px] w-0.5 h-[24px] bg-everypay-800" />
                <div className="space-y-3 relative">
                  {/* Step 4: Build Your Team — Pending */}
                  <div className="flex items-center gap-3 pl-0.5">
                    <div className="w-[18px] h-[18px] rounded-full bg-everypay-800 border-2 border-everypay-600 flex items-center justify-center z-10 flex-shrink-0">
                      <span className="text-[10px] font-medium text-everypay-500">4</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-everypay-500">Build Your Team</div>
                      {!collapsed && <div className="text-xs text-everypay-600">Pending</div>}
                    </div>
                  </div>
                  {/* Step 5: Create Treasury Unit — Pending */}
                  <div className="flex items-center gap-3 pl-0.5">
                    <div className="w-[18px] h-[18px] rounded-full bg-everypay-800 border-2 border-everypay-600 flex items-center justify-center z-10 flex-shrink-0">
                      <span className="text-[10px] font-medium text-everypay-500">5</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-everypay-500">Create Treasury Unit</div>
                      {!collapsed && <div className="text-xs text-everypay-600">Pending</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          visibleSections.map((section) => (
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
          ))
        )}
      </nav>

      {/* Org Switcher (Bottom Sidebar) */}
      {currentOrg && (
        <div className="border-t border-everypay-800 p-3 relative" ref={dropdownRef}>
          <button
            onClick={() => setOrgOpen(!orgOpen)}
            className={`flex items-center gap-3 w-full hover:bg-everypay-800 p-2 -ml-2 rounded-lg transition-colors group text-left ${collapsed ? "justify-center px-0" : ""}`}
          >
            <div className={`relative ${collapsed ? "w-8 h-8" : "w-10 h-10"} flex-shrink-0`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${getOrgColor(currentOrg.id).bg} rounded-xl shadow-inner border ${getOrgColor(currentOrg.id).border} flex items-center justify-center text-white font-bold ${collapsed ? "text-xs" : "text-lg"}`}>
                {currentOrg.name.charAt(0)}
              </div>
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                {showProgress ? (
                  <>
                    <div className="text-xs text-everypay-300 font-medium">Organization</div>
                    <div className="text-sm font-bold text-white truncate">{currentOrg.name}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-everypay-300">Owner</span>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">Pending</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-[10px] text-everypay-300 font-medium">Organization</div>
                    <div className="text-sm font-bold text-white truncate">{currentOrg.name}</div>
                  </>
                )}
              </div>
            )}
            {!collapsed && (
              <svg className={`w-4 h-4 text-everypay-400 transition-transform flex-shrink-0 ${orgOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>

          {/* Dropdown */}
          {orgOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
              <div className="p-1.5 max-h-64 overflow-y-auto">
                {orgs.filter((o) => o.id !== "org-gamma").map((org) => {
                  const isSelected = org.id === currentOrg?.id;
                  const color = getOrgColor(org.id);
                  return (
                    <button
                      key={org.id}
                      onClick={() => switchOrg(org.id)}
                      className={`flex items-start gap-3 w-full p-2 rounded-lg text-left transition-colors ${
                        isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className={`relative w-8 h-8 flex-shrink-0`}>
                        <div className={`absolute inset-0 bg-gradient-to-br ${color.bg} rounded-xl shadow-inner border ${color.border} flex items-center justify-center text-white font-bold text-sm`}>
                          {org.name.charAt(0)}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={`text-sm font-medium truncate ${isSelected ? "text-blue-700" : "text-gray-900"}`}>
                          {org.name}
                        </div>
                        {showProgress && (
                          <div className="flex items-center gap-2 flex-wrap mt-0.5">
                            <span className="text-xs text-gray-500">Owner</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                              org.id === "org-delta" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                            }`}>
                              {org.id === "org-delta" ? "Pending" : "VASP"}
                            </span>
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}

                <div className="my-1 border-t border-gray-100" />

                <Link
                  href="/organization-setup"
                  className="flex items-center gap-3 w-full p-2 rounded-lg text-left transition-colors text-blue-600 hover:bg-blue-50"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </div>
                  <span className="text-sm font-bold">Create Organization</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
