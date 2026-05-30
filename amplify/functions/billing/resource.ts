// cache-bust
import { defineFunction } from '@aws-amplify/backend';

export const billingFunction = defineFunction({
  name: 'billing-service',
  entry: './handler.ts',
  environment: { TABLE_NAME: 'Billing' },
  timeoutSeconds: 29,
});