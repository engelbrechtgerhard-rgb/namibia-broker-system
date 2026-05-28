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
	  expression: 'SET insurer = :insurer, policyNumber = :policyNumber, type = :type, premium = :premium, commission = :commission, status = :status, renewalDate = :renewalDate, inceptionDate = :inceptionDate, documents = :documents, updatedAt = :updatedAt',
	  expressionValues: {
		':insurer': ctx.args.input.insurer,
		':policyNumber': ctx.args.input.policyNumber,
		':type': ctx.args.input.type,
		':premium': ctx.args.input.premium,
		':commission': ctx.args.input.commission,
		':status': ctx.args.input.status,
		':renewalDate': ctx.args.input.renewalDate,
		':inceptionDate': ctx.args.input.inceptionDate,
		':documents': ctx.args.input.documents,
		':updatedAt': util.time.nowISO8601(),
	  },
	},
  };
}

export function response(ctx) {
  return ctx.result;
}