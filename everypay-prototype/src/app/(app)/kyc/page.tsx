"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { KycSubmission } from "@/lib/kycTypes";

type KycStep = "id_document" | "liveness" | "address" | "sanctions" | "complete";

interface FormErrors {
  [key: string]: string | undefined;
}

const STEPS: { key: KycStep; label: string; number: number }[] = [
  { key: "id_document", label: "ID Document", number: 1 },
  { key: "liveness", label: "Liveness Check", number: 2 },
  { key: "address", label: "Address Verification", number: 3 },
  { key: "sanctions", label: "Sanctions Screening", number: 4 },
];

export default function KycPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<KycStep>("id_document");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submission, setSubmission] = useState<KycSubmission | null>(null);

  // ID Document form
  const [idForm, setIdForm] = useState({
    type: "passport",
    documentNumber: "",
    nationality: "",
    expiryDate: "",
  });

  // Address form
  const [addressForm, setAddressForm] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  // User ID from login redirect or default mock
  const userId = searchParams.get("userId") || "user-1";

  useEffect(() => {
    // Check existing submission
    fetch(`/api/kyc/${userId}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.data) {
          setSubmission(result.data);
          // Determine current step
          const s = result.data as KycSubmission;
          if (s.idDocument && s.livenessCheck && s.addressVerification && s.completedAt) {
            setCurrentStep("complete");
          } else if (s.addressVerification) {
            setCurrentStep("sanctions");
          } else if (s.livenessCheck) {
            setCurrentStep("address");
          } else if (s.idDocument) {
            setCurrentStep("liveness");
          }
        }
      })
      .catch(() => {
        // No submission yet, start from beginning
      });
  }, [userId]);

  const validateIdDocument = (): boolean => {
    const newErrors: FormErrors = {};
    if (!idForm.documentNumber.trim()) {
      newErrors.documentNumber = "Document number is required";
    }
    if (!idForm.nationality.trim()) {
      newErrors.nationality = "Nationality is required";
    }
    if (!idForm.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAddress = (): boolean => {
    const newErrors: FormErrors = {};
    if (!addressForm.addressLine1.trim()) {
      newErrors.addressLine1 = "Address is required";
    }
    if (!addressForm.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!addressForm.country.trim()) {
      newErrors.country = "Country is required";
    }
    if (!addressForm.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitStep = async (step: KycStep, data: Record<string, unknown>) => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch(`/api/kyc/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step, userId, data }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setSubmission(result.data);
        // Move to next step
        if (step === "id_document") {
          setCurrentStep("liveness");
        } else if (step === "liveness") {
          setCurrentStep("address");
        } else if (step === "address") {
          setCurrentStep("sanctions");
          // Auto-complete sanctions screening after short delay
          setTimeout(() => {
            setCurrentStep("complete");
          }, 2000);
        }
      } else {
        setErrors({ general: result.error || "Submission failed. Please try again." });
      }
    } catch {
      setErrors({ general: "A network error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIdDocumentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateIdDocument()) return;
    submitStep("id_document", {
      type: idForm.type,
      documentNumber: idForm.documentNumber.trim(),
      nationality: idForm.nationality.trim(),
      expiryDate: idForm.expiryDate,
    });
  };

  const handleLivenessSubmit = () => {
    // Mock: liveness check always passes
    submitStep("liveness", { selfieUrl: `/mock/selfie-${userId}.jpg` });
  };

  const handleAddressSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateAddress()) return;
    submitStep("address", {
      ...addressForm,
    });
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted =
            (step.key === "id_document" && submission?.idDocument) ||
            (step.key === "liveness" && submission?.livenessCheck) ||
            (step.key === "address" && submission?.addressVerification) ||
            (step.key === "sanctions" && submission?.completedAt);
          const isCurrent = step.key === currentStep;

          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium ${
                  isCompleted
                    ? "border-everypay-600 bg-everypay-600 text-white"
                    : isCurrent
                    ? "border-everypay-600 text-everypay-600"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`mt-2 text-xs ${
                  isCompleted || isCurrent ? "text-everypay-600 font-medium" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
              {index < STEPS.length - 1 && (
                <div
                  className={`mt-5 h-0.5 w-full ${
                    isCompleted ? "bg-everypay-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderIdDocumentStep = () => (
    <form onSubmit={handleIdDocumentSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Upload Government-Issued ID</h3>
        <p className="mt-1 text-sm text-gray-500">
          Please provide your ID document details. All information is encrypted at rest.
        </p>
      </div>

      {/* Document Type */}
      <div>
        <label htmlFor="docType" className="block text-sm font-medium text-gray-700">
          Document Type
        </label>
        <select
          id="docType"
          value={idForm.type}
          onChange={(e) => setIdForm((prev) => ({ ...prev, type: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm"
        >
          <option value="passport">Passport</option>
          <option value="national_id">National ID</option>
          <option value="drivers_license">Driver&apos;s License</option>
        </select>
      </div>

      {/* Document Number */}
      <div>
        <label htmlFor="docNumber" className="block text-sm font-medium text-gray-700">
          Document Number
        </label>
        <input
          id="docNumber"
          type="text"
          value={idForm.documentNumber}
          onChange={(e) => setIdForm((prev) => ({ ...prev, documentNumber: e.target.value }))}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm ${
            errors.documentNumber ? "border-red-300" : "border-gray-300"
          }`}
        />
        {errors.documentNumber && (
          <p className="mt-1 text-xs text-red-600">{errors.documentNumber}</p>
        )}
      </div>

      {/* Nationality */}
      <div>
        <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
          Nationality
        </label>
        <input
          id="nationality"
          type="text"
          value={idForm.nationality}
          onChange={(e) => setIdForm((prev) => ({ ...prev, nationality: e.target.value }))}
          placeholder="e.g., Brazilian, Chinese"
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm ${
            errors.nationality ? "border-red-300" : "border-gray-300"
          }`}
        />
        {errors.nationality && (
          <p className="mt-1 text-xs text-red-600">{errors.nationality}</p>
        )}
      </div>

      {/* Expiry Date */}
      <div>
        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
          Expiry Date
        </label>
        <input
          id="expiryDate"
          type="date"
          value={idForm.expiryDate}
          onChange={(e) => setIdForm((prev) => ({ ...prev, expiryDate: e.target.value }))}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm ${
            errors.expiryDate ? "border-red-300" : "border-gray-300"
          }`}
        />
        {errors.expiryDate && (
          <p className="mt-1 text-xs text-red-600">{errors.expiryDate}</p>
        )}
      </div>

      {/* Mock File Upload UI */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Document Upload
        </label>
        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-gray-600 justify-center">
              <span className="relative cursor-pointer rounded-md font-medium text-everypay-600 hover:text-everypay-500">
                Upload a file
              </span>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
          </div>
        </div>
      </div>

      {errors.general && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-700">{errors.general}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-everypay-600 hover:bg-everypay-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-everypay-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Submit ID Document"}
      </button>
    </form>
  );

  const renderLivenessStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Liveness Check</h3>
        <p className="mt-1 text-sm text-gray-500">
          Take a selfie to verify your identity. This helps us confirm you are a real person.
        </p>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative h-48 w-48 rounded-full bg-gray-100 border-4 border-everypay-200 flex items-center justify-center overflow-hidden">
          <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <p className="mt-4 text-sm text-gray-600 text-center">
          Position your face within the circle and tap &quot;Take Selfie&quot;
        </p>
      </div>

      <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
        <div className="flex">
          <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Tips:</strong> Good lighting, remove glasses/hat, look directly at camera
            </p>
          </div>
        </div>
      </div>

      {errors.general && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-700">{errors.general}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleLivenessSubmit}
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-everypay-600 hover:bg-everypay-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-everypay-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Checking..." : "Take Selfie & Verify"}
      </button>
    </div>
  );

  const renderAddressStep = () => (
    <form onSubmit={handleAddressSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Address Verification</h3>
        <p className="mt-1 text-sm text-gray-500">
          Provide your residential address. This must match your ID document.
        </p>
      </div>

      {/* Address Line 1 */}
      <div>
        <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
          Address Line 1
        </label>
        <input
          id="addressLine1"
          type="text"
          value={addressForm.addressLine1}
          onChange={(e) => setAddressForm((prev) => ({ ...prev, addressLine1: e.target.value }))}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm ${
            errors.addressLine1 ? "border-red-300" : "border-gray-300"
          }`}
        />
        {errors.addressLine1 && (
          <p className="mt-1 text-xs text-red-600">{errors.addressLine1}</p>
        )}
      </div>

      {/* Address Line 2 */}
      <div>
        <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
          Address Line 2 (optional)
        </label>
        <input
          id="addressLine2"
          type="text"
          value={addressForm.addressLine2}
          onChange={(e) => setAddressForm((prev) => ({ ...prev, addressLine2: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm"
        />
      </div>

      {/* City & State */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            id="city"
            type="text"
            value={addressForm.city}
            onChange={(e) => setAddressForm((prev) => ({ ...prev, city: e.target.value }))}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm ${
              errors.city ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.city && (
            <p className="mt-1 text-xs text-red-600">{errors.city}</p>
          )}
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State/Province
          </label>
          <input
            id="state"
            type="text"
            value={addressForm.state}
            onChange={(e) => setAddressForm((prev) => ({ ...prev, state: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Country & Postal Code */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <input
            id="country"
            type="text"
            value={addressForm.country}
            onChange={(e) => setAddressForm((prev) => ({ ...prev, country: e.target.value }))}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm ${
              errors.country ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.country && (
            <p className="mt-1 text-xs text-red-600">{errors.country}</p>
          )}
        </div>
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
            Postal Code
          </label>
          <input
            id="postalCode"
            type="text"
            value={addressForm.postalCode}
            onChange={(e) => setAddressForm((prev) => ({ ...prev, postalCode: e.target.value }))}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm ${
              errors.postalCode ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.postalCode && (
            <p className="mt-1 text-xs text-red-600">{errors.postalCode}</p>
          )}
        </div>
      </div>

      {/* Mock Proof Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Proof of Address (utility bill, bank statement)
        </label>
        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-gray-600 justify-center">
              <span className="relative cursor-pointer rounded-md font-medium text-everypay-600 hover:text-everypay-500">
                Upload a file
              </span>
            </div>
            <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
          </div>
        </div>
      </div>

      {errors.general && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-700">{errors.general}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-everypay-600 hover:bg-everypay-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-everypay-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Submit Address Verification"}
      </button>
    </form>
  );

  const renderSanctionsStep = () => (
    <div className="space-y-6 text-center">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Sanctions Screening</h3>
        <p className="mt-1 text-sm text-gray-500">
          Running automated sanctions screening against OFAC, UN, EU, and local sanctions lists...
        </p>
      </div>

      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-everypay-200 border-t-everypay-600" />
      </div>

      <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
        <p className="text-sm text-blue-700">
          This usually takes a few seconds. Please wait...
        </p>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">KYC Verification Complete</h3>
        <p className="mt-2 text-sm text-gray-600">
          Your identity has been verified. You now have full access to the Everypay platform.
        </p>
      </div>

      <div className="rounded-md bg-green-50 p-4 border border-green-200">
        <p className="text-sm text-green-700">
          <strong>Status: VERIFIED</strong><br />
          Your KYC status has been updated. You can now create invoices, initiate settlements, and manage your team.
        </p>
      </div>

      <Link
        href="/"
        className="inline-flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-everypay-600 hover:bg-everypay-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-everypay-500 transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );

  return (
    <div className="p-4 lg:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Step Indicator */}
        {currentStep !== "complete" && renderStepIndicator()}

        {/* Content */}
        <div className="bg-white py-8 px-6 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          {currentStep === "id_document" && renderIdDocumentStep()}
          {currentStep === "liveness" && renderLivenessStep()}
          {currentStep === "address" && renderAddressStep()}
          {currentStep === "sanctions" && renderSanctionsStep()}
          {currentStep === "complete" && renderCompleteStep()}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-400">
          Protected by Cregis Security | All data encrypted at rest (AES-256)
        </div>
      </div>
    </div>
  );
}
