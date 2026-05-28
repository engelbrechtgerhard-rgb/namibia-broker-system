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
	  expression: 'SET premium = :premium, commission = :commission, currency = :currency, vatRate = :vatRate, insurer = :insurer, paid = :paid, updatedAt = :updatedAt',
	  expressionValues: {
		':premium': ctx.args.input.premium,
		':commission': ctx.args.input.commission,
		':currency': ctx.args.input.currency,
		':vatRate': ctx.args.input.vatRate,
		':insurer': ctx.args.input.insurer,
		':paid': ctx.args.input.paid,
		':updatedAt': util.time.nowISO8601(),
	  },
	},
  };
}

export function response(ctx) {
  return ctx.result;
}