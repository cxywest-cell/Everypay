"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/trading": "Trading Activities",
  "/settlements": "Settlements",
  "/accounting": "Accounting",
  "/assets": "Assets",
  "/approvals": "Approvals",
  "/approval-flow": "Approval Flow",
  "/team": "Team",
};

const DEMO_USERS = [
  { id: "user-1", firstName: "Carlos", lastName: "Mendes", role: "Buyer", org: "Alpha Supplies", wallet: "0x7a2f...8c1d" },
  { id: "user-2", firstName: "Wei", lastName: "Zhang", role: "Seller", org: "Beta Trading", wallet: "0x9e3b...4f72" },
  { id: "user-3", firstName: "Li", lastName: "Chen", role: "CFO", org: "Global Payments", wallet: "0x285c...3f02" },
  { id: "user-4", firstName: "Sarah", lastName: "Mitchell", role: "Admin", org: "Digital Account Fdn.", wallet: "0x4d1e...9a83" },
];

const USER_COLORS: Record<string, string> = {
  "user-1": "bg-blue-500",
  "user-2": "bg-amber-500",
  "user-3": "bg-emerald-500",
  "user-4": "bg-purple-500",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sidebar-collapsed") === "true";
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("loggedIn") === "true";
      if (!loggedIn) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  const userId = searchParams.get("userId") || "user-1";
  const user = DEMO_USERS.find((u) => u.id === userId) || DEMO_USERS[0];
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  const handleToggle = () => {
    setCollapsed((c) => {
      const next = !c;
      if (typeof window !== "undefined") {
        localStorage.setItem("sidebar-collapsed", String(next));
      }
      return next;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    router.push("/login");
  };

  const switchUser = (newUserId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("userId", newUserId);
    window.location.search = params.toString();
    setProfileOpen(false);
  };

  const getPageInfo = () => {
    if (PAGE_TITLES[pathname]) return { title: PAGE_TITLES[pathname], crumbs: [] };

    for (const [prefix, title] of Object.entries(PAGE_TITLES)) {
      if (prefix !== "/" && pathname.startsWith(prefix)) {
        const remainder = pathname.replace(prefix, "").replace(/^\//, "");
        if (remainder) {
          return { title, crumbs: remainder.split("/").filter(Boolean) };
        }
        return { title, crumbs: [] };
      }
    }

    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0) {
      const last = segments[segments.length - 1];
      return { title: last.charAt(0).toUpperCase() + last.slice(1), crumbs: segments.slice(0, -1) };
    }

    return { title: "Everypay", crumbs: [] };
  };

  const pageInfo = getPageInfo();

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className={`transition-all duration-200 ease-in-out ${collapsed ? "w-16" : "w-64"}`}>
          <Sidebar collapsed={collapsed} onToggle={handleToggle} />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-gray-900/50" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full w-64">
            <Sidebar collapsed={false} mobile onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4 lg:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-1.5 rounded-md hover:bg-gray-100"
          >
            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={handleToggle}
            className="hidden lg:block p-1.5 rounded-md hover:bg-gray-100"
          >
            {collapsed ? (
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            )}
          </button>

          {/* Page title / breadcrumb */}
          <div className="flex items-center gap-1 text-sm min-w-0">
            <h1 className="font-semibold text-gray-900 truncate">{pageInfo.title}</h1>
            {pageInfo.crumbs.length > 0 && (
              <div className="flex items-center gap-1 text-gray-400">
                {pageInfo.crumbs.map((crumb, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span>/</span>
                    <span className={i === pageInfo.crumbs.length - 1 ? "text-gray-600" : "text-gray-400"}>
                      {crumb}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1" />

          {/* User Profile Dropdown — matches task.html header right */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-xl transition-colors relative z-50 cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-full ${USER_COLORS[userId]} flex items-center justify-center text-white font-bold text-sm`}>
                {initials}
              </div>
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs font-mono text-gray-600">{user.wallet}</span>
                <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 rounded font-medium">Bound</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {/* User info */}
                <div className="px-3 py-2.5 bg-gray-50 border-b border-gray-100">
                  <div className="text-sm font-bold text-gray-900">{user.firstName} {user.lastName}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </div>

                {/* Actions */}
                <div className="p-1">
                  <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Reset Personal Key
                  </a>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-4 4h8" />
                    </svg>
                    Reset Password
                  </a>
                  <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Authenticator App
                  </a>
                  <div className="my-1 border-t border-gray-100" />
                  <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>

                {/* Demo user switcher (bottom section) */}
                <div className="border-t border-gray-100 p-1">
                  <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Demo</div>
                  {DEMO_USERS.map((u) => {
                    const isSelected = u.id === userId;
                    const uInitials = `${u.firstName.charAt(0)}${u.lastName.charAt(0)}`;
                    return (
                      <button
                        key={u.id}
                        onClick={() => switchUser(u.id)}
                        className={`flex items-center gap-2 w-full p-2 rounded-lg text-left transition-colors ${
                          isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full ${USER_COLORS[u.id]} flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0`}>
                          {uInitials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`text-xs font-medium truncate ${isSelected ? "text-blue-700" : "text-gray-700"}`}>
                            {u.firstName} {u.lastName}
                          </div>
                        </div>
                        {isSelected && (
                          <svg className="w-3 h-3 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
