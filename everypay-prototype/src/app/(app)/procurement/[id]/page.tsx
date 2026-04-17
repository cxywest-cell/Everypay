"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { Procurement } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  SENT_TO_SELLER: "bg-blue-100 text-blue-800",
  SELLER_RESPONDED: "bg-purple-100 text-purple-800",
  TERMS_PROPOSED: "bg-amber-100 text-amber-800",
  NEGOTIATING: "bg-orange-100 text-orange-800",
  TERMS_ACCEPTED: "bg-green-100 text-green-800",
  PAYMENT_INITIATED: "bg-indigo-100 text-indigo-800",
  IN_TRANSIT: "bg-sky-100 text-sky-800",
  RECEIVED: "bg-emerald-100 text-emerald-800",
  SETTLED: "bg-teal-100 text-teal-800",
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  SENT_TO_SELLER: "Sent to Seller",
  SELLER_RESPONDED: "Seller Responded",
  TERMS_PROPOSED: "Terms Proposed",
  NEGOTIATING: "Negotiating",
  TERMS_ACCEPTED: "Terms Accepted",
  PAYMENT_INITIATED: "Payment Initiated",
  IN_TRANSIT: "In Transit",
  RECEIVED: "Received",
  SETTLED: "Settled",
};

// Document types supported across all journey steps
const DOC_TYPES = [
  { value: "contract", label: "Contract", icon: "📄" },
  { value: "invoice", label: "Invoice", icon: "📋" },
  { value: "po", label: "Purchase Order", icon: "📦" },
  { value: "packing_list", label: "Packing List", icon: "📃" },
  { value: "logistics", label: "Logistics Document", icon: "🚢" },
  { value: "customs", label: "Customs Clearance", icon: "🛃" },
  { value: "bank_transfer", label: "Bank Transfer Proof", icon: "🏦" },
  { value: "insurance", label: "Insurance Certificate", icon: "🛡️" },
  { value: "inspection", label: "Inspection Report", icon: "🔍" },
  { value: "supporting", label: "Supporting Document", icon: "📎" },
] as const;

type AttachedDoc = {
  id: string;
  type: string;
  name: string;
  uploadedBy: string;
  uploadedAt: Date;
  size: string;
};

