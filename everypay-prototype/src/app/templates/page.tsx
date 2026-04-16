"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { InvoiceTemplate, InvoiceLineItem } from "@/lib/types";

export default function TemplatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-2";
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Create form
  const [name, setName] = useState("");
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    { id: "new-tpl-li-0", description: "", quantity: 1, unitPrice: 0, currency: "USD" },
  ]);
  const [paymentTerms, setPaymentTerms] = useState("");
  const [contractRef, setContractRef] = useState("");

  useEffect(() => {
    fetch(`/api/templates?sellerId=${userId}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.data) setTemplates(result.data as InvoiceTemplate[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: `new-tpl-li-${Date.now()}`, description: "", quantity: 1, unitPrice: 0, currency: "USD" },
    ]);
  };

  const updateLineItem = (index: number, field: keyof InvoiceLineItem, value: string | number) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: userId,
          name,
          lineItems: lineItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            currency: item.currency,
          })),
          contractReference: contractRef || null,
          paymentTerms: paymentTerms || null,
        }),
      });
      const result = await res.json();
      if (result.status === "success" && result.data) {
        setTemplates([...templates, result.data as InvoiceTemplate]);
        setShowCreate(false);
        setName("");
        setLineItems([{ id: "new-tpl-li-0", description: "", quantity: 1, unitPrice: 0, currency: "USD" }]);
        setPaymentTerms("");
        setContractRef("");
      }
    } catch {
      // Error handled silently
    }
  };

  const handleSetDefault = async (templateId: string, buyerId: string) => {
    if (!buyerId.trim()) return;
    try {
      const res = await fetch("/api/templates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          action: "set_default",
          buyerId,
        }),
      });
      const result = await res.json();
      if (result.status === "success" && result.data) {
        setTemplates(
          templates.map((t) =>
            t.id === templateId ? (result.data as InvoiceTemplate) : t
          )
        );
        setEditingId(null);
      }
    } catch {
      // Error handled silently
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Invoice Templates</h1>
            <p className="text-sm text-gray-500">Manage reusable invoice templates</p>
          </div>
          <div className="flex space-x-3">
            <Link href="/invoices" className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2">
              &larr; Back
            </Link>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-everypay-600 hover:bg-everypay-700"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Template
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create form */}
        {showCreate && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <h2 className="text-sm font-medium text-gray-900 mb-4">Create Template</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="e.g. Electronics Standard Order"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="e.g. NET 30"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Reference (optional)</label>
                <input
                  type="text"
                  value={contractRef}
                  onChange={(e) => setContractRef(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="/contracts/standard.pdf"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Line Items</span>
                <button onClick={addLineItem} className="text-sm text-everypay-600 hover:text-everypay-900">
                  + Add Item
                </button>
              </div>
              {lineItems.map((item, index) => (
                <div key={item.id} className="flex gap-2 mb-2 p-2 bg-gray-50 rounded">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateLineItem(index, "description", e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                    placeholder="Description"
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    min={1}
                    onChange={(e) => updateLineItem(index, "quantity", parseInt(e.target.value) || 0)}
                    className="w-16 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                  />
                  <input
                    type="number"
                    value={item.unitPrice}
                    min={0}
                    step={0.01}
                    onChange={(e) => updateLineItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                    className="w-24 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                  />
                  <select
                    value={item.currency}
                    onChange={(e) => updateLineItem(index, "currency", e.target.value)}
                    className="w-20 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                  >
                    <option value="USD">USD</option>
                    <option value="HKD">HKD</option>
                  </select>
                  {lineItems.length > 1 && (
                    <button onClick={() => removeLineItem(index)} className="text-red-500 text-sm">
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-everypay-600 text-white rounded-md text-sm hover:bg-everypay-700"
              >
                Create Template
              </button>
            </div>
          </div>
        )}

        {/* Template list */}
        {templates.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-200 py-16 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No templates</h3>
            <p className="mt-1 text-sm text-gray-500">Create your first invoice template to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-xs text-gray-500">
                      {template.id} &middot; v{template.version}
                      {template.supersededBy && " (superseded)"}
                      {template.defaultForBuyerId && ` &middot; Default for ${template.defaultForBuyerId}`}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingId(editingId === template.id ? null : template.id)}
                    className="text-sm text-everypay-600 hover:text-everypay-900"
                  >
                    Set Default
                  </button>
                </div>

                {/* Line items preview */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {template.lineItems.map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center px-2 py-1 bg-gray-50 rounded text-xs text-gray-700"
                    >
                      {item.description} &middot; {item.quantity} &times; {item.currency} {item.unitPrice.toLocaleString()}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {template.paymentTerms ? `Terms: ${template.paymentTerms}` : "No payment terms"}
                    {template.contractReference ? ` &middot; Contract: ${template.contractReference}` : ""}
                  </span>
                  <span>Updated {new Date(template.updatedAt).toLocaleDateString()}</span>
                </div>

                {/* Set default inline */}
                {editingId === template.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                    <input
                      type="text"
                      placeholder="Buyer ID (e.g. user-1)"
                      className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSetDefault(template.id, (e.target as HTMLInputElement).value);
                        }
                      }}
                    />
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
