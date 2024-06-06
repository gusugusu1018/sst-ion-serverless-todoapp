import { UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { UpdateTodoRequest } from '@sst-ion-serverless-todoapp/types';
import { Resource } from 'sst';

import dynamoDb from './core/dynamodb';
import handler from './core/handler';

// update complete status of a todo
export const main = handler(async (event) => {
  const data = JSON.parse(event.body || '{}') as UpdateTodoRequest;
  // Check if completed is present in the request body
  if (data.completed === undefined) {
    throw new Error('Missing completed in request body');
  }

  const claims = event.requestContext.authorizer?.jwt.claims;
  const userId = claims.sub;

  const params: UpdateCommandInput = {
    TableName: Resource.TaskTable.name,
    Key: {
      userId: userId,
      taskId: event?.pathParameters?.id, // The id of the note from the path
    },
    UpdateExpression: 'SET completed = :completed',
    ExpressionAttributeValues: {
      ':completed': data.completed,
    },
  };

  const result = await dynamoDb.update(params);

  return JSON.stringify(result.Attributes);
});
