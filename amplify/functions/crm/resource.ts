import { defineFunction } from '@aws-amplify/backend';

export const crmFunction = defineFunction({
  name: 'crm-service',
  entry: './handler.ts',
  environment: {
    TABLE_NAME: 'Client',
  },
  timeoutSeconds: 29,
});
