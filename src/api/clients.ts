import { generateClient } from 'aws-amplify/data';

const client = generateClient();

export async function listClients() {
  const { data, errors } = await client.models.Client.list();

  if (errors) {
    console.error("ListClients errors:", errors);
    throw new Error("Failed to load clients");
  }

  return data;
}

export async function getClient(id: string) {
  const { data, errors } = await client.models.Client.get({ id });

  if (errors) {
    console.error("GetClient errors:", errors);
    throw new Error("Failed to load client");
  }

  return data;
}

export async function createClient(input: any) {
  const { data, errors } = await client.models.Client.create(input);

  if (errors) {
    console.error("CreateClient errors:", errors);
    throw new Error("Failed to create client");
  }

  return data;
}

export async function updateClient(id: string, input: any) {
  const { data, errors } = await client.models.Client.update({
    id,
    ...input,
  });

  if (errors) {
    console.error("UpdateClient errors:", errors);
    throw new Error("Failed to update client");
  }

  return data;
}
