import type { APIGatewayProxyHandlerV2WithJWTAuthorizer } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { getGroups, getSub, getTenantId, isAdmin, isBroker, respond, FORBIDDEN, NO_TENANT, ROUTE_NOT_FOUND } from '../shared/rbac';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const byTenant = (table: string, tenantId: string) =>
  ddb.send(new QueryCommand({
    TableName: table,
    IndexName: 'tenantId-index',
    KeyConditionExpression: 'tenantId = :t',
    ExpressionAttributeValues: { ':t': tenantId },
  }));

const byBroker = (table: string, brokerId: string, tenantId: string) =>
  ddb.send(new QueryCommand({
    TableName: table,
    IndexName: 'assignedBrokerId-index',
    KeyConditionExpression: 'assignedBrokerId = :b',
    FilterExpression: 'tenantId = :t',
    ExpressionAttributeValues: { ':b': brokerId, ':t': tenantId },
  }));

export const handler: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (event) => {
  const path     = event.rawPath;
  const groups   = getGroups(event);
  const tenantId = getTenantId(event);

  if (!tenantId) return NO_TENANT;
  if (!isAdmin(groups) && !isBroker(groups)) return FORBIDDEN;

  const adminView = isAdmin(groups);
  const brokerId  = getSub(event);
  const POLICY_T  = process.env.POLICY_TABLE!;
  const CLAIM_T   = process.env.CLAIM_TABLE!;
  const BILLING_T = process.env.BILLING_TABLE!;

  const fetch = adminView
    ? (t: string) => byTenant(t, tenantId)
    : (t: string) => byBroker(t, brokerId, tenantId);

  try {
    if (path === '/reports/summary') {
      const [policies, claims, billing] = await Promise.all([
        fetch(POLICY_T),
        fetch(CLAIM_T),
        // Billing has no assignedBrokerId — Brokers see zero billing totals
        adminView ? byTenant(BILLING_T, tenantId) : Promise.resolve({ Items: [] }),
      ]);
      const activePolicies  = (policies.Items ?? []).filter((p) => p.status === 'ACTIVE');
      const openClaims      = (claims.Items ?? []).filter((c) => !['CLOSED', 'REJECTED'].includes(c.status));
      const totalPremium    = (billing.Items ?? []).reduce((s, b) => s + (b.premium ?? 0), 0);
      const totalCommission = (billing.Items ?? []).reduce((s, b) => s + (b.commission ?? 0), 0);
      return respond(200, { activePolicies: activePolicies.length, openClaims: openClaims.length, totalPremium, totalCommission });
    }

    if (path === '/reports/policies') {
      const result = await fetch(POLICY_T);
      return respond(200, result.Items ?? []);
    }

    if (path === '/reports/claims') {
      const result = await fetch(CLAIM_T);
      return respond(200, result.Items ?? []);
    }

    return ROUTE_NOT_FOUND;
  } catch (err) {
    console.error(err);
    return respond(500, { message: 'Internal server error' });
  }
};
