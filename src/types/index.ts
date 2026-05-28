export type ClientType = 'INDIVIDUAL' | 'CORPORATE';

export interface Client {
  clientId: string;
  tenantId: string;
  type: ClientType;
  name: string;
  email?: string;
  phone?: string;
  idNumber?: string;
  address?: string;
  documents?: string[];
  createdAt: string;
  updatedAt?: string;
}

export type PolicyStatus = 'ACTIVE' | 'LAPSED' | 'CANCELLED' | 'PENDING_RENEWAL';

export interface Policy {
  policyId: string;
  tenantId: string;
  clientId: string;
  insurer: string;
  policyNumber?: string;
  type?: string;
  premium: number;
  commission?: number;
  status: PolicyStatus;
  renewalDate?: string;
  inceptionDate?: string;
  documents?: string[];
  createdAt: string;
}

export interface PolicyVersion {
  versionId: string;
  tenantId: string;
  policyId: string;
  riskItems?: RiskItem[];
  effectiveDate?: string;
  premiumBreakdown?: Record<string, number>;
  endorsementNote?: string;
  createdAt: string;
}

export interface RiskItem {
  description: string;
  value: number;
  category: string;
}

export type ClaimStatus = 'FNOL' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CLOSED';

export interface Claim {
  claimId: string;
  tenantId: string;
  policyId: string;
  clientId: string;
  status: ClaimStatus;
  description: string;
  incidentDate?: string;
  documents?: string[];
  workflowState?: string;
  createdAt: string;
  events?: ClaimEvent[];
}

export interface ClaimEvent {
  eventId: string;
  claimId: string;
  type: string;
  message?: string;
  user: string;
  createdAt: string;
}

export interface Billing {
  billingId: string;
  tenantId: string;
  policyId: string;
  premium: number;
  commission?: number;
  currency: string;
  vatRate: number;
  insurer?: string;
  paid: boolean;
  createdAt: string;
}

export interface AuditLog {
  logId: string;
  tenantId: string;
  entityType: string;
  entityId: string;
  action: string;
  before?: unknown;
  after?: unknown;
  user: string;
  timestamp: string;
}

export interface ReportSummary {
  activePolicies: number;
  openClaims: number;
  totalPremium: number;
  totalCommission: number;
}

export type UserRole = 'Admin' | 'Broker';

export interface AuthUser {
  userId: string;
  email: string;
  tenantId: string;
  role: UserRole;
}
