export function getTenantId(ctx) {
  return ctx.identity?.claims?.['custom:tenantId'];
}