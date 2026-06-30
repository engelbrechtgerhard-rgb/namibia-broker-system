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

export type Client = {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  type?: string;
  email?: string;
  phone?: string;
  idNumber?: string;
  taxNumber?: string;
  vatNumber?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
};

const CLIENT_FIELDS = `
  id tenantId type firstName lastName
  email phone idNumber taxNumber vatNumber address
  createdAt updatedAt
`;

export async function listClients(idToken: string): Promise<Client[]> {
  const data = await gql(idToken, `
    query ListClients {
      listClients { items { ${CLIENT_FIELDS} } }
    }
  `);
  return data.listClients.items;
}

export async function getClientById(idToken: string, id: string): Promise<Client | null> {
  const data = await gql(idToken, `
    query GetClient($id: ID!) {
      getClient(id: $id) { ${CLIENT_FIELDS} }
    }
  `, { id });
  return data.getClient;
}

export async function createClient(
  idToken: string,
  input: Omit<Client, "id" | "tenantId" | "createdAt" | "updatedAt">
): Promise<Client> {
  const data = await gql(idToken, `
    mutation CreateClient($input: CreateClientInput!) {
      createClient(input: $input) { ${CLIENT_FIELDS} }
    }
  `, { input });
  return data.createClient;
}

export async function updateClient(
  idToken: string,
  id: string,
  input: Partial<Client>
): Promise<Client> {
  const data = await gql(idToken, `
    mutation UpdateClient($input: UpdateClientInput!) {
      updateClient(input: $input) { ${CLIENT_FIELDS} }
    }
  `, { input: { id, ...input } });
  return data.updateClient;
}
