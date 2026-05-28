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
	  expression: 'SET status = :status, description = :description, incidentDate = :incidentDate, documents = :documents, workflowState = :workflowState, updatedAt = :updatedAt',
	  expressionValues: {
		':status': ctx.args.input.status,
		':description': ctx.args.input.description,
		':incidentDate': ctx.args.input.incidentDate,
		':documents': ctx.args.input.documents,
		':workflowState': ctx.args.input.workflowState,
		':updatedAt': util.time.nowISO8601(),
	  },
	},
  };
}

export function response(ctx) {
  return ctx.result;
}