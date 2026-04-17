"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { KybSubmission } from "@/lib/kybTypes";

type KybStep =
  | "business_details"
  | "signatories"
  | "beneficial_owners"
  | "business_activity"
  | "complete";

interface FormErrors {
  [key: string]: string | undefined;
}

interface BeneficialOwnerForm {
  id: string; // temp id
  fullName: string;
  nationality: string;
  ownershipPercentage: string;
  idDocumentType: string;
  idDocumentNumber: string;
  dateOfBirth: string;
  residentialAddress: string;
}

const STEPS: { key: KybStep; label: string; number: number }[] = [
  { key: "business_details", label: "Business Details", number: 1 },
  { key: "signatories", label: "Signatories", number: 2 },
  { key: "beneficial_owners", label: "Beneficial Owners", number: 3 },
  { key: "business_activity", label: "Business Activity", number: 4 },
];

export default function KybPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<KybStep>("business_details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submission, setSubmission] = useState<KybSubmission | null>(null);

  // Business Details form
  const [bizForm, setBizForm] = useState({
    companyName: "",
    registrationNumber: "",
    incorporationDate: "",
    incorporationCountry: "",
    businessType: "corporation",
    registeredAddress: "",
    taxId: "",
  });

  // Signatories form
  const [signatoryOptions, setSignatoryOptions] = useState<string[]>([]);
  const [selectedSignatories, setSelectedSignatories] = useState<string[]>([]);

  // Beneficial Owners form
  const [beneficialOwners, setBeneficialOwners] = useState<BeneficialOwnerForm[]>([
    {
      id: "temp-1",
      fullName: "",
      nationality: "",
      ownershipPercentage: "",
      idDocumentType: "passport",
      idDocumentNumber: "",
      dateOfBirth: "",
      residentialAddress: "",
    },
  ]);

  // Business Activity form
  const [activityForm, setActivityForm] = useState({
    primaryActivity: "",
    industrySector: "",
    expectedMonthlyVolume: "10k-50k",
    primaryCorridor: "BRL",
    settlementCurrency: "USD",
  });

  const userId = searchParams.get("userId") || "user-1";

  useEffect(() => {
    // Fetch existing KYB submission
    fetch(`/api/kyb/${userId}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.data) {
          const s = result.data as KybSubmission;
          setSubmission(s);
          if (s.businessDetails && s.authorizedSignatories.length > 0 && s.beneficialOwners.length > 0 && s.businessActivity) {
            setCurrentStep("complete");
          } else if (s.businessActivity) {
            setCurrentStep("complete");
          } else if (s.beneficialOwners.length > 0) {
            setCurrentStep("business_activity");
          } else if (s.authorizedSignatories.length > 0) {
            setCurrentStep("beneficial_owners");
          } else if (s.businessDetails) {
            setCurrentStep("signatories");
          }
        }
      })
      .catch(() => {});

    // Fetch users for signatory options
    fetch("/api/users")
      .then((res) => res.json())
      .then((result) => {
        if (result.data) {
          const users = result.data as Array<{ id: string; firstName: string; lastName: string; organizationId: string | null }>;
          setSignatoryOptions(users.map((u) => u.id));
        }
      })
      .catch(() => {});
  }, [userId]);

  const validateBusinessDetails = (): boolean => {
    const newErrors: FormErrors = {};
    if (!bizForm.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!bizForm.registrationNumber.trim()) newErrors.registrationNumber = "Registration number is required";
    if (!bizForm.incorporationDate) newErrors.incorporationDate = "Incorporation date is required";
    if (!bizForm.incorporationCountry.trim()) newErrors.incorporationCountry = "Country is required";
    if (!bizForm.registeredAddress.trim()) newErrors.registeredAddress = "Address is required";
    if (!bizForm.taxId.trim()) newErrors.taxId = "Tax ID is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBeneficialOwners = (): boolean => {
    const newErrors: FormErrors = {};
    let totalOwnership = 0;
    beneficialOwners.forEach((owner, i) => {
      if (!owner.fullName.trim()) newErrors[`owner_${i}_fullName`] = "Full name is required";
      if (!owner.nationality.trim()) newErrors[`owner_${i}_nationality`] = "Nationality is required";
      if (!owner.idDocumentNumber.trim()) newErrors[`owner_${i}_idDocumentNumber`] = "ID number is required";
      if (!owner.dateOfBirth) newErrors[`owner_${i}_dateOfBirth`] = "Date of birth is required";
      const pct = parseFloat(owner.ownershipPercentage);
      if (isNaN(pct) || pct <= 0) newErrors[`owner_${i}_ownershipPercentage`] = "Must be > 0";
      totalOwnership += pct || 0;
    });
    if (totalOwnership > 100) newErrors.ownershipPercentage = "Total ownership cannot exceed 100%";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBusinessActivity = (): boolean => {
    const newErrors: FormErrors = {};
    if (!activityForm.primaryActivity.trim()) newErrors.primaryActivity = "Business activity is required";
    if (!activityForm.industrySector.trim()) newErrors.industrySector = "Industry sector is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitStep = async (step: string, data: Record<string, unknown>) => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch(`/api/kyb/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step, userId, data }),
      });

      const result = await response.json();

      if (result.status === "success") {
        setSubmission(result.data);
        if (step === "business_details") setCurrentStep("signatories");
        else if (step === "signatories") setCurrentStep("beneficial_owners");
        else if (step === "beneficial_owners") setCurrentStep("business_activity");
        else if (step === "business_activity") setCurrentStep("complete");
      } else {
        setErrors({ general: result.error || "Submission failed." });
      }
    } catch {
      setErrors({ general: "A network error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBusinessDetailsSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateBusinessDetails()) return;
    submitStep("business_details", { ...bizForm });
  };

  const handleSignatoriesSubmit = () => {
    if (selectedSignatories.length === 0) {
      setErrors({ signatories: "At least one authorized signatory is required" });
      return;
    }
    submitStep("signatories", { signatories: selectedSignatories });
  };

  const addBeneficialOwner = () => {
    setBeneficialOwners((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        fullName: "",
        nationality: "",
        ownershipPercentage: "",
        idDocumentType: "passport",
        idDocumentNumber: "",
        dateOfBirth: "",
        residentialAddress: "",
      },
    ]);
  };

  const removeBeneficialOwner = (id: string) => {
    if (beneficialOwners.length === 1) return;
    setBeneficialOwners((prev) => prev.filter((o) => o.id !== id));
  };

  const updateBeneficialOwner = (id: string, field: string, value: string) => {
    setBeneficialOwners((prev) =>
      prev.map((o) => (o.id === id ? { ...o, [field]: value } : o))
    );
  };

  const handleBeneficialOwnersSubmit = () => {
    if (!validateBeneficialOwners()) return;
    submitStep(
      "beneficial_owners",
      {
        owners: beneficialOwners.map((o) => ({
          fullName: o.fullName.trim(),
          nationality: o.nationality.trim(),
          ownershipPercentage: parseFloat(o.ownershipPercentage),
          idDocumentType: o.idDocumentType,
          idDocumentNumber: o.idDocumentNumber.trim(),
          dateOfBirth: o.dateOfBirth,
          residentialAddress: o.residentialAddress.trim(),
        })),
      }
    );
  };

  const handleBusinessActivitySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateBusinessActivity()) return;
    submitStep("business_activity", { ...activityForm });
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted =
            (step.key === "business_details" && submission?.businessDetails) ||
            (step.key === "signatories" && submission && submission.authorizedSignatories.length > 0) ||
            (step.key === "beneficial_owners" && submission && submission.beneficialOwners.length > 0) ||
            (step.key === "business_activity" && submission?.businessActivity);
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
                className={`mt-2 text-xs text-center ${
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

  const renderBusinessDetailsStep = () => (
    <form onSubmit={handleBusinessDetailsSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Business Registration Details</h3>
        <p className="mt-1 text-sm text-gray-500">
          Provide your company&apos;s registration information. This must match your official business documents.
        </p>
      </div>

      {/* Company Name */}
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
          Company Name
        </label>
        <input
          id="companyName"
          type="text"
          value={bizForm.companyName}
          onChange={(e) => setBizForm((prev) => ({ ...prev, companyName: e.target.value }))}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm ${
            errors.companyName ? "border-red-300" : "border-gray-300"
          }`}
        />
        {errors.companyName && <p className="mt-1 text-xs text-red-600">{errors.companyName}</p>}
      </div>

      {/* Registration Number & Tax ID */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
            Registration Number
          </label>
          <input
            id="registrationNumber"
            type="text"
            value={bizForm.registrationNumber}
            onChange={(e) => setBizForm((prev) => ({ ...prev, registrationNumber: e.target.value }))}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm ${
              errors.registrationNumber ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.registrationNumber && <p className="mt-1 text-xs text-red-600">{errors.registrationNumber}</p>}
        </div>
        <div>
          <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">
            Tax ID
          </label>
          <input
            id="taxId"
            type="text"
            value={bizForm.taxId}
            onChange={(e) => setBizForm((prev) => ({ ...prev, taxId: e.target.value }))}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm ${
              errors.taxId ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.taxId && <p className="mt-1 text-xs text-red-600">{errors.taxId}</p>}
        </div>
      </div>

      {/* Incorporation Date & Country */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="incorporationDate" className="block text-sm font-medium text-gray-700">
            Incorporation Date
          </label>
          <input
            id="incorporationDate"
            type="date"
            value={bizForm.incorporationDate}
            onChange={(e) => setBizForm((prev) => ({ ...prev, incorporationDate: e.target.value }))}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm ${
              errors.incorporationDate ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.incorporationDate && <p className="mt-1 text-xs text-red-600">{errors.incorporationDate}</p>}
        </div>
        <div>
          <label htmlFor="incorporationCountry" className="block text-sm font-medium text-gray-700">
            Incorporation Country
          </label>
          <input
            id="incorporationCountry"
            type="text"
            value={bizForm.incorporationCountry}
            onChange={(e) => setBizForm((prev) => ({ ...prev, incorporationCountry: e.target.value }))}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm ${
              errors.incorporationCountry ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.incorporationCountry && <p className="mt-1 text-xs text-red-600">{errors.incorporationCountry}</p>}
        </div>
      </div>

      {/* Business Type */}
      <div>
        <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
          Business Type
        </label>
        <select
          id="businessType"
          value={bizForm.businessType}
          onChange={(e) => setBizForm((prev) => ({ ...prev, businessType: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm"
        >
          <option value="corporation">Corporation</option>
          <option value="llc">LLC</option>
          <option value="partnership">Partnership</option>
          <option value="sole_proprietorship">Sole Proprietorship</option>
        </select>
      </div>

      {/* Registered Address */}
      <div>
        <label htmlFor="registeredAddress" className="block text-sm font-medium text-gray-700">
          Registered Address
        </label>
        <textarea
          id="registeredAddress"
          rows={3}
          value={bizForm.registeredAddress}
          onChange={(e) => setBizForm((prev) => ({ ...prev, registeredAddress: e.target.value }))}
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm ${
            errors.registeredAddress ? "border-red-300" : "border-gray-300"
          }`}
        />
        {errors.registeredAddress && <p className="mt-1 text-xs text-red-600">{errors.registeredAddress}</p>}
      </div>

      {/* Document Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Certificate of Incorporation
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
            <p className="text-xs text-gray-500">PDF up to 10MB</p>
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
        {isSubmitting ? "Submitting..." : "Submit Business Details"}
      </button>
    </form>
  );

  const renderSignatoriesStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Authorized Signatories</h3>
        <p className="mt-1 text-sm text-gray-500">
          Select which users in your organization are authorized to sign settlement documents.
        </p>
      </div>

      <div className="space-y-3">
        {["user-1", "user-2", "user-3"].map((userIdOpt) => (
          <label key={userIdOpt} className="flex items-center space-x-3 rounded-md border border-gray-200 p-3 hover:bg-gray-50">
            <input
              type="checkbox"
              checked={selectedSignatories.includes(userIdOpt)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedSignatories((prev) => [...prev, userIdOpt]);
                } else {
                  setSelectedSignatories((prev) => prev.filter((id) => id !== userIdOpt));
                }
              }}
              className="h-4 w-4 rounded border-gray-300 text-everypay-600 focus:ring-everypay-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">{userIdOpt}</span>
              <p className="text-xs text-gray-500">
                {userIdOpt === "user-1" ? "Carlos Silva (Alpha Supplies)" :
                 userIdOpt === "user-2" ? "Wei Zhang (Beta Trading)" :
                 "Li Chen (Beta Trading)"}
              </p>
            </div>
          </label>
        ))}
      </div>

      {errors.signatories && (
        <p className="text-xs text-red-600">{errors.signatories}</p>
      )}

      {errors.general && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-700">{errors.general}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleSignatoriesSubmit}
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-everypay-600 hover:bg-everypay-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-everypay-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Confirm Signatories"}
      </button>
    </div>
  );

  const renderBeneficialOwnersStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Beneficial Owners</h3>
          <p className="mt-1 text-sm text-gray-500">
            Declare all individuals with &gt;10% ownership. Per FR2, all beneficial owners must be declared.
          </p>
        </div>
        <button
          type="button"
          onClick={addBeneficialOwner}
          className="inline-flex items-center px-3 py-1.5 border border-everypay-300 rounded-md text-sm font-medium text-everypay-700 bg-everypay-50 hover:bg-everypay-100"
        >
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Owner
        </button>
      </div>

      {errors.ownershipPercentage && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-700">{errors.ownershipPercentage}</p>
        </div>
      )}

      {beneficialOwners.map((owner, index) => (
        <div key={owner.id} className="rounded-lg border border-gray-200 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">Owner #{index + 1}</h4>
            {beneficialOwners.length > 1 && (
              <button
                type="button"
                onClick={() => removeBeneficialOwner(owner.id)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={owner.fullName}
                onChange={(e) => updateBeneficialOwner(owner.id, "fullName", e.target.value)}
                className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm ${
                  errors[`owner_${index}_fullName`] ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors[`owner_${index}_fullName`] && (
                <p className="mt-1 text-xs text-red-600">{errors[`owner_${index}_fullName`]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nationality</label>
              <input
                type="text"
                value={owner.nationality}
                onChange={(e) => updateBeneficialOwner(owner.id, "nationality", e.target.value)}
                className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm ${
                  errors[`owner_${index}_nationality`] ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors[`owner_${index}_nationality`] && (
                <p className="mt-1 text-xs text-red-600">{errors[`owner_${index}_nationality`]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ownership %</label>
              <input
                type="number"
                min="0"
                max="100"
                value={owner.ownershipPercentage}
                onChange={(e) => updateBeneficialOwner(owner.id, "ownershipPercentage", e.target.value)}
                className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm ${
                  errors[`owner_${index}_ownershipPercentage`] ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors[`owner_${index}_ownershipPercentage`] && (
                <p className="mt-1 text-xs text-red-600">{errors[`owner_${index}_ownershipPercentage`]}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={owner.dateOfBirth}
                onChange={(e) => updateBeneficialOwner(owner.id, "dateOfBirth", e.target.value)}
                className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm ${
                  errors[`owner_${index}_dateOfBirth`] ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors[`owner_${index}_dateOfBirth`] && (
                <p className="mt-1 text-xs text-red-600">{errors[`owner_${index}_dateOfBirth`]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">ID Document Type</label>
              <select
                value={owner.idDocumentType}
                onChange={(e) => updateBeneficialOwner(owner.id, "idDocumentType", e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm"
              >
                <option value="passport">Passport</option>
                <option value="national_id">National ID</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ID Number</label>
              <input
                type="text"
                value={owner.idDocumentNumber}
                onChange={(e) => updateBeneficialOwner(owner.id, "idDocumentNumber", e.target.value)}
                className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm ${
                  errors[`owner_${index}_idDocumentNumber`] ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors[`owner_${index}_idDocumentNumber`] && (
                <p className="mt-1 text-xs text-red-600">{errors[`owner_${index}_idDocumentNumber`]}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Residential Address</label>
            <input
              type="text"
              value={owner.residentialAddress}
              onChange={(e) => updateBeneficialOwner(owner.id, "residentialAddress", e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm"
            />
          </div>
        </div>
      ))}

      {errors.general && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-700">{errors.general}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleBeneficialOwnersSubmit}
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-everypay-600 hover:bg-everypay-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-everypay-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Submit Beneficial Owners"}
      </button>
    </div>
  );

  const renderBusinessActivityStep = () => (
    <form onSubmit={handleBusinessActivitySubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Business Activity Declaration</h3>
        <p className="mt-1 text-sm text-gray-500">
          Describe your business activity and expected settlement volumes.
        </p>
      </div>

      {/* Primary Activity */}
      <div>
        <label htmlFor="primaryActivity" className="block text-sm font-medium text-gray-700">
          Primary Business Activity
        </label>
        <input
          id="primaryActivity"
          type="text"
          value={activityForm.primaryActivity}
          onChange={(e) => setActivityForm((prev) => ({ ...prev, primaryActivity: e.target.value }))}
          placeholder="e.g., Import/Export of consumer electronics"
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm ${
            errors.primaryActivity ? "border-red-300" : "border-gray-300"
          }`}
        />
        {errors.primaryActivity && <p className="mt-1 text-xs text-red-600">{errors.primaryActivity}</p>}
      </div>

      {/* Industry Sector */}
      <div>
        <label htmlFor="industrySector" className="block text-sm font-medium text-gray-700">
          Industry Sector
        </label>
        <input
          id="industrySector"
          type="text"
          value={activityForm.industrySector}
          onChange={(e) => setActivityForm((prev) => ({ ...prev, industrySector: e.target.value }))}
          placeholder="e.g., Trading, Manufacturing, Services"
          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm ${
            errors.industrySector ? "border-red-300" : "border-gray-300"
          }`}
        />
        {errors.industrySector && <p className="mt-1 text-xs text-red-600">{errors.industrySector}</p>}
      </div>

      {/* Expected Monthly Volume */}
      <div>
        <label htmlFor="expectedMonthlyVolume" className="block text-sm font-medium text-gray-700">
          Expected Monthly Settlement Volume
        </label>
        <select
          id="expectedMonthlyVolume"
          value={activityForm.expectedMonthlyVolume}
          onChange={(e) => setActivityForm((prev) => ({ ...prev, expectedMonthlyVolume: e.target.value }))}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm"
        >
          <option value="10k-50k">$10,000 - $50,000</option>
          <option value="50k-100k">$50,000 - $100,000</option>
          <option value="100k-500k">$100,000 - $500,000</option>
          <option value="500k+">$500,000+</option>
        </select>
      </div>

      {/* Corridor & Currency */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="primaryCorridor" className="block text-sm font-medium text-gray-700">
            Primary Corridor
          </label>
          <select
            id="primaryCorridor"
            value={activityForm.primaryCorridor}
            onChange={(e) => setActivityForm((prev) => ({ ...prev, primaryCorridor: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm"
          >
            <option value="BRL">BRL (Brazil)</option>
            <option value="ARS">ARS (Argentina)</option>
          </select>
        </div>
        <div>
          <label htmlFor="settlementCurrency" className="block text-sm font-medium text-gray-700">
            Settlement Currency
          </label>
          <select
            id="settlementCurrency"
            value={activityForm.settlementCurrency}
            onChange={(e) => setActivityForm((prev) => ({ ...prev, settlementCurrency: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-everypay-500 focus:outline-none focus:ring-everypay-500 sm:text-sm"
          >
            <option value="USD">USD</option>
            <option value="HKD">HKD</option>
          </select>
        </div>
      </div>

      {/* Supporting Document */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Supporting Document (business plan, financial statements)
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
            <p className="text-xs text-gray-500">PDF up to 10MB</p>
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
        {isSubmitting ? "Submitting..." : "Submit Business Activity"}
      </button>
    </form>
  );

  const renderCompleteStep = () => (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">KYB Verification Complete</h3>
        <p className="mt-2 text-sm text-gray-600">
          Your business entity has been verified. Your organization can now initiate settlements.
        </p>
      </div>

      <div className="rounded-md bg-green-50 p-4 border border-green-200">
        <p className="text-sm text-green-700">
          <strong>Status: VERIFIED</strong><br />
          Organization: {submission?.businessDetails?.companyName || "Your Company"}<br />
          Registration: {submission?.businessDetails?.registrationNumber || "N/A"}
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
      <div className="max-w-3xl mx-auto">
        {/* Step Indicator */}
        {currentStep !== "complete" && renderStepIndicator()}

        {/* Content */}
        <div className="bg-white py-8 px-6 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          {currentStep === "business_details" && renderBusinessDetailsStep()}
          {currentStep === "signatories" && renderSignatoriesStep()}
          {currentStep === "beneficial_owners" && renderBeneficialOwnersStep()}
          {currentStep === "business_activity" && renderBusinessActivityStep()}
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
