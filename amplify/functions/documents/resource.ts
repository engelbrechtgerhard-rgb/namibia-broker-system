// cache-bust
import { defineFunction } from '@aws-amplify/backend';

export const documentsFunction = defineFunction({
  name: 'documents-service',
  entry: './handler.ts',
  environment: { BUCKET_NAME: process.env.STORAGE_BROKERDOCUMENTS_BUCKET_NAME ?? '' },
  timeoutSeconds: 29,
});