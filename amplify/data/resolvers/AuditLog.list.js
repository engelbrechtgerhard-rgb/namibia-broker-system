import { getTenantId } from './utils/getTenantId.js';

export function request(ctx) {
  const tenantId = getTenantId(ctx);

  return {
    operation: 'Query',
    index: 'tenantId-index',
    query: {
      expression: 'tenantId = :tenantId',
      expressionValues: { ':tenantId': tenantId },
    },
  };
}

export function response(ctx) {
  return ctx.result.items;
}