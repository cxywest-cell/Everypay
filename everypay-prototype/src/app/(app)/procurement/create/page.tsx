"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { ProcurementLineItem, Counterparty } from "@/lib/types";

export default function ProcurementCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-1";

  const [sellerId, setSellerId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [corridor, setCorridor] = useState("BRL");
  const [lineItems, setLineItems] = useState<ProcurementLineItem[]>([
    { id: "new-li-0", description: "", quantity: 1, unitPrice: 0, currency: "USD", hsCode: "", specs: "" },
  ]);
  const [notes, setNotes] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadDocType, setUploadDocType] = useState("contract");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);

  useEffect(() => {
    fetch("/api/counterparties")
      .then((res) => res.json())
      .then((result) => {
        if (result.data) setCounterparties(result.data as Counterparty[]);
      })
      .catch(() => {});
  }, []);

  const addItem = () => {
    setLineItems([
      ...lineItems,
      { id: `new-li-${Date.now()}`, description: "", quantity: 1, unitPrice: 0, currency: "USD", hsCode: "", specs: "" },
    ]);
  };

  const removeItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof ProcurementLineItem, value: string | number) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const handleAttachFile = () => {
    if (!uploadFileName.trim()) return;
    setAttachedFiles([...attachedFiles, `${uploadDocType}:${uploadFileName}`]);
    setUploadFileName("");
    setShowUpload(false);
  };

  const total = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!sellerId.trim()) newErrors.sellerId = "Seller is required";
    if (lineItems.length === 0) newErrors.lineItems = "At least one line item is required";
    lineItems.forEach((item, i) => {
      if (!item.description.trim()) newErrors[`item-${i}-desc`] = "Description is required";
      if (item.quantity <= 0) newErrors[`item-${i}-qty`] = "Quantity must be > 0";
      if (item.unitPrice < 0) newErrors[`item-${i}-price`] = "Price cannot be negative";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (saveAsDraft: boolean) => {
    if (!saveAsDraft && !validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/procurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: userId,
          sellerId,
          status: saveAsDraft ? "DRAFT" : "SENT_TO_SELLER",
          corridor,
          lineItems: lineItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            currency: item.currency,
            hsCode: item.hsCode || null,
            specs: item.specs || null,
          })),
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          notes: notes || null,
        }),
      });
      const result = await res.json();
      if (result.status === "success" && result.data) {
        router.push(`/procurement/${result.data.id}?userId=${userId}`);
      }
    } catch {
      setErrors({ submit: "Failed to create procurement. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href={`/procurement?userId=${userId}`} className="hover:text-gray-700">Procurement</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">New</span>
      </div>

      {errors.submit && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {errors.submit}
        </div>
      )}

      {/* Counterparty & Terms */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-medium text-gray-900 mb-4">Counterparty & Terms</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seller</label>
            <select
              value={sellerId}
              onChange={(e) => setSellerId(e.target.value)}
              className={`w-full rounded-md border ${errors.sellerId ? "border-red-300" : "border-gray-300"} px-3 py-2 text-sm`}
            >
              <option value="">Select a seller...</option>
              {counterparties.map((c) => (
                <option key={c.companyId} value={c.companyId}>
                  {c.companyName}
                </option>
              ))}
            </select>
            {errors.sellerId && <p className="mt-1 text-xs text-red-600">{errors.sellerId}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Corridor</label>
            <select
              value={corridor}
              onChange={(e) => setCorridor(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="BRL">BRL → USD/HKD (Brazil)</option>
              <option value="ARS">ARS → USD/HKD (Argentina)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-900">Line Items</h2>
          <button
            type="button"
            onClick={addItem}
            className="text-sm text-everypay-600 hover:text-everypay-900 font-medium"
          >
            + Add Item
          </button>
        </div>
        {errors.lineItems && <p className="mb-3 text-xs text-red-600">{errors.lineItems}</p>}
        <div className="space-y-3">
          {lineItems.map((item, index) => (
            <div key={item.id} className="p-3 bg-gray-50 rounded-md space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(index, "description", e.target.value)}
                    className={`w-full rounded-md border ${errors[`item-${index}-desc`] ? "border-red-300" : "border-gray-300"} px-2 py-1.5 text-sm`}
                    placeholder="Description"
                  />
                </div>
                <div className="w-20">
                  <input
                    type="number"
                    value={item.quantity}
                    min={1}
                    onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)}
                    className={`w-full rounded-md border ${errors[`item-${index}-qty`] ? "border-red-300" : "border-gray-300"} px-2 py-1.5 text-sm`}
                    placeholder="Qty"
                  />
                </div>
                <div className="w-28">
                  <input
                    type="number"
                    value={item.unitPrice}
                    min={0}
                    step={0.01}
                    onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                    className={`w-full rounded-md border ${errors[`item-${index}-price`] ? "border-red-300" : "border-gray-300"} px-2 py-1.5 text-sm`}
                    placeholder="Price"
                  />
                </div>
                <div className="w-20">
                  <select
                    value={item.currency}
                    onChange={(e) => updateItem(index, "currency", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                  >
                    <option value="USD">USD</option>
                    <option value="HKD">HKD</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={item.hsCode || ""}
                    onChange={(e) => updateItem(index, "hsCode", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                    placeholder="HS Code (customs classification)"
                  />
                </div>
                <div className="flex-[2]">
                  <input
                    type="text"
                    value={item.specs || ""}
                    onChange={(e) => updateItem(index, "specs", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                    placeholder="Product specs (optional)"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-gray-700">
                  {(item.quantity * item.unitPrice).toLocaleString()} {item.currency}
                </span>
                {lineItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
          <span className="text-base font-semibold text-gray-900">
            Total: {total.toLocaleString()} {lineItems[0]?.currency || "USD"}
          </span>
        </div>
      </div>

      {/* Contract / PO Upload */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-medium text-gray-900">Contract & Documents</h2>
            <p className="text-xs text-gray-500">Upload contract, PO, or supporting documents</p>
          </div>
          <button
            type="button"
            onClick={() => setShowUpload(!showUpload)}
            className="text-sm text-everypay-600 hover:text-everypay-900 font-medium"
          >
            {showUpload ? "Cancel" : "+ Attach Document"}
          </button>
        </div>

        {showUpload && (
          <div className="mb-4 p-4 bg-gray-50 rounded-md space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Document Type</label>
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="contract">Contract / PO</option>
                  <option value="spec">Product Specs</option>
                  <option value="customs">Customs Classification</option>
                  <option value="supporting">Supporting Document</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">File Name</label>
                <input
                  type="text"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="e.g. Sales_Contract_2026.pdf"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAttachFile}
                disabled={!uploadFileName.trim()}
                className="px-4 py-1.5 bg-everypay-600 text-white text-sm font-medium rounded-md hover:bg-everypay-700 disabled:opacity-50"
              >
                Attach
              </button>
            </div>
          </div>
        )}

        {attachedFiles.length > 0 && (
          <div className="space-y-1">
            {attachedFiles.map((file, i) => {
              const [type, name] = file.split(":");
              return (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <DocIcon type={type} />
                    <span className="text-sm text-gray-900">{name}</span>
                    <span className="text-xs text-gray-500">{type}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachedFiles(attachedFiles.filter((_, idx) => idx !== i))}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {attachedFiles.length === 0 && (
          <p className="text-xs text-gray-400">No documents attached yet</p>
        )}
      </div>

      {/* Notes */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-medium text-gray-900 mb-3">Notes (optional)</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="Additional terms, delivery instructions, etc."
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => handleSubmit(true)}
          disabled={submitting}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Save as Draft
        </button>
        <button
          onClick={() => handleSubmit(false)}
          disabled={submitting}
          className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-everypay-600 hover:bg-everypay-700 disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Send to Seller"}
        </button>
      </div>
    </div>
  );
}

function DocIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    contract: "📄",
    spec: "📋",
    customs: "🛃",
    supporting: "📎",
  };
  return <span>{icons[type] || "📎"}</span>;
}
