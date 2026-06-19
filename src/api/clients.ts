import { generateClient } from "aws-amplify/data";

// Amplify Data API client
const client = generateClient();

// Types come directly from your schema
export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  idNumber?: string;
  taxNumber?: string;
  vatNumber?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
};

// -----------------------------------------------------
// List all clients (automatically filtered by tenantId)
// -----------------------------------------------------
export async function listClients(): Promise<Client[]> {
  const { data, errors } = await client.models.Client.list();

  if (errors) {
    console.error("ListClients errors:", errors);
    throw new Error("Failed to load clients");
  }

  return data;
}

// -----------------------------------------------------
// Get a single client by ID
// -----------------------------------------------------
export async function getClient(id: string): Promise<Client | null> {
  const { data, errors } = await client.models.Client.get({ id });

  if (errors) {
    console.error("GetClient errors:", errors);
    throw new Error("Failed to load client");
  }

  return data;
}

// -----------------------------------------------------
// Create a new client
// Amplify automatically injects:
// - id (UUID)
// - tenantId
// - createdAt
// - updatedAt
// -----------------------------------------------------
export async function createClient(input: Omit<Client, "id">): Promise<Client> {
  const { data, errors } = await client.models.Client.create(input);

  if (errors) {
    console.error("CreateClient errors:", errors);
    throw new Error("Failed to create client");
  }

  return data;
}

// -----------------------------------------------------
// Update an existing client
// -----------------------------------------------------
export async function updateClient(id: string, input: Partial<Client>): Promise<Client> {
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
