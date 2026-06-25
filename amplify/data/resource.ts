import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
  Client: a
    .model({
      id: a.id().required(),
      tenantId: a.string().required(),
      type: a.string(),
      firstName: a.string().required(),
      lastName: a.string().required(),
      email: a.string(),
      phone: a.string(),
      idNumber: a.string(),
      taxNumber: a.string(),
      vatNumber: a.string(),
      address: a.string(),
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
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});
