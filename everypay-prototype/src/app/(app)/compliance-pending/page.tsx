"use client";

import { useState, useRef } from "react";

const LOG_ENTRIES = [
  {
    id: "log-3",
    status: "Questions Raised",
    date: "Mar 20, 2026",
    time: "02:30 PM",
    by: "Compliance Team",
    description: "Our compliance team has reviewed your submission and requires clarification on the following:",
    questions: [
      { q: "Q1", text: "Please provide your <strong>Certificate of Incorporation</strong> issued by the relevant authority.", highlighted: true },
      { q: "Q2", text: "Please provide <strong>proof of address</strong> for your registered office.", highlighted: true },
      { q: "Q3", text: "Please describe your <strong>primary business activities</strong> and the types of clients you serve.", highlighted: false },
    ],
    responding: false,
  },
  {
    id: "log-2",
    status: "Under Review",
    date: "Mar 20, 2026",
    time: "10:15 AM",
    by: "Compliance Team",
    description: "Initial document review started. Awaiting compliance officer assignment and detailed assessment.",
    questions: [],
    responding: false,
  },
  {
    id: "log-1",
    status: "Application Submitted",
    date: "Mar 20, 2026",
    time: "09:41 AM",
    by: "System",
    description: "Your organization profile and KYB information have been submitted for compliance review.",
    questions: [],
    responding: false,
  },
];

