import amplifyOutputs from "../../amplify_outputs.json";

const APPSYNC_URL = amplifyOutputs.data.url;

async function gql(idToken: string, query: string, variables?: Record<string, unknown>) {
  const res = await fetch(APPSYNC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: idToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (json.errors?.length) {
    console.error("AppSync errors:", json.errors);
    throw new Error(json.errors[0].message);
  }

  return json.data;
}

export async function logAudit(
  idToken: string,
  input: {
    tenantId: string;
    entityType: string;
    entityId: string;
    action: string;
    performedBy: string;
    performedByName?: string;
    timestamp: string;
    details?: string;
  }
) {
  const data = await gql(
    idToken,
    `
      mutation CreateAuditLog($input: CreateAuditLogInput!) {
        createAuditLog(input: $input) {
          id
        }
      }
    `,
    { input }
  );

  return data.createAuditLog;
}

export async function listAuditLogs(idToken: string, tenantId: string, entityId: string) {
  const data = await gql(
    idToken,
    `
      query ListAuditLogs($tenantId: String!, $entityId: ID!) {
        listAuditLogs(
          filter: {
            tenantId: { eq: $tenantId },
            entityId: { eq: $entityId }
          }
        ) {
          items {
            id
            entityType
            entityId
            action
            performedBy
            performedByName
            timestamp
            details
          }
        }
      }
    `,
    { tenantId, entityId }
  );

  return data.listAuditLogs.items;
}