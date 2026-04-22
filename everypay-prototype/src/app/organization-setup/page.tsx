"use client";

import { useState, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type RecaptchaState = "idle" | "checking" | "challenge" | "verified";

const JURISDICTIONS = [
  "United Arab Emirates (UAE)", "Cayman Islands", "United Kingdom", "Singapore",
  "Switzerland", "British Virgin Islands", "Hong Kong", "United States",
  "Germany", "France", "Japan", "Australia", "Other",
];

const VASP_AUTHORITIES = [
  "VARA (UAE)", "MFSA (Malta)", "FCA (UK)", "FINMA (Switzerland)",
  "MAS (Singapore)", "SEC (USA)", "CFTC (USA)", "BaFin (Germany)",
  "AMF (France)", "FSA (Japan)", "ASIC (Australia)", "CIMA (Cayman)",
  "BVIFSC (BVI)", "SFC (Hong Kong)", "Other",
];

const VASP_LICENSE_TYPES = [
  "Crypto Asset Service Provider (CASP)", "Virtual Asset Service Provider (VASP)",
  "Crypto Exchange License", "Crypto Wallet Provider License",
  "Digital Asset Exchange", "Digital Asset Custody License",
  "Payment Institution (Crypto)", "Money Transmitter License", "Other",
];

const ENTITY_TYPES = [
  { value: "corporation", label: "Corporation" },
  { value: "partnership", label: "Partnership" },
  { value: "llc", label: "LLC" },
  { value: "foundation", label: "Foundation / NGO" },
  { value: "other", label: "Other" },
];

export default function OrganizationSetupPage() {
  const router = useRouter();
  const [orgName, setOrgName] = useState("Digital Account Foundation");
  const [orgType, setOrgType] = useState("foundation");
  const [orgRegNumber, setOrgRegNumber] = useState("REG-2024-9981-DAF");
  const [orgJurisdiction, setOrgJurisdiction] = useState("Cayman Islands");
  const [orgWebsite, setOrgWebsite] = useState("https://digitalaccount.foundation");
  const [hasVasp, setHasVasp] = useState(true);
  const [vaspAuthority, setVaspAuthority] = useState("VARA (UAE)");
  const [vaspLicenseNumber, setVaspLicenseNumber] = useState("VASP-2024-9981");
  const [vaspLicenseType, setVaspLicenseType] = useState("Crypto Asset Service Provider (CASP)");
  const [vaspIssuedDate, setVaspIssuedDate] = useState("2024-03-15");
  const [vaspExpiryDate, setVaspExpiryDate] = useState("2026-03-15");
  const [vaspFileName, setVaspFileName] = useState("");
  const [recaptchaState, setRecaptchaState] = useState<RecaptchaState>("idle");
  const [challengeSelected, setChallengeSelected] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const vaspFileRef = useRef<HTMLInputElement>(null);
  const bizLicenseRef = useRef<HTMLInputElement>(null);

  const handleRecaptchaClick = () => {
    if (recaptchaState !== "idle") return;
    setRecaptchaState("checking");
    setTimeout(() => {
      // 70% chance of showing challenge
      if (Math.random() < 0.7) {
        setRecaptchaState("challenge");
      } else {
        setRecaptchaState("verified");
      }
    }, 1000);
  };

  const toggleChallengeImage = (idx: number) => {
    setChallengeSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const submitChallenge = () => {
    setRecaptchaState("checking");
    setTimeout(() => {
      setRecaptchaState("verified");
      setChallengeSelected([]);
    }, 800);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (recaptchaState !== "verified") {
      setSubmitError("Please complete the human verification.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/compliance-pending");
    }, 1500);
  };

  const selectClass = "w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-everypay-500/20 focus:border-everypay-500 transition-all text-sm appearance-none";

  return (
    <div className="max-w-2xl w-full">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900">Organization Setup</h2>
        <p className="text-slate-500 mt-1 text-sm">Submit your legal business information to activate your institutional account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        {/* Legal Business Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Legal Business Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="col-span-full">
              <label htmlFor="org-name" className="block text-sm font-medium text-slate-700 mb-1.5">Legal Organization Name</label>
              <input type="text" id="org-name" value={orgName} onChange={(e) => setOrgName(e.target.value)} required placeholder="e.g. Acme Asset Management Ltd."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-everypay-500/20 focus:border-everypay-500 transition-all text-sm" />
            </div>

            <div>
              <label htmlFor="org-type" className="block text-sm font-medium text-slate-700 mb-1.5">Business Entity Type</label>
              <select id="org-type" value={orgType} onChange={(e) => setOrgType(e.target.value)} required className={selectClass}>
                <option value="">Select entity type</option>
                {ENTITY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="org-reg-number" className="block text-sm font-medium text-slate-700 mb-1.5">Registration Number</label>
              <input type="text" id="org-reg-number" value={orgRegNumber} onChange={(e) => setOrgRegNumber(e.target.value)} required placeholder="Business ID / Tax ID"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-everypay-500/20 focus:border-everypay-500 transition-all text-sm" />
            </div>

            <div>
              <label htmlFor="org-jurisdiction" className="block text-sm font-medium text-slate-700 mb-1.5">Jurisdiction</label>
              <select id="org-jurisdiction" value={orgJurisdiction} onChange={(e) => setOrgJurisdiction(e.target.value)} required className={selectClass}>
                <option value="">Select jurisdiction</option>
                {JURISDICTIONS.map((j) => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="org-website" className="block text-sm font-medium text-slate-700 mb-1.5">Company Website</label>
              <input type="url" id="org-website" value={orgWebsite} onChange={(e) => setOrgWebsite(e.target.value)} placeholder="https://www.example.com"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-everypay-500/20 focus:border-everypay-500 transition-all text-sm" />
            </div>
          </div>
        </div>

        {/* VASP License */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">VASP License</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={hasVasp} onChange={(e) => setHasVasp(e.target.checked)} className="w-4 h-4 accent-everypay-600" />
              <span className="text-xs text-slate-600">I have a VASP License</span>
            </label>
          </div>

          {hasVasp && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vasp-authority" className="block text-xs font-medium text-slate-700 mb-1">Licensing Authority</label>
                  <select id="vasp-authority" value={vaspAuthority} onChange={(e) => setVaspAuthority(e.target.value)} className={selectClass}>
                    <option value="">Select licensing authority</option>
                    {VASP_AUTHORITIES.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="vasp-license-number" className="block text-xs font-medium text-slate-700 mb-1">License Number</label>
                  <input type="text" id="vasp-license-number" value={vaspLicenseNumber} onChange={(e) => setVaspLicenseNumber(e.target.value)} placeholder="e.g. VASP-2024-XXXXX"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-everypay-500/20 focus:border-everypay-500 transition-all text-sm" />
                </div>
                <div>
                  <label htmlFor="vasp-license-type" className="block text-xs font-medium text-slate-700 mb-1">License Type</label>
                  <select id="vasp-license-type" value={vaspLicenseType} onChange={(e) => setVaspLicenseType(e.target.value)} className={selectClass}>
                    <option value="">Select license type</option>
                    {VASP_LICENSE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="vasp-issued-date" className="block text-xs font-medium text-slate-700 mb-1">Issued Date</label>
                  <input type="date" id="vasp-issued-date" value={vaspIssuedDate} onChange={(e) => setVaspIssuedDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-everypay-500/20 focus:border-everypay-500 transition-all text-sm" />
                </div>
                <div>
                  <label htmlFor="vasp-expiry-date" className="block text-xs font-medium text-slate-700 mb-1">Expiry Date</label>
                  <input type="date" id="vasp-expiry-date" value={vaspExpiryDate} onChange={(e) => setVaspExpiryDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-everypay-500/20 focus:border-everypay-500 transition-all text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">VASP License Document</label>
                <div
                  className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-center hover:border-everypay-400 transition-all group cursor-pointer"
                  onClick={() => vaspFileRef.current?.click()}
                >
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400 group-hover:text-everypay-500 group-hover:bg-everypay-50 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  </div>
                  <div className="text-xs font-semibold text-slate-900">{vaspFileName || "Upload VASP License PDF"}</div>
                  <p className="text-[10px] text-slate-500 mt-1">PDF, PNG or JPG (max. 10MB)</p>
                </div>
                <input type="file" ref={vaspFileRef} className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => {
                  if (e.target.files?.[0]) setVaspFileName(e.target.files[0].name);
                }} />
              </div>
            </div>
          )}
        </div>

        {/* Document Verification */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">KYB Documents</h3>

          <div
            className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center hover:border-everypay-400 transition-all group cursor-pointer"
            onClick={() => bizLicenseRef.current?.click()}
          >
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:text-everypay-500 group-hover:bg-everypay-50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            </div>
            <div className="text-sm font-semibold text-slate-900">Upload Business License</div>
            <p className="text-xs text-slate-500 mt-1">PDF, PNG or JPG (max. 10MB)</p>
          </div>
          <input type="file" ref={bizLicenseRef} className="hidden" accept=".pdf,.png,.jpg,.jpeg" />

          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Note:</strong> Verification typically takes 1-2 business days. You can proceed to set up your wallet policies while we review your documents.
            </p>
          </div>
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
                    onClick={handleRecaptchaClick}
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
                      type="button"
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
          {submitError && <p className="text-xs text-red-500 mt-1">{submitError}</p>}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link href="/no-organization" className="px-6 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-all">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 text-sm font-semibold text-white bg-everypay-900 rounded-xl hover:bg-everypay-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-everypay-900 transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit & Continue"}
          </button>
        </div>
      </form>

      <p className="mt-12 text-center text-xs text-slate-400 pb-12">
        &copy; 2024 Everypay. Compliance & KYB Process.
      </p>
    </div>
  );
}
