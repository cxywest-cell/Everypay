"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("alice.liu@globaltech.com");
  const [password, setPassword] = useState("Password123!");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScenarioModal, setShowScenarioModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [recaptchaState, setRecaptchaState] = useState<"idle" | "checking" | "challenge" | "verified">("idle");
  const [challengeSelected, setChallengeSelected] = useState<number[]>([]);

  const handleLogin = () => {
    if (!isVerified) {
      setRecaptchaState("checking");
      setTimeout(() => {
        setRecaptchaState("challenge");
      }, 1000);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowScenarioModal(true);
    }, 800);
  };

  const handlePasskeyLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsVerified(true);
      setShowScenarioModal(true);
    }, 1500);
  };

  const submitChallenge = () => {
    setRecaptchaState("checking");
    setTimeout(() => {
      setRecaptchaState("verified");
      setIsVerified(true);
    }, 800);
  };

  const toggleChallengeImage = (idx: number) => {
    setChallengeSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const selectScenario = (scenario: "buyer" | "seller" | "cfo" | "no-org") => {
    if (scenario === "no-org") {
      setShowScenarioModal(false);
      localStorage.setItem("loggedIn", "true");
      router.push("/no-organization");
      return;
    }
    const userIdMap = { buyer: "user-1", seller: "user-2", cfo: "user-3" };
    setShowScenarioModal(false);
    localStorage.setItem("loggedIn", "true");
    router.push(`/?userId=${userIdMap[scenario]}`);
  };

  return (
    <>
      <div className="w-full max-w-md">
      {/* Login Form */}
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center justify-center h-10 w-10 bg-everypay-600 text-xl font-bold text-white rounded-lg shadow-lg hover:bg-everypay-700 transition-colors mb-4">
            E
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="text-sm text-slate-500 mt-1">Sign in to access your payment dashboard</p>
        </div>

        {/* Passkey Sign In */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handlePasskeyLogin}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-sm font-semibold text-slate-700 shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-everypay-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Authenticating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-everypay-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Sign in with Passkey
              </>
            )}
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Or use email</span></div>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
            <div className="relative">
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
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
              <Link href="/forgot-password" className="text-xs font-semibold text-everypay-600 hover:text-everypay-500">Forgot?</Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-everypay-500/20 focus:border-everypay-500 transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-center pt-1">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-everypay-600 focus:ring-everypay-500 border-slate-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600">Keep me logged in for 30 days</label>
          </div>

          {/* Human Verification */}
          <div className="pt-2">
            {recaptchaState === "idle" && (
              <div className="text-xs text-slate-400 mb-2 text-center">Verification appears after 3 failed attempts</div>
            )}
            <div className="border border-slate-300 rounded-lg overflow-hidden bg-white">
              <div className="bg-slate-100 px-3 py-2 flex items-center justify-between border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                  <span className="text-xs font-medium text-slate-600">reCAPTCHA</span>
                </div>
                <div className="text-[10px] text-slate-400">Privacy · Terms</div>
              </div>

              {recaptchaState === "idle" && (
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 border-2 border-slate-400 rounded-md bg-white flex items-center justify-center transition-all cursor-pointer hover:bg-slate-50 mt-0.5"
                      onClick={handleLogin}
                    />
                    <div className="flex-1">
                      <div className="text-sm text-slate-700">I&apos;m not a robot</div>
                      <div className="text-xs text-slate-500 mt-1">Click to verify</div>
                    </div>
                  </div>
                </div>
              )}

              {recaptchaState === "checking" && (
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 border-2 border-slate-400 rounded-md bg-white flex items-center justify-center animate-pulse mt-0.5">
                      <svg className="animate-spin h-4 w-4 text-everypay-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-700">Analyzing...</div>
                      <div className="text-xs text-blue-600 mt-1">Please wait</div>
                    </div>
                  </div>
                </div>
              )}

              {recaptchaState === "challenge" && (
                <div className="border-t border-slate-200">
                  <div className="bg-slate-50 px-3 py-2 border-b border-slate-200">
                    <div className="text-xs font-medium text-slate-700">Select all images with <span className="text-everypay-600 font-bold">checkmarks</span></div>
                  </div>
                  <div className="p-2">
                    <div className="grid grid-cols-3 gap-1">
                      {[0, 1, 2, 3, 4, 5].map((idx) => (
                        <div
                          key={idx}
                          className={`cursor-pointer border-2 rounded overflow-hidden relative transition-all ${
                            challengeSelected.includes(idx) ? "border-everypay-500" : "border-transparent hover:border-everypay-500"
                          }`}
                          onClick={() => toggleChallengeImage(idx)}
                        >
                          <div className={`aspect-square flex items-center justify-center ${
                            idx % 2 === 0 ? "bg-gradient-to-br from-green-400 to-green-600" : "bg-gradient-to-br from-slate-300 to-slate-500"
                          }`}>
                            {idx % 2 === 0 ? (
                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                            ) : (
                              <svg className="w-8 h-8 text-white/50" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /></svg>
                            )}
                          </div>
                          {challengeSelected.includes(idx) && (
                            <div className="absolute top-1 right-1 w-5 h-5 bg-everypay-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-[10px] text-slate-500">Select images with checkmarks</div>
                      <button
                        onClick={submitChallenge}
                        disabled={challengeSelected.length === 0}
                        className="px-3 py-1 text-xs font-medium bg-everypay-900 text-white rounded hover:bg-everypay-800 transition-all duration-200 disabled:opacity-50"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {recaptchaState === "verified" && (
                <div className="bg-green-50 px-3 py-2 border-t border-green-200">
                  <div className="flex items-center gap-2 text-xs text-green-700">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={isSubmitting}
            className="w-full px-4 py-3 text-sm font-semibold text-white bg-everypay-900 rounded-xl hover:bg-everypay-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-everypay-900 transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Don&apos;t have an account? <Link href="/register" className="font-semibold text-everypay-600 hover:text-everypay-500">Get started</Link>
          </p>
        </div>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-slate-400">
        &copy; 2024 Everypay. All rights reserved. <br />
        <a href="#" className="hover:text-slate-600">Privacy Policy</a> &bull; <a href="#" className="hover:text-slate-600">Terms of Service</a>
      </p>

      {/* Demo Scenario Selection Modal */}
      {showScenarioModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Select Demo Scenario</h3>
              <p className="text-sm text-gray-500 mt-1">Choose how you want to experience the demo</p>
            </div>
            <div className="p-6 space-y-4">
              <button
                onClick={() => selectScenario("buyer")}
                className="w-full p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-everypay-300 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-everypay-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-everypay-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Carlos — Buyer</div>
                    <div className="text-sm text-gray-500">Propose trade agreements, manage procurement</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => selectScenario("seller")}
                className="w-full p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-emerald-300 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Wei — Seller</div>
                    <div className="text-sm text-gray-500">Respond to proposals, negotiate terms</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => selectScenario("cfo")}
                className="w-full p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-amber-300 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Li — CFO / Approver</div>
                    <div className="text-sm text-gray-500">Review and approve/reject trade agreements</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => selectScenario("no-org")}
                className="w-full p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-slate-400 transition-all text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-900">No Organization Found</div>
                      <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                    <div className="text-sm text-gray-500">Experience the onboarding flow for unassociated accounts</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