export default function ProcurementDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";
  const [procurement, setProcurement] = useState<Procurement | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Document exchange state
  const [attachedDocs, setAttachedDocs] = useState<AttachedDoc[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadType, setUploadType] = useState("contract");
  const [uploadName, setUploadName] = useState("");
  const [docFilter, setDocFilter] = useState("all");

  // Role detection
  const role = userId === "user-1" ? "buyer" : userId === "user-2" ? "seller" : "approver";

  useEffect(() => {
    fetch(`/api/procurements/${params.id}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.data) setProcurement(result.data as Procurement);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  // Seed mock documents
  useEffect(() => {
    if (procurement) {
      setAttachedDocs([
        {
          id: "doc-1",
          type: "po",
          name: `PO_${procurement.id}.pdf`,
          uploadedBy: procurement.buyerId,
          uploadedAt: new Date(procurement.createdAt),
          size: "1.2 MB",
        },
        {
          id: "doc-2",
          type: "contract",
          name: `Sales_Contract_${procurement.id}.pdf`,
          uploadedBy: procurement.sellerId,
          uploadedAt: new Date(Date.now() - 3600000),
          size: "2.4 MB",
        },
        ...(procurement.status !== "DRAFT" && procurement.status !== "SENT_TO_SELLER"
          ? [
              {
                id: "doc-3",
                type: "invoice",
                name: `Commercial_Invoice_${procurement.id}.pdf`,
                uploadedBy: procurement.sellerId,
                uploadedAt: new Date(Date.now() - 7200000),
                size: "856 KB",
              } as AttachedDoc,
            ]
          : []),
      ]);
    }
  }, [procurement]);

  const handleAction = async (action: "send" | "accept_terms" | "counter" | "confirm_receipt" | "report_non_receipt") => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/procurements/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const result = await res.json();
      if (result.status === "success" && result.data) {
        setProcurement(result.data as Procurement);
      }
    } catch {
      // Error handled silently
    } finally {
      setActionLoading(false);
    }
  };

  const handleAttachDoc = () => {
    if (!uploadName.trim()) return;
    const newDoc: AttachedDoc = {
      id: `doc-${Date.now()}`,
      type: uploadType,
      name: uploadName,
      uploadedBy: userId,
      uploadedAt: new Date(),
      size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
    };
    setAttachedDocs([...attachedDocs, newDoc]);
    setUploadName("");
    setShowUpload(false);
  };

  const filteredDocs =
    docFilter === "all" ? attachedDocs : attachedDocs.filter((d) => d.type === docFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  if (!procurement) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <h2 className="text-lg font-medium text-gray-900">Procurement not found</h2>
        <Link href={`/procurement?userId=${userId}`} className="text-sm text-everypay-600 hover:text-everypay-900">
          &larr; Back to Procurement
        </Link>
      </div>
    );
  }

  const canSend = procurement.status === "DRAFT";
  const canNegotiate = ["TERMS_PROPOSED", "NEGOTIATING"].includes(procurement.status);
  const canAccept = canNegotiate;
  const canConfirmReceipt = procurement.status === "IN_TRANSIT";

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href={`/procurement?userId=${userId}`} className="hover:text-gray-700">Procurement</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{procurement.id}</span>
      </div>

      {/* Status & Header */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[procurement.status]}`}>
              {STATUS_LABELS[procurement.status]}
            </span>
            <span className="text-2xl font-bold text-gray-900">
              {procurement.currency} {procurement.totalAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex gap-2">
            {canSend && (
              <button
                onClick={() => handleAction("send")}
                disabled={actionLoading}
                className="px-3 py-1.5 bg-everypay-600 text-white text-sm font-medium rounded-md hover:bg-everypay-700 disabled:opacity-50"
              >
                Send to Seller
              </button>
            )}
            {canAccept && (
              <>
                <button
                  onClick={() => handleAction("accept_terms")}
                  disabled={actionLoading}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  Accept Terms
                </button>
                <button
                  onClick={() => handleAction("counter")}
                  disabled={actionLoading}
                  className="px-3 py-1.5 bg-amber-600 text-white text-sm font-medium rounded-md hover:bg-amber-700 disabled:opacity-50"
                >
                  Counter-Propose
                </button>
              </>
            )}
            {canConfirmReceipt && (
              <>
                <button
                  onClick={() => handleAction("confirm_receipt")}
                  disabled={actionLoading}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  Confirm Receipt
                </button>
                <button
                  onClick={() => handleAction("report_non_receipt")}
                  disabled={actionLoading}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  Report Non-Receipt
                </button>
              </>
            )}
          </div>
        </div>

        {/* Progress bar for settlement journey */}
        {procurement.status !== "DRAFT" && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Procurement</span>
              <span>Negotiation</span>
              <span>Payment</span>
              <span>Transit</span>
              <span>Settled</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-everypay-600 h-2 rounded-full transition-all"
                style={{
                  width:
                    procurement.status === "SENT_TO_SELLER" ? "15%"
                    : procurement.status === "SELLER_RESPONDED" ? "25%"
                    : ["TERMS_PROPOSED", "NEGOTIATING"].includes(procurement.status) ? "40%"
                    : procurement.status === "TERMS_ACCEPTED" ? "55%"
                    : procurement.status === "PAYMENT_INITIATED" ? "65%"
                    : procurement.status === "IN_TRANSIT" ? "80%"
                    : procurement.status === "RECEIVED" ? "90%"
                    : "100%",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Parties & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-3">Parties & Terms</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-xs text-gray-500 uppercase">Seller</span>
              <span className="text-sm font-medium text-gray-900">{procurement.sellerId}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-xs text-gray-500 uppercase">Buyer</span>
              <span className="text-sm font-medium text-gray-900">{procurement.buyerId}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-xs text-gray-500 uppercase">Corridor</span>
              <span className="text-sm text-gray-900">{procurement.corridor}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-gray-500 uppercase">Due Date</span>
              <span className="text-sm text-gray-900">
                {procurement.dueDate ? new Date(procurement.dueDate).toLocaleDateString() : "Not set"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-3">Line Items</h2>
          <div className="space-y-2">
            {procurement.lineItems.map((item) => (
              <div key={item.id} className="py-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">{item.description}</span>
                  <span className="text-sm font-mono font-medium">
                    {item.quantity} × {item.currency} {item.unitPrice.toLocaleString()}
                  </span>
                </div>
                {(item.hsCode || item.specs) && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    {item.hsCode && <span>HS: {item.hsCode}</span>}
                    {item.hsCode && item.specs && <span className="mx-1">·</span>}
                    {item.specs && <span>{item.specs}</span>}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-2 border-t border-gray-200 flex justify-between">
              <span className="text-sm font-semibold text-gray-900">Total</span>
              <span className="text-sm font-mono font-bold text-gray-900">
                {procurement.currency} {procurement.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
          {procurement.notes && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 uppercase mb-1">Notes</p>
              <p className="text-sm text-gray-700">{procurement.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Document Exchange — unified, document-agnostic */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Document Exchange</h2>
            <p className="text-xs text-gray-500">
              All documents shared between parties for this procurement
            </p>
          </div>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="px-3 py-1.5 bg-everypay-600 text-white text-xs font-medium rounded-md hover:bg-everypay-700"
          >
            {showUpload ? "Cancel" : "Attach Document"}
          </button>
        </div>

        {/* Upload form */}
        {showUpload && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Document Type</label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  {DOC_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">File Name</label>
                <input
                  type="text"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. Bill_of_Lading_12345.pdf"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={handleAttachDoc}
                disabled={!uploadName.trim()}
                className="px-4 py-1.5 bg-everypay-600 text-white text-sm font-medium rounded-md hover:bg-everypay-700 disabled:opacity-50"
              >
                Attach
              </button>
            </div>
          </div>
        )}

        {/* Document type filter */}
        <div className="px-6 py-3 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDocFilter("all")}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                docFilter === "all"
                  ? "bg-everypay-100 text-everypay-800 border-everypay-300"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              All ({attachedDocs.length})
            </button>
            {DOC_TYPES.map((t) => {
              const count = attachedDocs.filter((d) => d.type === t.value).length;
              if (count === 0) return null;
              return (
                <button
                  key={t.value}
                  onClick={() => setDocFilter(t.value)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    docFilter === t.value
                      ? "bg-everypay-100 text-everypay-800 border-everypay-300"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {t.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Document list */}
        <div className="divide-y divide-gray-100">
          {filteredDocs.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-400">No documents attached yet</p>
            </div>
          ) : (
            filteredDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{DOC_TYPES.find((t) => t.value === doc.type)?.icon || "📎"}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">
                      {doc.type.replace("_", " ")} &middot; {doc.size} &middot; by {doc.uploadedBy}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {doc.uploadedAt.toLocaleDateString()}
                  </span>
                  <span className="text-xs text-everypay-600 hover:text-everypay-900 cursor-pointer">
                    View &rarr;
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Payment Agreement CTA — shown when seller has responded with terms */}
      {(procurement.status === "TERMS_PROPOSED" || procurement.status === "NEGOTIATING" || procurement.status === "SELLER_RESPONDED") && (
        <div className="bg-everypay-50 border border-everypay-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-everypay-900 mb-1">
            Payment terms are being negotiated
          </h3>
          <p className="text-sm text-everypay-700 mb-3">
            Review the seller&apos;s proposed terms and either accept or counter-propose.
          </p>
          <Link
            href={`/payment-agreements/${procurement.id}/review?userId=${userId}`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-everypay-600 hover:bg-everypay-700"
          >
            Review Terms
          </Link>
        </div>
      )}
    </div>
  );
}
