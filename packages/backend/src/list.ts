import { QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { Resource } from 'sst';

import dynamoDb from './core/dynamodb';
import handler from './core/handler';

export const main = handler(async (event) => {
  const claims = event.requestContext.authorizer?.jwt.claims;
  const userId = claims.sub;

  const params: QueryCommandInput = {
    TableName: Resource.TaskTable.name,
    IndexName: 'CreatedAtIndex',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
    ScanIndexForward: true,
  };

  const result = await dynamoDb.query(params);

  return JSON.stringify(result.Items);
});
