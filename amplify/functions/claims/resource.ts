// cache-bust
import { defineFunction } from '@aws-amplify/backend';

export const claimsFunction = defineFunction({
  name: 'claims-service',
  entry: './handler.ts',
  environment: { TABLE_NAME: 'Claim', EVENT_TABLE: 'ClaimEvent' },
  timeoutSeconds: 29,
});