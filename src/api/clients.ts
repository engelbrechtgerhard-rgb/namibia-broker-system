import { generateClient } from "aws-amplify/data";

const client = generateClient({ authMode: "userPool" });

export type Client = {
  id: string;
  tenantId: string;
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

export async function listClients(): Promise<Client[]> {
  const { data, errors } = await client.models.Client.list();
  if (errors) throw new Error("Failed to load clients");
  return data;
}

export async function getClientById(id: string): Promise<Client | null> {
  const { data, errors } = await client.models.Client.get({ id });
  if (errors) throw new Error("Failed to load client");
  return data;
}

export async function createClient(input: Omit<Client, "id" | "tenantId" | "createdAt" | "updatedAt">): Promise<Client> {
  const { data, errors } = await client.models.Client.create(input);
  if (errors) throw new Error("Failed to create client");
  return data;
}

export async function updateClient(id: string, input: Partial<Client>): Promise<Client> {
  const { data, errors } = await client.models.Client.update({ id, ...input });
  if (errors) throw new Error("Failed to update client");
  return data;
}
