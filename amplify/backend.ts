import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { crmFunction } from './functions/crm/resource';
import { policyFunction } from './functions/policy/resource';
import { claimsFunction } from './functions/claims/resource';
import { billingFunction } from './functions/billing/resource';
import { documentsFunction } from './functions/documents/resource';
import { reportingFunction } from './functions/reporting/resource';
import { renewalReminderFunction } from './functions/renewalReminder/resource';
import { Stack } from 'aws-cdk-lib';
import { RestApi, LambdaIntegration, CognitoUserPoolsAuthorizer, AuthorizationType } from 'aws-cdk-lib/aws-apigateway';

const backend = defineBackend({
  auth,
  data,
  storage,
  crmFunction,
  policyFunction,
  claimsFunction,
  billingFunction,
  documentsFunction,
  reportingFunction,
  renewalReminderFunction,
});

// ── API Gateway ──────────────────────────────────────────────────────────────
const apiStack = backend.createStack('BrokerApiStack');
const userPool = backend.auth.resources.userPool;

const authorizer = new CognitoUserPoolsAuthorizer(apiStack, 'BrokerAuthorizer', {
  cognitoUserPools: [userPool],
});

const api = new RestApi(apiStack, 'BrokerApi', {
  restApiName: 'namibia-broker-api',
  defaultCorsPreflightOptions: {
    allowOrigins: ['*'],
    allowHeaders: ['Content-Type', 'Authorization', 'x-tenant-id', 'x-user-id'],
  },
});

const authOptions = { authorizer, authorizationType: AuthorizationType.COGNITO };

// Mount each service
const routes: [string, string][] = [
  ['clients', 'crmFunction'],
  ['policies', 'policyFunction'],
  ['claims', 'claimsFunction'],
  ['billing', 'billingFunction'],
  ['documents', 'documentsFunction'],
  ['reports', 'reportingFunction'],
];

for (const [path, fnKey] of routes) {
  const fn = backend[fnKey as keyof typeof backend].resources.lambda;
  const resource = api.root.addResource(path);
  resource.addMethod('ANY', new LambdaIntegration(fn), authOptions);
  resource.addResource('{proxy+}').addMethod('ANY', new LambdaIntegration(fn), authOptions);
}

// Export API URL for frontend
backend.addOutput({
  custom: {
    API: {
      endpoint: api.url,
      region: Stack.of(apiStack).region,
    },
  },
});
