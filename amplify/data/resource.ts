import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
  Client: a
    .model({
      id: a.id().required(),
      tenantId: a.string().required(),

      // Individual client fields
      title: a.string(),
      firstName: a.string().required(),
      lastName: a.string().required(),
      idNumber: a.string(),
      email: a.string(),
      phone: a.string(),

      // Company client fields
      companyName: a.string(),
      taxNumber: a.string(),
      vatNumber: a.string(),

      // Contact person fields for company clients
      contactFirstName: a.string(),
      contactLastName: a.string(),
      contactIdNumber: a.string(),
      contactTitle: a.string(),
      contactEmail: a.string(),
      contactPhone: a.string(),

      // Shared Address field
      address: a.string(),

      type: a.string(), // name of CleintType
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .identifier(["id"])
    .authorization((allow) => [allow.ownerDefinedIn("tenantId").identityClaim("custom:tenantId")]),

  Policy: a
    .model({
      id: a.id().required(),
      tenantId: a.string().required(),
      clientId: a.string().required(),
      assignedBrokerId: a.string().required(),
      insurer: a.string().required(),
      policyNumber: a.string(),
      type: a.string().required(),
      premium: a.string().required(),
      commission: a.string().required(),
      status: a.string().required(),
      renewalDate: a.datetime().required(),
      inceptionDate: a.datetime().required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .identifier(["id"])
    .authorization((allow) => [allow.ownerDefinedIn("tenantId").identityClaim("custom:tenantId")]),

  Claim: a
    .model({
      id: a.id().required(),
      tenantId: a.string().required(),
      clientId: a.string().required(),
      policyId: a.string().required(),
      assignedBrokerId: a.string().required(),
      status: a.string().required(),
      description: a.string(),
      incidentDate: a.datetime(),
      workflowState: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .identifier(["id"])
    .authorization((allow) => [allow.ownerDefinedIn("tenantId").identityClaim("custom:tenantId")]),

  Tenant: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .identifier(["id"])
    .authorization((allow) => [allow.authenticated()]),

  AuditLog: a
    .model({
      id: a.id().required(),
      tenantId: a.string().required(),
      entityType: a.string().required(),     // "Client", "Policy", "Claim", etc.
      entityId: a.string().required(),       // ID of the entity
      action: a.string().required(),         // "CREATE", "UPDATE", "DELETE"
      performedBy: a.string().required(),    // user email or sub
      performedByName: a.string(),           // optional: user full name
      timestamp: a.datetime().required(),    // ISO timestamp
      details: a.string(),                   // optional JSON string
    })
    .identifier(["id"])
    .authorization((allow) => [
      // Admins can see all logs
      allow.groups(["Admin"]),

      // Brokers can only see logs for their own tenant
      allow.ownerDefinedIn("tenantId").identityClaim("custom:tenantId"),
    ]),

  ClientType: a
    .model({
      id: a.id().required(),
      tenantId: a.string().required(),
      name: a.string().required(),
      category: a.enum(["INDIVIDUAL", "COMPANY"]).required(),
      description: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .identifier(["id"])
    .authorization((allow) => [
      allow.ownerDefinedIn("tenantId").identityClaim("custom:tenantId"),
      allow.groups(["Admin"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});
