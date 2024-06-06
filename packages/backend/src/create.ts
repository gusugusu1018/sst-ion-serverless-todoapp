import { PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { CreateTodoRequest, Todo } from '@sst-ion-serverless-todoapp/types';
import { Resource } from 'sst';
import * as uuid from 'uuid';

import dynamoDb from './core/dynamodb';
import handler from './core/handler';

export const main = handler(async (event) => {
  const data = JSON.parse(event.body || '{}') as CreateTodoRequest;

  // Check if title is present in the request body
  if (data.title === undefined) {
    throw new Error('Missing title in request body');
  }

  const claims = event.requestContext.authorizer?.jwt.claims;
  const todoItem: Todo = {
    userId: claims.sub,
    taskId: uuid.v1(),
    title: data.title,
    completed: false,
    createdAt: Date.now(),
  };

  const params: PutCommandInput = {
    TableName: Resource.TaskTable.name,
    Item: todoItem,
  };

  await dynamoDb.put(params);
  return JSON.stringify(todoItem);
});
