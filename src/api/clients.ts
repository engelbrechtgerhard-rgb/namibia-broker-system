import { generateClient } from "aws-amplify/data";

const getClient = (accessToken: string) =>
  generateClient({ authMode: "userPool", authToken: accessToken });

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

export async function listClients(accessToken: string): Promise<Client[]> {
  const { data, errors } = await getClient(accessToken).models.Client.list();
  if (errors) throw new Error("Failed to load clients");
  return data;
}

export async function getClientById(accessToken: string, id: string): Promise<Client | null> {
  const { data, errors } = await getClient(accessToken).models.Client.get({ id });
  if (errors) throw new Error("Failed to load client");
  return data;
}

export async function createClient(accessToken: string, input: Omit<Client, "id" | "tenantId" | "createdAt" | "updatedAt">): Promise<Client> {
  const { data, errors } = await getClient(accessToken).models.Client.create(input);
  if (errors) throw new Error("Failed to create client");
  return data;
}

export async function updateClient(accessToken: string, id: string, input: Partial<Client>): Promise<Client> {
  const { data, errors } = await getClient(accessToken).models.Client.update({ id, ...input });
  if (errors) throw new Error("Failed to update client");
  return data;
}
