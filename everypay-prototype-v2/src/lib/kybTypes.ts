export interface KybSubmission {
  id: string;
  userId: string;
  // Step 1: Business details
  businessDetails: BusinessDetails | null;
  // Step 2: Authorized signatories
  authorizedSignatories: string[]; // user IDs
  // Step 3: Beneficial owners
  beneficialOwners: BeneficialOwnerDeclaration[];
  // Step 4: Business activity
  businessActivity: BusinessActivityDeclaration | null;
  // Overall status
  status: "pending" | "documents_under_review" | "flagged" | "verified" | "rejected";
  submittedAt: string;
  completedAt: string | null;
}

export interface BusinessDetails {
  companyName: string;
  registrationNumber: string;
  incorporationDate: string; // ISO date
  incorporationCountry: string;
  businessType: string; // corporation, llc, partnership, sole_proprietorship
  registeredAddress: string;
  taxId: string;
  documentUrl: string; // certificate of incorporation
  submittedAt: string;
}

export interface BeneficialOwnerDeclaration {
  id: string;
  fullName: string;
  nationality: string;
  ownershipPercentage: number;
  idDocumentType: string;
  idDocumentNumber: string;
  dateOfBirth: string; // ISO date
  residentialAddress: string;
  sanctionsScreening: "pending" | "passed" | "flagged";
}

export interface BusinessActivityDeclaration {
  primaryActivity: string;
  industrySector: string;
  expectedMonthlyVolume: string; // range: "10k-50k", "50k-100k", "100k-500k", "500k+"
  primaryCorridor: string; // BRL, ARS, or both
  settlementCurrency: string; // USD, HKD
  supportingDocumentUrl: string;
  submittedAt: string;
}

export interface KybSubmissionRequest {
  step: "business_details" | "signatories" | "beneficial_owners" | "business_activity";
  userId: string;
  data: Record<string, unknown>;
}

export interface KybSubmissionResponse {
  data: KybSubmission | null;
  status: "success" | "error";
  error?: string;
}
