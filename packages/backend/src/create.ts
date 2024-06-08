import { CreateTodoRequest } from '@sst-ion-serverless-todoapp/types';
import * as uuid from 'uuid';

import handler from './core/handler';
import { TaskEntity, TaskEntityType } from './entities/task';

export const main = handler(async (event) => {
  const data = JSON.parse(event.body || '{}') as CreateTodoRequest;

  // Check if title is present in the request body
  if (data.title === undefined) {
    throw new Error('Missing title in request body');
  }

  const claims = event.requestContext.authorizer?.jwt.claims;
  const newTask: TaskEntityType = {
    userId: claims.sub,
    taskId: uuid.v4(),
    title: data.title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  const result = await TaskEntity.create(newTask).go();

  return JSON.stringify(result.data);
});
