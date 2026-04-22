"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSendCode = () => {
    if (!email) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setCodeSent(true);
    }, 800);
  };

  const handleSubmit = () => {
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (code !== "123456") {
      setError("Invalid verification code.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 800);
  };

  if (success) {
    return (
    <div className="w-full max-w-md">
    {success ? (
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Password reset!</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Your password has been successfully updated. You can now use your new password to sign in.
          </p>
          <Link
            href="/login"
            className="w-full block px-4 py-3 text-sm font-semibold text-white bg-everypay-900 rounded-xl hover:bg-everypay-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-everypay-900 transition-all shadow-lg shadow-slate-200"
          >
            Sign in now
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Remembered your password? <Link href="/login" className="font-semibold text-everypay-600 hover:text-everypay-500">Sign in</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
      <div className="mb-8">
        <Link href="/login" className="inline-flex items-center justify-center h-10 w-10 bg-everypay-600 text-xl font-bold text-white rounded-lg shadow-lg hover:bg-everypay-700 transition-colors mb-4">
          E
        </Link>
        <h2 className="text-2xl font-bold text-slate-900">Reset your password</h2>
        <p className="text-slate-500 mt-1 text-sm">Verify your identity and set a new password directly.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" /></svg>
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-everypay-500/20 focus:border-everypay-500 transition-all text-sm"
              />
            </div>
            <button
              type="button"
              onClick={handleSendCode}
              disabled={sending || !email}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all whitespace-nowrap disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Code"}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="verification-code" className="block text-sm font-medium text-slate-700 mb-1.5">Verification Code</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <input
              type="text"
              id="verification-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-everypay-500/20 focus:border-everypay-500 transition-all text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-everypay-500/20 focus:border-everypay-500 transition-all text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-everypay-500/20 focus:border-everypay-500 transition-all text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full px-4 py-3 text-sm font-semibold text-white bg-everypay-900 rounded-xl hover:bg-everypay-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-everypay-900 transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
        >
          {submitting ? "Resetting..." : "Reset Password"}
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-500">
          Remembered your password? <Link href="/login" className="font-semibold text-everypay-600 hover:text-everypay-500">Sign in</Link>
        </p>
      </div>
    </div>
    </div>
  );
}
