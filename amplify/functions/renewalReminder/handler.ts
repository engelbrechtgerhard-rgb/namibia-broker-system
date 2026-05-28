import type { ScheduledHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.POLICY_TABLE!;

export const handler: ScheduledHandler = async () => {
  const today = new Date();
  const in30Days = new Date(today);
  in30Days.setDate(today.getDate() + 30);
  const cutoff = in30Days.toISOString().split('T')[0];

  const result = await ddb.send(new ScanCommand({
    TableName: TABLE,
    FilterExpression: '#s = :active AND renewalDate <= :cutoff',
    ExpressionAttributeNames: { '#s': 'status' },
    ExpressionAttributeValues: { ':active': 'ACTIVE', ':cutoff': cutoff },
  }));

  const policies = result.Items ?? [];
  console.log(`[RenewalReminder] Found ${policies.length} policies due for renewal within 30 days`);

  for (const policy of policies) {
    await ddb.send(new UpdateCommand({
      TableName: TABLE,
      Key: { policyId: policy.policyId },
      UpdateExpression: 'SET #s = :s',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':s': 'PENDING_RENEWAL' },
    }));
    // TODO: integrate SES/SNS for email/SMS notifications
    console.log(`[RenewalReminder] Flagged policy ${policy.policyId} for renewal`);
  }
};
