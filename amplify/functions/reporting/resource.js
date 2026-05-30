// cache-bust
import { defineFunction } from '@aws-amplify/backend';
export const reportingFunction = defineFunction({
    name: 'reporting-service',
    entry: './handler.ts',
    environment: { POLICY_TABLE: 'Policy', CLAIM_TABLE: 'Claim', BILLING_TABLE: 'Billing' },
    timeoutSeconds: 29,
});
