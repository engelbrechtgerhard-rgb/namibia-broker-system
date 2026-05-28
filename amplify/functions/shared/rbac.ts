import type { APIGatewayProxyHandlerV2WithJWTAuthorizer } from 'aws-lambda';

type JwtEvent = Parameters<APIGatewayProxyHandlerV2WithJWTAuthorizer>[0];

export function getGroups(event: JwtEvent): string[] {
  const raw = event.requestContext.authorizer.jwt.claims['cognito:groups'];
  if (!raw) return [];
  return Array.isArray(raw) ? raw : String(raw).split(',');
}

export const isAdmin  = (groups: string[]) => groups.includes('Admin');
export const isBroker = (groups: string[]) => groups.includes('Broker');

/** Cognito sub — stable unique ID for the authenticated user. */
export function getSub(event: JwtEvent): string {
  return String(event.requestContext.authorizer.jwt.claims['sub'] ?? '');
}

/**
 * Tenant ID sourced exclusively from the verified JWT claim custom:tenantId.
 * This is set by an Admin at user provisioning time and cannot be spoofed
 * by the caller. Never use the x-tenant-id header for access control.
 */
export function getTenantId(event: JwtEvent): string {
  return String(event.requestContext.authorizer.jwt.claims['custom:tenantId'] ?? '');
}

export const respond = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const FORBIDDEN        = respond(403, { message: 'Forbidden' });
export const FORBIDDEN_ADMIN  = respond(403, { message: 'Forbidden: Admin only' });
export const NOT_FOUND        = respond(404, { message: 'Not found' });
export const ROUTE_NOT_FOUND  = respond(404, { message: 'Route not found' });
export const NO_TENANT        = respond(403, { message: 'Forbidden: no tenantId on token' });
