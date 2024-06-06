import { DeleteCommandInput } from '@aws-sdk/lib-dynamodb';
import { Resource } from 'sst';

import dynamoDb from './core/dynamodb';
import handler from './core/handler';

export const main = handler(async (event) => {
  const claims = event.requestContext.authorizer?.jwt.claims;
  const userId = claims.sub;

  const params: DeleteCommandInput = {
    TableName: Resource.TaskTable.name,
    Key: {
      userId: userId,
      taskId: event?.pathParameters?.id, // The id of the note from the path
    },
  };

  await dynamoDb.delete(params);

  return JSON.stringify({ status: true });
});
