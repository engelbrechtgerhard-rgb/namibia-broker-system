// amplify/api/resource.ts
import { a as dataSchemaA } from '@aws-amplify/data-schema';
const dataSchemaApi: any = (dataSchemaA as any).api;

export const api = dataSchemaApi({
  name: 'namibia-broker-api',
  cors: {
    allowOrigins: ['*'],
    allowHeaders: ['Content-Type', 'Authorization', 'x-tenant-id', 'x-user-id'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  },
  // We’ll attach routes in backend.ts so we can reference functions there
});