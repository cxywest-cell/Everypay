"use client";

import Link from "next/link";

export default function InvitationEmailPage() {
  return (
    <div className="w-full max-w-2xl">
      {/* Email Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        {/* Email Header */}
        <div className="bg-gradient-to-r from-everypay-900 to-everypay-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="text-white font-bold text-sm">E</div>
              </div>
              <div className="text-sm">
                <div className="text-white font-semibold">Everypay</div>
                <div className="text-everypay-300 text-xs">invite@everypay.com</div>
              </div>
            </div>
            <div className="text-right text-xs">
              <div className="text-everypay-300">To: <span className="text-white">alice.liu@globaltech.com</span></div>
            </div>
          </div>
        </div>

        {/* Email Body */}
        <div className="p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">
            You&apos;ve been invited to join <span className="text-everypay-600">GlobalTech Solutions</span>
          </h1>

          <p className="text-slate-600 mb-6">Hi Alice,</p>

          <p className="text-slate-600 mb-6">
            <strong className="text-slate-900">Sarah Mitchell</strong> has invited you to join <strong className="text-slate-900">GlobalTech Solutions</strong> on Everypay as a <strong className="text-purple-600">Manager</strong>.
          </p>

          {/* Invitor Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 border border-blue-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                SM
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-base font-semibold text-slate-900">Sarah Mitchell</div>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs font-medium rounded-full">Manager</span>
                </div>
                <div className="text-sm text-slate-500">sarah.mitchell@globaltech.com</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-100">
              <div className="text-sm text-slate-600 italic">
                &ldquo;Hi Alice, I&apos;d like to invite you to join our organization&apos;s Everypay account. You&apos;ll have access to manage procurement and settlements with our team.&rdquo;
              </div>
            </div>
          </div>

          {/* Organization Info Card */}
          <div className="bg-slate-50 rounded-xl p-5 mb-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              <div className="text-sm font-semibold text-slate-700">Organization Details</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <div className="text-xs text-slate-400 mb-1">Organization Name</div>
                <div className="text-sm font-semibold text-slate-900">GlobalTech Solutions</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <div className="text-xs text-slate-400 mb-1">Entity Type</div>
                <div className="text-sm font-semibold text-slate-900">Corporation</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <div className="text-xs text-slate-400 mb-1">Registration No.</div>
                <div className="text-sm font-semibold text-slate-900 font-mono">REG-2024-9981-GTS</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <div className="text-xs text-slate-400 mb-1">Jurisdiction</div>
                <div className="text-sm font-semibold text-slate-900">Singapore</div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-6">
            <div className="text-sm font-semibold text-slate-700 mb-3">As a member, you&apos;ll be able to:</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                "View and manage settlements",
                "Approve transactions",
                "Access team settings",
                "Real-time notifications",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Expiry Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-8 flex items-center gap-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div className="text-sm text-amber-700">This invitation will expire in <strong>7 days</strong></div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link href="/login?invite=true" className="flex-1 px-6 py-4 bg-gradient-to-r from-everypay-600 to-everypay-700 hover:from-everypay-700 hover:to-everypay-800 text-white font-semibold rounded-xl shadow-lg shadow-everypay-500/25 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 text-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Accept Invitation
            </Link>
            <Link href="/login" className="flex-1 px-6 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              Decline
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-slate-400">
          &copy; 2026 Everypay. All rights reserved.<br />
          This email was sent to alice.liu@globaltech.com
        </p>
      </div>

      {/* Demo Note */}
      <div className="mt-6 p-4 bg-white/50 rounded-xl border border-slate-200/50">
        <p className="text-xs text-slate-500 text-center">Demo: This simulates the invitation email experience</p>
        <div className="flex justify-center gap-4 mt-3">
          <Link href="/login" className="text-sm text-everypay-600 hover:underline">← Back to Login</Link>
          <span className="text-slate-300">|</span>
          <Link href="/no-organization" className="text-sm text-everypay-600 hover:underline">No Organization Page</Link>
        </div>
      </div>
    </div>
  );
}
