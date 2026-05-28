import { getTenantId } from './utils/getTenantId.js';
import { util } from '@aws-appsync/utils';

export function request(ctx) {
  const tenantId = getTenantId(ctx);

  return {
    operation: 'UpdateItem',
    key: { id: ctx.args.input.id },
    condition: {
      expression: 'tenantId = :tenantId',
      expressionValues: { ':tenantId': tenantId },
    },
    update: {
      expression: 'SET #name = :name, updatedAt = :updatedAt',
      expressionNames: { '#name': 'name' },
      expressionValues: {
        ':name': ctx.args.input.name,
        ':updatedAt': util.time.nowISO8601(),
      },
    },
  };
}

export function response(ctx) {
  return ctx.result;
}