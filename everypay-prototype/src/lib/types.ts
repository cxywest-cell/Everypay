// ============================================================================
// Enums
// ============================================================================

export enum Role {
  VIEWER = "VIEWER",
  OPERATOR = "OPERATOR",
  APPROVER = "APPROVER",
  COMPLIANCE = "COMPLIANCE",
  ADMIN = "ADMIN",
}

export enum KYCStatus {
  PENDING = "PENDING",
  DOCUMENTS_UNDER_REVIEW = "DOCUMENTS_UNDER_REVIEW",
  FLAGGED_FOR_REVIEW = "FLAGGED_FOR_REVIEW",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export enum KYBStatus {
  PENDING = "PENDING",
  DOCUMENTS_UNDER_REVIEW = "DOCUMENTS_UNDER_REVIEW",
  FLAGGED_FOR_REVIEW = "FLAGGED_FOR_REVIEW",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export enum SettlementStatus {
  INITIATED = "INITIATED",
  FIAT_RECEIVED = "FIAT_RECEIVED",
  USDT_CONFIRMED = "USDT_CONFIRMED",
  FIAT_TO_USDT_COMPLETE = "FIAT_TO_USDT_COMPLETE",
  USDT_TO_FIAT_IN_PROGRESS = "USDT_TO_FIAT_IN_PROGRESS",
  FIAT_CONVERSION_CONFIRMED = "FIAT_CONVERSION_CONFIRMED",
  USD_HKD_READY = "USD_HKD_READY",
  TRANSFER_IN_PROGRESS = "TRANSFER_IN_PROGRESS",
  TRANSFERRED = "TRANSFERRED",
  SETTLED_PENDING_CONFIRMATION = "SETTLED_PENDING_CONFIRMATION",
  SETTLED = "SETTLED",
  FAILED = "FAILED",
  DISPUTED = "DISPUTED",
}

export enum RateLockStatus {
  PROPOSED = "PROPOSED",
  ACCEPTED = "ACCEPTED",
  LOCKED = "LOCKED",
  EXPIRED = "EXPIRED",
}

export enum Corridor {
  BRL = "BRL",
  ARS = "ARS",
}

export enum SettlementCurrency {
  USD = "USD",
  HKD = "HKD",
}

export enum ProcurementStatus {
  DRAFT = "DRAFT",
  SENT_TO_SELLER = "SENT_TO_SELLER",
  SELLER_RESPONDED = "SELLER_RESPONDED",
  TERMS_PROPOSED = "TERMS_PROPOSED",
  NEGOTIATING = "NEGOTIATING",
  TERMS_ACCEPTED = "TERMS_ACCEPTED",
  PAYMENT_INITIATED = "PAYMENT_INITIATED",
  IN_TRANSIT = "IN_TRANSIT",
  RECEIVED = "RECEIVED",
  SETTLED = "SETTLED",
  DISPUTED = "DISPUTED",
}

export enum InvoiceStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
}

export enum TradePaymentAgreementStatus {
  PROPOSED = "PROPOSED",
  ACCEPTED = "ACCEPTED",
  COUNTER_PROPOSED = "COUNTER_PROPOSED",
  REJECTED = "REJECTED",
}

export enum EvidencePackStatus {
  GENERATED = "GENERATED",
  DOWNLOADED = "DOWNLOADED",
  ARCHIVED = "ARCHIVED",
}

// ============================================================================
// Domain Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  kycStatus: KYCStatus;
  roles: Role[];
  organizationId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  registrationNumber: string;
  kybStatus: KYBStatus;
  beneficialOwners: BeneficialOwner[];
  authorizedSignatories: string[]; // user IDs
  businessActivity: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BeneficialOwner {
  id: string;
  fullName: string;
  ownershipPercentage: number; // >10% requires declaration per FR2
  nationality: string;
  idDocumentType: string;
  idDocumentNumber: string;
}

export interface ProcurementLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  hsCode?: string | null;
  specs?: string | null;
}

