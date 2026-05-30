// cache-bust
import { defineFunction } from '@aws-amplify/backend';
export const renewalReminderFunction = defineFunction({
    name: 'renewal-reminder',
    entry: './handler.ts',
    environment: { POLICY_TABLE: 'Policy' },
    timeoutSeconds: 60,
    schedule: 'every day',
});
