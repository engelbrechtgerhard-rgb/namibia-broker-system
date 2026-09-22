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
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

export async function listClientTypes(idToken: string, tenantId: string) {
  const data = await gql(
    idToken,
    `
      query ListClientTypes($tenantId: String!) {
        listClientTypes(filter: { tenantId: { eq: $tenantId } }) {
          items {
            id
            name
            description
          }
        }
      }
    `,
    { tenantId }
  );

  return data.listClientTypes.items;
}

export async function createClientType(idToken: string, input: any) {
  const data = await gql(
    idToken,
    `
      mutation CreateClientType($input: CreateClientTypeInput!) {
        createClientType(input: $input) {
          id
        }
      }
    `,
    { input }
  );

  return data.createClientType;
}

export async function updateClientType(idToken: string, id: string, input: any) {
  const res = await fetch(`/clientTypes/${id}`, {
    method: "PUT",
    headers: {
      Authorization: idToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return res.json();
}

export async function deleteClientType(idToken: string, id: string) {
  const data = await gql(
    idToken,
    `
      mutation DeleteClientType($input: DeleteClientTypeInput!) {
        deleteClientType(input: $input) {
          id
        }
      }
    `,
    { input: { id } }
  );

  return data.deleteClientType;
}