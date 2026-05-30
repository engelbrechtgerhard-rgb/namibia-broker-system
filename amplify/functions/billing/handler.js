import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { getGroups, getTenantId, isAdmin, respond, FORBIDDEN_ADMIN, FORBIDDEN, NO_TENANT, ROUTE_NOT_FOUND } from '../shared/rbac';
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.TABLE_NAME;
export const handler = async (event) => {
    const method = event.requestContext.http.method;
    const path = event.rawPath;
    const groups = getGroups(event);
    const tenantId = getTenantId(event);
    if (!tenantId)
        return NO_TENANT;
    try {
        // ── POST /billing — Admin only ──────────────────────────────────────────
        if (method === 'POST' && path === '/billing') {
            if (!isAdmin(groups))
                return FORBIDDEN_ADMIN;
            const body = JSON.parse(event.body ?? '{}');
            const id = randomUUID();
            const item = {
                ...body,
                id, tenantId, currency: 'NAD',
                vatRate: 15, paid: false, createdAt: new Date().toISOString(),
            };
            await ddb.send(new PutCommand({
                TableName: TABLE, Item: item,
                ConditionExpression: 'attribute_not_exists(id)',
            }));
            return respond(201, item);
        }
        // ── GET /billing — Admin: all in tenant ─────────────────────────────────
        if (method === 'GET' && path === '/billing') {
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
        // ── PUT /billing/{id} — Admin only ─────────────────────────────────────
        if (method === 'PUT' && path.startsWith('/billing/')) {
            if (!isAdmin(groups))
                return FORBIDDEN_ADMIN;
            const id = path.split('/')[2];
            await ddb.send(new UpdateCommand({
                TableName: TABLE,
                Key: { id },
                ConditionExpression: 'attribute_exists(id) AND tenantId = :t',
                UpdateExpression: 'SET paid = :p',
                ExpressionAttributeValues: { ':t': tenantId, ':p': true },
            }));
            return respond(200, { id, paid: true });
        }
        // ── DELETE /billing/{id} — Admin only ──────────────────────────────────
        if (method === 'DELETE' && path.startsWith('/billing/')) {
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