export interface Procurement {
  id: string;
  buyerId: string;
  sellerId: string;
  status: ProcurementStatus;
  corridor: string;
  lineItems: ProcurementLineItem[];
  totalAmount: number;
  currency: string;
  dueDate: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

export interface Invoice {
  id: string;
  sellerId: string;
  buyerId: string;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  contractDocumentUrl: string | null;
  totalAmount: number;
  currency: string;
  dueDate: Date | null;
  templateId: string | null;
  templateVersion: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SettlementLeg {
  id: string;
  settlementId: string;
  legOrder: number; // 1: fiat→USDT, 2: USDT→USD/HKD, 3: bank transfer
  status: SettlementStatus;
  amountFrom: number;
  currencyFrom: string;
  amountTo: number;
  currencyTo: string;
  exchangeRate: number;
  fees: number;
  timestamp: Date | null;
  failureReason: string | null;
}

export interface Settlement {
  id: string;
  buyerId: string;
  sellerId: string;
  agreementId: string;
  status: SettlementStatus;
  corridor: Corridor;
  settlementCurrency: SettlementCurrency;
  lockedRate: number;
  fiatAmount: number;
  usdtAmount: number;
  finalAmount: number;
  legs: SettlementLeg[];
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
  disputeReason: string | null;
}

export interface RateLock {
  id: string;
  settlementId: string;
  invoiceId: string;
  status: RateLockStatus;
  lockedRate: number;
  marketRateAtLock: number;
  expiryAt: Date;
  createdAt: Date;
}

export interface TradePaymentAgreement {
  id: string;
  invoiceId: string;
  sellerId: string;
  buyerId: string;
  status: TradePaymentAgreementStatus;
  rateMethod: "PRELOCK"; // INTIME is Phase 2
  proposedRate: number;
  feeBreakdown: FeeBreakdown;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeeBreakdown {
  fxFee: number;
  platformFee: number;
  corridorFee: number;
  totalFees: number;
}

export interface EvidencePack {
  id: string;
  settlementId: string;
  documents: EvidenceDocument[];
  hash: string; // SHA-256 for tamper detection
  createdAt: Date;
  retentionUntil: Date; // 7 years from creation per FR50
  status: EvidencePackStatus;
}

export interface EvidenceDocument {
  id: string;
  type: "order" | "contract" | "invoice" | "logistics" | "customs" | "supporting";
  url: string;
  uploadedAt: Date;
  hash: string;
}

export interface Counterparty {
  id: string;
  companyId: string;
  companyName: string;
  totalSettlements: number;
  totalVolume: number;
  settlementSuccessRate: number; // percentage
  averageDeliveryTimeDays: number;
  disputeRate: number; // percentage
  lastInteractionAt: Date | null;
}

export interface ApprovalChain {
  id: string;
  organizationId: string;
  threshold: number; // amount threshold to trigger approval
  approvers: Approver[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Approver {
  userId: string;
  role: Role;
  order: number;
  status: "pending" | "approved" | "rejected";
  comment: string | null;
  timestamp: Date | null;
}

export interface AuditLog {
  id: string;
  eventType: string;
  settlementId: string | null;
  actor: string; // user ID or "system"
  timestamp: Date;
  hashReference: string; // SHA-256 linking to previous entry
  metadata: Record<string, unknown>;
}

export interface CorridorConfig {
  corridor: Corridor;
  complianceRules: string[];
  currencySymbol: string;
  numberFormat: string;
  partnerApiUptime: number; // percentage
}

export interface InvoiceTemplate {
  id: string;
  sellerId: string;
  name: string;
  version: number;
  lineItems: InvoiceLineItem[];
  contractReference: string | null;
  paymentTerms: string | null;
  defaultForBuyerId: string | null; // per FR86
  createdAt: Date;
  updatedAt: Date;
  supersededBy: string | null; // per FR63 versioning
}

export interface Notification {
  id: string;
  userId: string;
  type: "invoice_received" | "payment_initiated" | "rate_locked" | "settlement_complete" | "approval_required" | "reminder" | "dispute";
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  data: T | null;
  status: "success" | "error";
  error?: string;
}

export type SettlementResponse = ApiResponse<Settlement>;
export type InvoiceResponse = ApiResponse<Invoice>;
export type RateLockResponse = ApiResponse<RateLock>;
export type EvidencePackResponse = ApiResponse<EvidencePack>;
export type CounterpartyResponse = ApiResponse<Counterparty[]>;
export type ApprovalResponse = ApiResponse<ApprovalChain>;

// ============================================================================
// Auth Request / Response Types
// ============================================================================

export interface RegistrationRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  inviteCode?: string;
}

export interface RegistrationResponse {
  data: User | null;
  status: "success" | "error";
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: User | null;
  status: "success" | "error";
  error?: string;
}
