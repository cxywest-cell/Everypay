"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { InvoiceLineItem, InvoiceTemplate } from "@/lib/types";

export default function InvoiceCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-2";
  const templateId = searchParams.get("template");

  const [buyerId, setBuyerId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [contractDocUrl, setContractDocUrl] = useState("");
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    { id: "new-li-0", description: "", quantity: 1, unitPrice: 0, currency: "USD" },
  ]);
  const [status, setStatus] = useState<"DRAFT" | "SENT">("DRAFT");
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(templateId || "");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`/api/templates?sellerId=${userId}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.data) setTemplates(result.data as InvoiceTemplate[]);
      })
      .catch(() => {});
  }, [userId]);

  useEffect(() => {
    if (templateId) {
      const tpl = templates.find((t) => t.id === templateId);
      if (tpl) {
        setLineItems(
          tpl.lineItems.map((item, i) => ({
            ...item,
            id: `new-li-${Date.now()}-${i}`,
          }))
        );
        setSelectedTemplate(templateId);
      }
    }
  }, [templateId, templates]);

  const addItem = () => {
    setLineItems([
      ...lineItems,
      { id: `new-li-${Date.now()}`, description: "", quantity: 1, unitPrice: 0, currency: "USD" },
    ]);
  };

  const removeItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceLineItem, value: string | number) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const total = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!buyerId.trim()) newErrors.buyerId = "Buyer ID is required";
    if (lineItems.length === 0) newErrors.lineItems = "At least one line item is required";
    lineItems.forEach((item, i) => {
      if (!item.description.trim()) newErrors[`item-${i}-desc`] = "Description is required";
      if (item.quantity <= 0) newErrors[`item-${i}-qty`] = "Quantity must be > 0";
      if (item.unitPrice < 0) newErrors[`item-${i}-price`] = "Price cannot be negative";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (saveStatus: "DRAFT" | "SENT") => {
    if (saveStatus === "SENT" && !validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: userId,
          buyerId,
          status: saveStatus,
          lineItems: lineItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            currency: item.currency,
          })),
          contractDocumentUrl: contractDocUrl || null,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          templateId: selectedTemplate || null,
        }),
      });
      const result = await res.json();
      if (result.status === "success" && result.data) {
        router.push(`/invoices/${result.data.id}?userId=${userId}`);
      }
    } catch {
      setErrors({ submit: "Failed to create invoice. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Create Invoice</h1>
            <p className="text-sm text-gray-500">Fill in details or load from a template</p>
          </div>
          <Link href="/invoices" className="text-sm text-gray-500 hover:text-gray-700">
            &larr; Back to Invoices
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {errors.submit && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {errors.submit}
          </div>
        )}

        {/* Template selector */}
        {templates.length > 0 && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Load from Template</h2>
            <select
              value={selectedTemplate}
              onChange={(e) => {
                setSelectedTemplate(e.target.value);
                const tpl = templates.find((t) => t.id === e.target.value);
                if (tpl) {
                  setLineItems(
                    tpl.lineItems.map((item, i) => ({
                      ...item,
                      id: `new-li-${Date.now()}-${i}`,
                    }))
                  );
                }
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Select a template...</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (v{t.version})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Invoice details */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">Invoice Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buyer ID</label>
              <input
                type="text"
                value={buyerId}
                onChange={(e) => setBuyerId(e.target.value)}
                className={`w-full rounded-md border ${errors.buyerId ? "border-red-300" : "border-gray-300"} px-3 py-2 text-sm`}
                placeholder="e.g. user-1"
              />
              {errors.buyerId && <p className="mt-1 text-xs text-red-600">{errors.buyerId}</p>}
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
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Contract Document URL (optional)</label>
              <input
                type="text"
                value={contractDocUrl}
                onChange={(e) => setContractDocUrl(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="/contracts/contract.pdf"
              />
            </div>
          </div>
        </div>

        {/* Line items */}
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
              <div key={item.id} className="flex flex-col sm:flex-row gap-2 p-3 bg-gray-50 rounded-md">
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
                <div className="flex items-center text-sm font-mono w-24">
                  {(item.quantity * item.unitPrice).toLocaleString()} {item.currency}
                </div>
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
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
            <span className="text-base font-semibold text-gray-900">
              Total: {total.toLocaleString()} USD
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => handleSubmit("DRAFT")}
            disabled={submitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSubmit("SENT")}
            disabled={submitting}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-everypay-600 hover:bg-everypay-700 disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create & Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
