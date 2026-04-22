export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white min-h-screen flex overflow-y-auto">
      {/* Left Panel: Branding & Onboarding Context */}
      <div className="hidden lg:flex lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-1/3 bg-everypay-900 items-center justify-center p-12 text-white z-10">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-everypay-600 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-sm">
          <div className="mb-8 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-everypay-500 to-everypay-600 rounded-lg shadow-lg flex items-center justify-center">
              <span className="text-sm font-bold">E</span>
            </div>
            <span className="text-lg font-bold">Everypay</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-6 leading-tight">
            Establish your <span className="text-transparent bg-clip-text bg-gradient-to-r from-everypay-400 to-emerald-300">Organization</span>
          </h1>
          <p className="text-everypay-200 mb-10 leading-relaxed text-sm">
            Before you can manage institutional assets, we need to verify your business identity through our KYB (Know Your Business) process.
          </p>

          <div className="space-y-4">
            <div className="text-[10px] font-semibold text-everypay-400 uppercase tracking-wider mb-2">Pre-Approval</div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-everypay-500/20 flex-shrink-0 flex items-center justify-center text-everypay-400 text-xs font-bold border border-everypay-500/30">1</div>
              <div>
                <div className="text-sm font-semibold text-everypay-300">Business Identity</div>
                <p className="text-xs text-everypay-400">Legal name and registration details</p>
              </div>
            </div>
            <div className="flex gap-4 items-start opacity-50">
              <div className="w-8 h-8 rounded-full bg-everypay-800 flex-shrink-0 flex items-center justify-center text-everypay-400 text-xs font-bold">2</div>
              <div>
                <div className="text-sm font-semibold text-everypay-400">Compliance Review</div>
                <p className="text-xs text-everypay-500">Platform verification process</p>
              </div>
            </div>
            <div className="flex gap-4 items-start opacity-50">
              <div className="w-8 h-8 rounded-full bg-everypay-800 flex-shrink-0 flex items-center justify-center text-everypay-400 text-xs font-bold">3</div>
              <div>
                <div className="text-sm font-semibold text-everypay-400">Final Approval</div>
                <p className="text-xs text-everypay-500">Organization activation</p>
              </div>
            </div>

            <div className="border-t border-everypay-700/50 my-4" />

            <div className="text-[10px] font-semibold text-everypay-400 uppercase tracking-wider mb-2">Onboarding</div>
            <div className="flex gap-4 items-start opacity-50">
              <div className="w-8 h-8 rounded-full bg-everypay-800 flex-shrink-0 flex items-center justify-center text-everypay-400 text-xs font-bold">4</div>
              <div>
                <div className="text-sm font-semibold text-everypay-400">Build Your Team</div>
                <p className="text-xs text-everypay-500">Invite team members</p>
              </div>
            </div>
            <div className="flex gap-4 items-start opacity-50">
              <div className="w-8 h-8 rounded-full bg-everypay-800 flex-shrink-0 flex items-center justify-center text-everypay-400 text-xs font-bold">5</div>
              <div>
                <div className="text-sm font-semibold text-everypay-400">Create Treasury Unit</div>
                <p className="text-xs text-everypay-500">Set up your first unit</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: KYB Form */}
      <div className="w-full lg:ml-[33.3333%] lg:w-2/3 flex items-center justify-center p-6 sm:p-12 bg-slate-50 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
