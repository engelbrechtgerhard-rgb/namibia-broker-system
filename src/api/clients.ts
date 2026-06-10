// Temporary in‑memory mock API until backend is rebuilt

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

let mockClients: Client[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "0812345678",
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Smith",
    email: "sarah@example.com",
    phone: "0823456789",
  },
];

export async function listClients(): Promise<Client[]> {
  return mockClients;
}

export async function getClient(id: string): Promise<Client | undefined> {
  return mockClients.find((c) => c.id === id);
}

export async function createClient(input: Omit<Client, "id">): Promise<Client> {
  const newClient: Client = {
    id: crypto.randomUUID(),
    ...input,
  };

  mockClients.push(newClient);
  return newClient;
}

export async function updateClient(id: string, input: Partial<Client>): Promise<Client> {
  const index = mockClients.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Client not found");

  mockClients[index] = { ...mockClients[index], ...input };
  return mockClients[index];
}
