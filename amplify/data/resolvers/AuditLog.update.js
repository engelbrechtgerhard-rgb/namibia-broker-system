import { util } from '@aws-appsync/utils';

export function request(ctx) {
  util.error("AuditLog entries cannot be updated");
}

export function response(ctx) {
  return ctx.result;
}