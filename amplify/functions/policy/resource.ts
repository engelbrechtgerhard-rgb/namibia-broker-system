import { defineFunction } from '@aws-amplify/backend';

export const policyFunction = defineFunction({
  name: 'policy-service',
  entry: './handler.ts',
  environment: { TABLE_NAME: 'Policy', VERSION_TABLE: 'PolicyVersion' },
  timeoutSeconds: 29,
});
