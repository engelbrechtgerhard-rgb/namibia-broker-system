// amplify/api/resource.ts
import { a } from '@aws-amplify/backend';

export const api = a.api({
  name: 'namibia-broker-api',
  cors: {
    allowOrigins: ['*'],
    allowHeaders: ['Content-Type', 'Authorization', 'x-tenant-id', 'x-user-id'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  },
  // We’ll attach routes in backend.ts so we can reference functions there
});