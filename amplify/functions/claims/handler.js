import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { getGroups, getSub, getTenantId, isAdmin, isBroker, respond, FORBIDDEN_ADMIN, FORBIDDEN, NOT_FOUND, NO_TENANT, ROUTE_NOT_FOUND } from '../shared/rbac';
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.TABLE_NAME;
const EVENT_TABLE = process.env.EVENT_TABLE;
export const handler = async (event) => {
    const method = event.requestContext.http.method;
    const path = event.rawPath;
    const groups = getGroups(event);
    const tenantId = getTenantId(event);
    const user = getSub(event);
    if (!tenantId)
        return NO_TENANT;
    try {
        // ── POST /claims (FNOL) — Admin only ────────────────────────────────────
        if (method === 'POST' && path === '/claims') {
            if (!isAdmin(groups))
                return FORBIDDEN_ADMIN;
            const body = JSON.parse(event.body ?? '{}');
            const id = randomUUID();
            const item = {
                ...body,
                id, tenantId, status: 'FNOL', workflowState: 'NEW',
                createdAt: new Date().toISOString(),
            };
            await ddb.send(new PutCommand({
                TableName: TABLE, Item: item,
                ConditionExpression: 'attribute_not_exists(id)',
            }));
            // ClaimEvent also uses Amplify's auto-generated 'id' as PK
            await ddb.send(new PutCommand({
                TableName: EVENT_TABLE,
                Item: {
                    id: randomUUID(), claimId: id,
                    type: 'FNOL_LOGGED', message: 'Claim logged',
                    user, createdAt: new Date().toISOString(),
                },
            }));
            return respond(201, item);
        }
        // ── GET /claims — Admin: all in tenant ──────────────────────────────────
        if (method === 'GET' && path === '/claims') {
            if (!isAdmin(groups))
                return FORBIDDEN;
            const result = await ddb.send(new QueryCommand({
                TableName: TABLE,
                IndexName: 'tenantId-index',
                KeyConditionExpression: 'tenantId = :t',
                ExpressionAttributeValues: { ':t': tenantId },
            }));
            return respond(200, result.Items ?? []);
        }
        // ── GET /claims/my — Broker: own claims within their tenant ─────────────
        if (method === 'GET' && path === '/claims/my') {
            if (!isBroker(groups) && !isAdmin(groups))
                return FORBIDDEN;
            const brokerId = getSub(event);
            const result = await ddb.send(new QueryCommand({
                TableName: TABLE,
                IndexName: 'assignedBrokerId-index',
                KeyConditionExpression: 'assignedBrokerId = :b',
                FilterExpression: 'tenantId = :t',
                ExpressionAttributeValues: { ':b': brokerId, ':t': tenantId },
            }));
            return respond(200, result.Items ?? []);
        }
        // ── GET /claims/{id} — Admin: any in tenant; Broker: only if assigned ───
        if (method === 'GET' && path.startsWith('/claims/')) {
            if (!isAdmin(groups) && !isBroker(groups))
                return FORBIDDEN;
            const id = path.split('/')[2];
            const [claim, events] = await Promise.all([
                ddb.send(new GetCommand({ TableName: TABLE, Key: { id } })),
                // claimId-index on ClaimEvent stores the claim's 'id' in the claimId attribute
                ddb.send(new QueryCommand({
                    TableName: EVENT_TABLE,
                    IndexName: 'claimId-index',
                    KeyConditionExpression: 'claimId = :c',
                    ExpressionAttributeValues: { ':c': id },
                })),
            ]);
            if (!claim.Item)
                return NOT_FOUND;
            if (claim.Item.tenantId !== tenantId)
                return NOT_FOUND;
            if (isBroker(groups) && !isAdmin(groups) && claim.Item.assignedBrokerId !== getSub(event)) {
                return respond(403, { message: 'Forbidden: not your claim' });
            }
            return respond(200, { ...claim.Item, events: events.Items ?? [] });
        }
        // ── PUT /claims/{id} — Admin only ───────────────────────────────────────
        if (method === 'PUT' && path.startsWith('/claims/')) {
            if (!isAdmin(groups))
                return FORBIDDEN_ADMIN;
            const id = path.split('/')[2];
            const body = JSON.parse(event.body ?? '{}');
            await ddb.send(new UpdateCommand({
                TableName: TABLE,
                Key: { id },
                ConditionExpression: 'attribute_exists(id) AND tenantId = :t',
                UpdateExpression: 'SET #s = :s, workflowState = :w, assignedBrokerId = :b',
                ExpressionAttributeNames: { '#s': 'status' },
                ExpressionAttributeValues: {
                    ':t': tenantId,
                    ':s': body.status,
                    ':w': body.workflowState ?? body.status,
                    ':b': body.assignedBrokerId ?? null,
                },
            }));
            await ddb.send(new PutCommand({
                TableName: EVENT_TABLE,
                Item: {
                    id: randomUUID(), claimId: id,
                    type: 'STATUS_UPDATED', message: `Status → ${body.status}`,
                    user, createdAt: new Date().toISOString(),
                },
            }));
            return respond(200, { id, ...body });
        }
        // ── DELETE /claims/{id} — Admin only ────────────────────────────────────
        if (method === 'DELETE' && path.startsWith('/claims/')) {
            if (!isAdmin(groups))
                return FORBIDDEN_ADMIN;
            const id = path.split('/')[2];
            await ddb.send(new DeleteCommand({
                TableName: TABLE, Key: { id },
                ConditionExpression: 'attribute_exists(id) AND tenantId = :t',
                ExpressionAttributeValues: { ':t': tenantId },
            }));
            return respond(200, { message: 'Deleted', id });
        }
        return ROUTE_NOT_FOUND;
    }
    catch (err) {
        if (err.name === 'ConditionalCheckFailedException') {
            return respond(409, { message: 'Conflict: record already exists, not found, or tenant mismatch' });
        }
        console.error(err);
        return respond(500, { message: 'Internal server error' });
    }
};
