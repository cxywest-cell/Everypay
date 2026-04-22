"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NoOrganizationPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    router.push("/login");
  };

  return (
    <div className="w-full max-w-md">
    <div className="max-w-md w-full text-center">
      <div className="mb-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-500 mb-6 shadow-sm border border-amber-100">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Organization Found</h2>
        <p className="text-slate-500 mt-3 text-sm leading-relaxed">
          It looks like your account is not currently associated with any organization in Everypay.
        </p>
      </div>

      <div className="space-y-4 text-left">
        {/* Option 1: Be Invited */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 group hover:border-everypay-400 transition-all">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-everypay-50 rounded-xl flex items-center justify-center text-everypay-600 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Be Invited</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Please ask your organization&apos;s owner or administrator to invite you to join their workspace.
              </p>
            </div>
          </div>
        </div>

        {/* Option 2: Set Up New Org */}
        <Link
          href="/organization-setup"
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 group hover:border-emerald-400 transition-all cursor-pointer block"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Set Up Organization</h3>
                <svg className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Create your own organization to start managing digital assets with institutional security.
              </p>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
        <button
          onClick={handleLogout}
          className="text-sm font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Sign In
        </button>
        <p className="text-[10px] text-slate-400">
          Need help? <a href="#" className="text-everypay-600 hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
    </div>
  );
}
