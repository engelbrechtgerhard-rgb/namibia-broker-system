import { util } from '@aws-appsync/utils';
import { getTenantId } from './utils/getTenantId.js';

export function request(ctx) {
  const tenantId = getTenantId(ctx);

  return {
    operation: 'GetItem',
    key: { id: ctx.args.id },
    // Add a condition to enforce tenant isolation
    // If the record exists but belongs to another tenant, the request fails
    condition: {
      expression: 'tenantId = :tenantId',
      expressionValues: {
        ':tenantId': tenantId,
      },
    },
  };
}

export function response(ctx) {
  if (!ctx.result) {
    util.error('Client not found');
  }
  return ctx.result;
}