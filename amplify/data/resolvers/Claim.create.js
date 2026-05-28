import { getTenantId } from './utils/getTenantId.js';

export function request(ctx) {
  const tenantId = getTenantId(ctx);

  return {
    operation: 'PutItem',
    key: { id: ctx.args.input.id ?? util.autoId() },
    attributeValues: {
      ...ctx.args.input,
      tenantId,
      createdAt: util.time.nowISO8601(),
      updatedAt: util.time.nowISO8601(),
    },
  };
}

export function response(ctx) {
  return ctx.result;
}