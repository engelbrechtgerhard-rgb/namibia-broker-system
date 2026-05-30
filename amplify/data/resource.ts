import { defineData, a } from '@aws-amplify/backend';

import type {
  SecondaryIndexBuilder,
  AuthorizationBuilder,
} from 'amplify-data-builders';

const schema = a.schema({

  Client: a
    .model({
      id:               a.id().required(),
      tenantId:         a.string().required(),
      type:             a.enum(['INDIVIDUAL', 'CORPORATE']),
      name:             a.string().required(),
      email:            a.email(),
      phone:            a.string(),
      idNumber:         a.string(),
      taxNumber:        a.string(),
      vatNumber:        a.string(),
      address:          a.string(),
      documents:        a.string().array(),
      assignedBrokerId: a.string(),
      createdAt:        a.datetime(),
      updatedAt:        a.datetime(),
    })
    .secondaryIndexes((idx: Parameters<SecondaryIndexBuilder>[0]) => [
      idx('tenantId').name('tenantId-index').queryField('listClientsByTenant'),
      idx('assignedBrokerId').name('assignedBrokerId-index').queryField('listClientsByBroker'),
    ])
    .authorization((allow: Parameters<AuthorizationBuilder>[0]) => [
      allow.groups(['Broker']).to(['create', 'read', 'update']),
      allow.groups(['Admin']).to(['read', 'update', 'delete']),
    ]),

  Policy: a
    .model({
      id:               a.id().required(),
      tenantId:         a.string().required(),
      clientId:         a.string().required(),
      assignedBrokerId: a.string(),
      insurer:          a.string().required(),
      policyNumber:     a.string(),
      type:             a.string(),
      premium:          a.float().required(),
      commission:       a.float(),
      status:           a.enum(['ACTIVE', 'LAPSED', 'CANCELLED', 'PENDING_RENEWAL']),
      renewalDate:      a.date(),
      inceptionDate:    a.date(),
      documents:        a.string().array(),
      createdAt:        a.datetime(),
      updatedAt:        a.datetime(),
    })
    .secondaryIndexes((idx: Parameters<SecondaryIndexBuilder>[0]) => [
      idx('tenantId').name('tenantId-index').queryField('listPoliciesByTenant'),
      idx('clientId').name('clientId-index').queryField('listPoliciesByClient'),
      idx('assignedBrokerId').name('assignedBrokerId-index').queryField('listPoliciesByBroker'),
    ])
    .authorization((allow: Parameters<AuthorizationBuilder>[0]) => [
      allow.groups(['Broker']).to(['create', 'read', 'update']),
      allow.groups(['Admin']).to(['read', 'update', 'delete']),
    ]),

  PolicyVersion: a
    .model({
      id:               a.id().required(),
      tenantId:         a.string().required(),
      policyId:         a.string().required(),
      riskItems:        a.json(),
      effectiveDate:    a.date(),
      premiumBreakdown: a.json(),
      endorsementNote:  a.string(),
      createdAt:        a.datetime(),
      updatedAt:        a.datetime(),
    })
    .secondaryIndexes((idx: Parameters<SecondaryIndexBuilder>[0]) => [
      idx('policyId').name('policyId-index').queryField('listVersionsByPolicy'),
    ])
    .authorization((allow: Parameters<AuthorizationBuilder>[0]) => [
      allow.groups(['Admin', 'Broker']).to(['create', 'read']),
    ]),

  Claim: a
    .model({
      id:               a.id().required(),
      tenantId:         a.string().required(),
      policyId:         a.string().required(),
      clientId:         a.string().required(),
      assignedBrokerId: a.string(),
      status:           a.enum(['FNOL', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CLOSED']),
      description:      a.string().required(),
      incidentDate:     a.date(),
      documents:        a.string().array(),
      workflowState:    a.string(),
      createdAt:        a.datetime(),
      updatedAt:        a.datetime(),
    })
    .secondaryIndexes((idx: Parameters<SecondaryIndexBuilder>[0]) => [
      idx('tenantId').name('tenantId-index').queryField('listClaimsByTenant'),
      idx('policyId').name('policyId-index').queryField('listClaimsByPolicy'),
      idx('assignedBrokerId').name('assignedBrokerId-index').queryField('listClaimsByBroker'),
    ])
    .authorization((allow: Parameters<AuthorizationBuilder>[0]) => [
      allow.groups(['Broker']).to(['create', 'read', 'update']),
      allow.groups(['Admin']).to(['read', 'update']),
    ]),

  ClaimEvent: a
    .model({
      id:        a.id().required(),
      claimId:   a.string().required(),
      type:      a.string().required(),
      message:   a.string(),
      user:      a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .secondaryIndexes((idx: Parameters<SecondaryIndexBuilder>[0]) => [
      idx('claimId').name('claimId-index').queryField('listEventsByClaim'),
    ])
    .authorization((allow: Parameters<AuthorizationBuilder>[0]) => [
      allow.groups(['Broker']).to(['create', 'read']),
      allow.groups(['Admin']).to(['create', 'read', 'update', 'delete']),
    ]),

  Billing: a
    .model({
      id:         a.id().required(),
      tenantId:   a.string().required(),
      policyId:   a.string().required(),
      premium:    a.float().required(),
      commission: a.float(),
      currency:   a.string().default('NAD'),
      vatRate:    a.float().default(15),
      insurer:    a.string(),
      paid:       a.boolean().default(false),
      createdAt:  a.datetime(),
      updatedAt: a.datetime(),
    })
    .secondaryIndexes((idx: Parameters<SecondaryIndexBuilder>[0]) => [
      idx('tenantId').name('tenantId-index').queryField('listBillingByTenant'),
      idx('policyId').name('policyId-index').queryField('listBillingByPolicy'),
    ])
    .authorization((allow: Parameters<AuthorizationBuilder>[0]) => [
      allow.groups(['Broker']).to(['read']),
      allow.groups(['Admin']).to(['create', 'read', 'update', 'delete']),
    ]),

  AuditLog: a
    .model({
      id:         a.id().required(),
      tenantId:   a.string().required(),
      entityType: a.string().required(),
      entityId:   a.string().required(),
      action:     a.string().required(),
      before:     a.json(),
      after:      a.json(),
      user:       a.string().required(),
      timestamp:  a.datetime().required(),
    })
    .secondaryIndexes((idx: Parameters<SecondaryIndexBuilder>[0]) => [
      idx('tenantId').name('tenantId-index').queryField('listAuditLogsByTenant'),
    ])
    .authorization((allow: Parameters<AuthorizationBuilder>[0]) => [
      allow.groups(['Broker']).to(['create']),
      allow.groups(['Admin']).to(['create', 'read']),
    ]),

});

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
