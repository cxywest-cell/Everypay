"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Invoice } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  SENT: "bg-blue-100 text-blue-800",
  PAID: "bg-green-100 text-green-800",
  OVERDUE: "bg-red-100 text-red-800",
};

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "user-2";
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/invoices/${params.id}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.data) setInvoice(result.data as Invoice);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleAction = async (action: "send" | "mark_paid" | "mark_overdue") => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/invoices/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const result = await res.json();
      if (result.status === "success" && result.data) {
        setInvoice(result.data as Invoice);
      }
    } catch {
      // Error handled silently
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-everypay-200 border-t-everypay-600" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">Invoice not found</h2>
          <Link href="/invoices" className="mt-4 inline-block text-everypay-600 hover:text-everypay-900 text-sm">
            &larr; Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Invoice {invoice.id}</h1>
            <p className="text-sm text-gray-500">
              Created {new Date(invoice.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Link href="/invoices" className="text-sm text-gray-500 hover:text-gray-700">
            &larr; Back to Invoices
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status & Actions */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[invoice.status]}`}>
                {invoice.status}
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {invoice.currency} {invoice.totalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex space-x-2">
              {invoice.status === "DRAFT" && (
                <button
                  onClick={() => handleAction("send")}
                  disabled={actionLoading}
                  className="px-3 py-1.5 bg-everypay-600 text-white text-sm font-medium rounded-md hover:bg-everypay-700 disabled:opacity-50"
                >
                  Send Invoice
                </button>
              )}
              {invoice.status === "SENT" && (
                <>
                  <button
                    onClick={() => handleAction("mark_paid")}
                    disabled={actionLoading}
                    className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    Mark as Paid
                  </button>
                  <button
                    onClick={() => handleAction("mark_overdue")}
                    disabled={actionLoading}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    Mark Overdue
                  </button>
                </>
              )}
              {invoice.status === "OVERDUE" && (
                <button
                  onClick={() => handleAction("mark_paid")}
                  disabled={actionLoading}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Parties */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-900 mb-3">Parties</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Seller</p>
              <p className="text-sm font-medium text-gray-900">{invoice.sellerId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Buyer</p>
              <p className="text-sm font-medium text-gray-900">{invoice.buyerId}</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-900 mb-3">Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Due Date</p>
              <p className="text-sm text-gray-900">
                {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "Not set"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase">Contract</p>
              <p className="text-sm text-gray-900">
                {invoice.contractDocumentUrl ? (
                  <span className="text-everypay-600">{invoice.contractDocumentUrl}</span>
                ) : (
                  "None attached"
                )}
              </p>
            </div>
            {invoice.templateId && (
              <div>
                <p className="text-xs text-gray-500 uppercase">Template</p>
                <p className="text-sm text-gray-900">
                  {invoice.templateId} (v{invoice.templateVersion})
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 uppercase">Updated</p>
              <p className="text-sm text-gray-900">{new Date(invoice.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-900 mb-3">Line Items</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase py-2">Description</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase py-2">Qty</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase py-2">Unit Price</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase py-2">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.lineItems.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 text-sm text-gray-900">{item.description}</td>
                  <td className="py-2 text-sm text-gray-500 text-right">{item.quantity}</td>
                  <td className="py-2 text-sm font-mono text-gray-900 text-right">
                    {item.currency} {item.unitPrice.toLocaleString()}
                  </td>
                  <td className="py-2 text-sm font-mono font-medium text-gray-900 text-right">
                    {item.currency} {(item.quantity * item.unitPrice).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="pt-3 text-right text-base font-semibold text-gray-900">Total</td>
                <td className="pt-3 text-right text-base font-semibold text-gray-900">
                  {invoice.currency} {invoice.totalAmount.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Payment Agreement CTA for SENT invoices */}
        {invoice.status === "SENT" && (
          <div className="bg-everypay-50 border border-everypay-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-everypay-900 mb-1">Ready to settle this invoice?</h3>
            <p className="text-sm text-everypay-700 mb-3">
              Create a payment agreement to lock in the exchange rate and initiate settlement.
            </p>
            <Link
              href={`/payment-agreements/new?invoiceId=${invoice.id}&sellerId=${invoice.sellerId}&buyerId=${invoice.buyerId}&amount=${invoice.totalAmount}`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-everypay-600 hover:bg-everypay-700"
            >
              Create Payment Agreement
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
