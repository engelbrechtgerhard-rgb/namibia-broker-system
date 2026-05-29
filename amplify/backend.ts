// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';

import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { api } from './api/resource';

import { crmFunction } from './functions/crm/resource';
import { policyFunction } from './functions/policy/resource';
import { claimsFunction } from './functions/claims/resource';
import { billingFunction } from './functions/billing/resource';
import { documentsFunction } from './functions/documents/resource';
import { reportingFunction } from './functions/reporting/resource';
import { renewalReminderFunction } from './functions/renewalReminder/resource';

const backend = defineBackend({
  auth,
  data,
  storage,
  api,
  crmFunction,
  policyFunction,
  claimsFunction,
  billingFunction,
  documentsFunction,
  reportingFunction,
  renewalReminderFunction,
});

// Attach routes to the API using Amplify Gen 2 routing
backend.api.addRoutes({
  // CRM
  'ANY /clients': backend.crmFunction,
  'ANY /clients/{proxy+}': backend.crmFunction,

  // Policies
  'ANY /policies': backend.policyFunction,
  'ANY /policies/{proxy+}': backend.policyFunction,

  // Claims
  'ANY /claims': backend.claimsFunction,
  'ANY /claims/{proxy+}': backend.claimsFunction,

  // Billing
  'ANY /billing': backend.billingFunction,
  'ANY /billing/{proxy+}': backend.billingFunction,

  // Documents
  'ANY /documents': backend.documentsFunction,
  'ANY /documents/{proxy+}': backend.documentsFunction,

  // Reports
  'ANY /reports': backend.reportingFunction,
  'ANY /reports/{proxy+}': backend.reportingFunction,
});

// Export API URL + region for the frontend
backend.addOutput({
  custom: {
    API: {
      endpoint: backend.api.url,
      region: backend.api.region,
    },
  },
});