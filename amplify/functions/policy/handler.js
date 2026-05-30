import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { getGroups, getSub, getTenantId, isAdmin, isBroker, respond, FORBIDDEN_ADMIN, FORBIDDEN, NOT_FOUND, NO_TENANT, ROUTE_NOT_FOUND } from '../shared/rbac';
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.TABLE_NAME;
const VERSION_TABLE = process.env.VERSION_TABLE;
export const handler = async (event) => {
    const method = event.requestContext.http.method;
    const path = event.rawPath;
    const groups = getGroups(event);
    const tenantId = getTenantId(event);
    if (!tenantId)
        return NO_TENANT;
    try {
        // ── POST /policies — Admin only ─────────────────────────────────────────
        if (method === 'POST' && path === '/policies') {
            if (!isAdmin(groups))
                return FORBIDDEN_ADMIN;
            const body = JSON.parse(event.body ?? '{}');
            const id = randomUUID();
            const item = {
                ...body,
                id, tenantId, status: 'ACTIVE',
                createdAt: new Date().toISOString(),
            };
            await ddb.send(new PutCommand({
                TableName: TABLE, Item: item,
                ConditionExpression: 'attribute_not_exists(id)',
            }));
            return respond(201, item);
        }
        // ── GET /policies — Admin: all in tenant ────────────────────────────────
        if (method === 'GET' && path === '/policies') {
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
        // ── GET /policies/my — Broker: own policies within their tenant ─────────
        if (method === 'GET' && path === '/policies/my') {
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
        // ── GET /policies/{id} — Admin: any in tenant; Broker: only if assigned ─
        if (method === 'GET' && path.startsWith('/policies/')) {
            if (!isAdmin(groups) && !isBroker(groups))
                return FORBIDDEN;
            const id = path.split('/')[2];
            const result = await ddb.send(new GetCommand({ TableName: TABLE, Key: { id } }));
            if (!result.Item)
                return NOT_FOUND;
            if (result.Item.tenantId !== tenantId)
                return NOT_FOUND;
            if (isBroker(groups) && !isAdmin(groups) && result.Item.assignedBrokerId !== getSub(event)) {
                return respond(403, { message: 'Forbidden: not your policy' });
            }
            return respond(200, result.Item);
        }
        // ── POST /policies/{id}/endorse — Admin only ────────────────────────────
        if (method === 'POST' && path.includes('/endorse')) {
            if (!isAdmin(groups))
                return FORBIDDEN_ADMIN;
            const policyId = path.split('/')[2];
            const body = JSON.parse(event.body ?? '{}');
            const version = {
                ...body,
                id: randomUUID(), policyId, tenantId,
                createdAt: new Date().toISOString(),
            };
            await ddb.send(new PutCommand({
                TableName: VERSION_TABLE, Item: version,
                ConditionExpression: 'attribute_not_exists(id)',
            }));
            return respond(201, version);
        }
        // ── PUT /policies/{id} — Admin only ────────────────────────────────────
        if (method === 'PUT' && path.startsWith('/policies/')) {
            if (!isAdmin(groups))
                return FORBIDDEN_ADMIN;
            const id = path.split('/')[2];
            const body = JSON.parse(event.body ?? '{}');
            await ddb.send(new UpdateCommand({
                TableName: TABLE,
                Key: { id },
                ConditionExpression: 'attribute_exists(id) AND tenantId = :t',
                UpdateExpression: 'SET #s = :s, renewalDate = :r, premium = :p, assignedBrokerId = :b',
                ExpressionAttributeNames: { '#s': 'status' },
                ExpressionAttributeValues: {
                    ':t': tenantId,
                    ':s': body.status, ':r': body.renewalDate,
                    ':p': body.premium, ':b': body.assignedBrokerId ?? null,
                },
            }));
            return respond(200, { id, ...body });
        }
        // ── DELETE /policies/{id} — Admin only ─────────────────────────────────
        if (method === 'DELETE' && path.startsWith('/policies/')) {
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
