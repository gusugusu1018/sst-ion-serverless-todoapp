import { GetCommandInput } from '@aws-sdk/lib-dynamodb';
import { Resource } from 'sst';

import dynamoDb from './core/dynamodb';
import handler from './core/handler';

export const main = handler(async (event) => {
  const claims = event.requestContext.authorizer?.jwt.claims;
  const userId = claims.sub;

  const params: GetCommandInput = {
    TableName: Resource.TaskTable.name,
    Key: {
      userId: userId,
      taskId: event?.pathParameters?.id, // The id of the task from the path
    },
  };

  const result = await dynamoDb.get(params);
  if (!result.Item) {
    throw new Error('Item not found.');
  }

  // Return the retrieved item
  return JSON.stringify(result.Item);
});