export default function CompliancePendingPage() {
  const [logEntries, setLogEntries] = useState(LOG_ENTRIES);
  const q1FileRef = useRef<HTMLInputElement>(null);
  const q2FileRef = useRef<HTMLInputElement>(null);

  const toggleRespond = (logId: string) => {
    setLogEntries((prev) =>
      prev.map((e) => (e.id === logId ? { ...e, responding: !e.responding } : e))
    );
  };

  const submitResponse = () => {
    toggleRespond("log-3");
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        {/* Org Name + Status Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Digital Account Foundation</h2>
            <p className="text-sm text-slate-500 mt-1">Your KYB Application</p>
          </div>
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-700">In Review</span>
        </div>

        {/* KYB Info Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
          {/* Header Banner */}
          <div className="flex items-center gap-4 p-5 bg-amber-50 border-b border-amber-100">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <div className="text-sm font-bold text-amber-900">Awaiting Compliance Review</div>
              <p className="text-xs text-amber-700">Submitted on Mar 20, 2026</p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* VASP License Section */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  <span className="text-sm font-bold text-blue-900">VASP License</span>
                </div>
                <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold">VASP</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-blue-700">Licensing Authority</span>
                  <span className="font-semibold text-blue-900">VARA (UAE)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-blue-700">License Number</span>
                  <span className="font-semibold text-blue-900">VASP-2024-9981</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-blue-700">License Type</span>
                  <span className="font-semibold text-blue-900">Crypto Asset Service Provider</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-blue-700">Issued Date</span>
                  <span className="font-semibold text-blue-900">Mar 15, 2024</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-blue-700">Expiry Date</span>
                  <span className="font-semibold text-blue-900">Mar 15, 2026</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-200">
                <label className="block text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2">Verified Documents</label>
                <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    <span className="text-xs font-medium text-blue-800">VASP_License_2024.pdf</span>
                  </div>
                  <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase">View</button>
                </div>
              </div>
            </div>

            {/* Core KYB Fields */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Legal Name</label>
                <div className="text-sm font-semibold text-slate-900">Digital Account Foundation</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Entity Type</label>
                  <div className="text-sm font-semibold text-slate-900">Foundation / NGO</div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Jurisdiction</label>
                  <div className="text-sm font-semibold text-slate-900">Cayman Islands</div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Registration Number</label>
                <div className="text-sm font-mono font-semibold text-slate-900">REG-2024-9981-DAF</div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Website</label>
                <a href="https://digitalaccount.foundation" className="text-sm font-semibold text-everypay-600 hover:underline">https://digitalaccount.foundation</a>
              </div>
            </div>

            {/* Submitted Documents */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Submitted Documents</label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    <span className="text-xs font-medium text-slate-700">Business_Registration_Certificate.pdf</span>
                  </div>
                  <button className="text-[10px] font-bold text-everypay-600 hover:text-everypay-700 uppercase">View</button>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    <span className="text-xs font-medium text-slate-700">Articles_of_Association.pdf</span>
                  </div>
                  <button className="text-[10px] font-bold text-everypay-600 hover:text-everypay-700 uppercase">View</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Procedure Log */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Progress</h3>
            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{logEntries.length} entries</span>
          </div>
          <div className="p-5 space-y-5">
            {logEntries.map((entry, i) => (
              <div key={entry.id} className="flex gap-4">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-3 h-3 rounded-full mt-1.5 ${
                    i === 0 ? "bg-amber-500" : i === logEntries.length - 1 ? "bg-emerald-500" : "bg-blue-500"
                  }`} />
                  {i < logEntries.length - 1 && <div className="w-0.5 flex-1 bg-slate-100" />}
                </div>
                <div className={`flex-1 ${i < logEntries.length - 1 ? "pb-4" : ""}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-800">{entry.status}</span>
                    <span className="text-[10px] text-slate-400">{entry.date} &nbsp; {entry.time}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">By: {entry.by}</div>
                  <div className="text-xs text-slate-600 mt-1">{entry.description}</div>

                  {entry.questions.length > 0 && (
                    <div className="space-y-1.5 mt-2">
                      {entry.questions.map((q) => (
                        <div key={q.q} className={`flex items-start gap-1.5 p-2 rounded-lg ${q.highlighted ? "bg-amber-50 border border-amber-100" : "bg-slate-50 border border-slate-200"}`}>
                          <span className={`font-bold text-[10px] mt-0.5 ${q.highlighted ? "text-amber-600" : "text-slate-600"}`}>{q.q}</span>
                          <span className={`text-xs ${q.highlighted ? "text-amber-800" : "text-slate-700"}`} dangerouslySetInnerHTML={{ __html: q.text }} />
                        </div>
                      ))}
                    </div>
                  )}

                  {entry.questions.length > 0 && (
                    <div className="mt-3">
                      <button
                        onClick={() => toggleRespond(entry.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-all"
                      >
                        Respond to This Request
                      </button>

                      {entry.responding && (
                        <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                          <div className="text-xs font-semibold text-slate-700 mb-2">Your Response</div>

                          {entry.questions.filter((q) => q.highlighted).map((q) => (
                            <div key={q.q} className="p-3 bg-white border border-slate-200 rounded-lg">
                              <div className="text-[11px] font-semibold text-amber-800 mb-2">{q.q} — {q.text.replace(/<[^>]*>/g, "")}</div>
                              <div className="mb-2">
                                <label className="block text-[10px] text-slate-500 mb-1">Upload document</label>
                                <input
                                  type="file"
                                  ref={q.q === "Q1" ? q1FileRef : q2FileRef}
                                  className="hidden"
                                  onChange={(e) => {
                                    const label = e.target.closest("input")?.parentElement?.querySelector("span");
                                    if (label && e.target.files?.[0]) label.textContent = e.target.files[0].name;
                                  }}
                                />
                                <label className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium rounded-lg cursor-pointer transition-all">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                  <span>Choose File</span>
                                </label>
                              </div>
                              <div>
                                <label className="block text-[10px] text-slate-500 mb-1">Additional notes</label>
                                <textarea rows={2} className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-everypay-400 resize-none" placeholder="Optional note..." />
                              </div>
                            </div>
                          ))}

                          {entry.questions.filter((q) => !q.highlighted).map((q) => (
                            <div key={q.q} className="p-3 bg-white border border-slate-200 rounded-lg">
                              <div className="text-[11px] font-semibold text-slate-700 mb-2">{q.q} — Primary Business Activities <span className="text-[10px] text-slate-400 font-normal">(text answer)</span></div>
                              <label className="block text-[10px] text-slate-500 mb-1">Describe your primary business activities and types of clients you serve</label>
                              <textarea rows={3} className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-everypay-400 resize-none" placeholder="e.g. We provide crypto custody and trading services..." />
                            </div>
                          ))}

                          <div className="flex gap-2 pt-1">
                            <button onClick={submitResponse} className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all">Submit Response</button>
                            <button onClick={() => toggleRespond(entry.id)} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all">Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
