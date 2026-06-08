import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Tenant: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
    })
    .identifier(['id'])
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
});
