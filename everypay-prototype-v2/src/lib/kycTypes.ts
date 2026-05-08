export interface KYCDocument {
  id: string;
  userId: string;
  type: "passport" | "national_id" | "drivers_license";
  documentUrl: string;
  documentNumber: string;
  nationality: string;
  expiryDate: string; // ISO date
  submittedAt: string;
}

export interface LivenessCheck {
  id: string;
  userId: string;
  selfieUrl: string;
  result: "passed" | "failed" | "pending";
  failureReason: string | null;
  checkedAt: string;
}

export interface AddressVerification {
  id: string;
  userId: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  proofDocumentUrl: string;
  submittedAt: string;
}

export interface KycSubmission {
  id: string;
  userId: string;
  idDocument: KYCDocument | null;
  livenessCheck: LivenessCheck | null;
  addressVerification: AddressVerification | null;
  sanctionsScreening: "pending" | "passed" | "flagged";
  submittedAt: string;
  completedAt: string | null;
}

export interface KycSubmissionRequest {
  step: "id_document" | "liveness" | "address";
  userId: string;
  data: Record<string, unknown>;
}

export interface KycSubmissionResponse {
  data: KycSubmission | null;
  status: "success" | "error";
  error?: string;
}
