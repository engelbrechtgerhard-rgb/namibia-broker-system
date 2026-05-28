import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'brokerDocuments',
  access: (allow) => ({
    // Tenant-scoped client documents
    'clients/{entity_id}/*': [
      allow.groups(['Admin', 'Broker']).to(['read', 'write']),
    ],
    // Tenant-scoped policy documents
    'policies/{entity_id}/*': [
      allow.groups(['Admin', 'Broker']).to(['read', 'write']),
    ],
    // Tenant-scoped claim documents
    'claims/{entity_id}/*': [
      allow.groups(['Admin', 'Broker']).to(['read', 'write']),
    ],
    // Reports — Admin only write, Broker read
    'reports/*': [
      allow.groups(['Admin']).to(['read', 'write', 'delete']),
      allow.groups(['Broker']).to(['read']),
    ],
  }),
});
