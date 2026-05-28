import type { Client, Policy, Claim } from '../types';

export const seedClients: Omit<Client, 'tenantId'>[] = [
  { clientId: 'c-001', type: 'INDIVIDUAL', name: 'Johannes Nghipandulwa', email: 'j.nghipandulwa@email.na', phone: '+264 81 234 5678', idNumber: '90010100123', address: '14 Independence Ave, Windhoek', createdAt: '2024-01-10T08:00:00Z' },
  { clientId: 'c-002', type: 'CORPORATE', name: 'Namibia Logistics (Pty) Ltd', email: 'info@namilogistics.na', phone: '+264 61 300 1234', address: '5 Mandume Ndemufayo Ave, Windhoek', createdAt: '2024-02-01T09:00:00Z' },
  { clientId: 'c-003', type: 'INDIVIDUAL', name: 'Maria Shikongo', email: 'm.shikongo@email.na', phone: '+264 85 987 6543', address: '22 Sam Nujoma Drive, Oshakati', createdAt: '2024-03-15T10:00:00Z' },
];

export const seedPolicies: Omit<Policy, 'tenantId'>[] = [
  { policyId: 'p-001', clientId: 'c-001', insurer: 'Mutual & Federal Namibia', policyNumber: 'MFN-2024-001', type: 'Motor', premium: 4500, commission: 450, status: 'ACTIVE', renewalDate: '2025-01-10', inceptionDate: '2024-01-10', createdAt: '2024-01-10T08:00:00Z' },
  { policyId: 'p-002', clientId: 'c-002', insurer: 'Old Mutual Namibia', policyNumber: 'OMN-2024-002', type: 'Commercial', premium: 18000, commission: 2700, status: 'ACTIVE', renewalDate: '2025-02-01', inceptionDate: '2024-02-01', createdAt: '2024-02-01T09:00:00Z' },
  { policyId: 'p-003', clientId: 'c-003', insurer: 'Hollard Namibia', policyNumber: 'HOL-2024-003', type: 'Household', premium: 1200, commission: 120, status: 'PENDING_RENEWAL', renewalDate: '2024-12-15', inceptionDate: '2023-12-15', createdAt: '2023-12-15T10:00:00Z' },
];

export const seedClaims: Omit<Claim, 'tenantId'>[] = [
  { claimId: 'cl-001', policyId: 'p-001', clientId: 'c-001', status: 'UNDER_REVIEW', description: 'Vehicle collision on B1 highway near Okahandja. Third party involved.', incidentDate: '2024-11-20', workflowState: 'ASSESSOR_ASSIGNED', createdAt: '2024-11-21T07:00:00Z' },
  { claimId: 'cl-002', policyId: 'p-002', clientId: 'c-002', status: 'FNOL', description: 'Warehouse roof damage due to heavy rainfall.', incidentDate: '2024-12-01', workflowState: 'NEW', createdAt: '2024-12-02T08:30:00Z' },
];
