export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white min-h-screen flex">
      {/* Left Panel: Branding & Marketing */}
      <div className="hidden lg:flex lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-1/2 bg-everypay-900 items-center justify-center p-12 text-white overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-everypay-600 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-lg">
          {/* Logo */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-everypay-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              E
            </div>
            <span className="text-2xl font-bold tracking-tight">Everypay</span>
          </div>

          <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-xs font-medium text-everypay-300">
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Now integrated with Cregis Custody
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
            Global Trading Settlement. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-everypay-400 to-cyan-300">Powered by Crypto</span>.
          </h1>
          <p className="text-lg text-everypay-100 mb-10 leading-relaxed">
            The unified platform for international trade. Settle procurement and sales instantly with stablecoins, automate invoice reconciliation, and secure your treasury with bank-grade custody.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <div className="text-blue-400 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div className="font-semibold text-sm">Instant Settlement</div>
              <div className="text-xs text-slate-500">USDT/USDC payments</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <div className="text-emerald-400 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div className="font-semibold text-sm">Trade Collection</div>
              <div className="text-xs text-slate-500">Auto-reconciliation</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <div className="text-amber-400 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <div className="font-semibold text-sm">Liquidity Management</div>
              <div className="text-xs text-slate-500">Bank-grade custody</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <div className="text-purple-400 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <div className="font-semibold text-sm">Transparent Approvals</div>
              <div className="text-xs text-slate-500">Full audit trails</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Auth Form */}
      <div className="w-full lg:ml-[50%] lg:w-1/2 lg:min-h-screen lg:overflow-y-auto flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        {children}
      </div>
    </div>
  );
}
