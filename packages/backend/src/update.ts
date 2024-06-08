import { UpdateTodoRequest } from '@sst-ion-serverless-todoapp/types';

import handler from './core/handler';
import { TaskEntity } from './entities/task';

// update complete status of a todo
export const main = handler(async (event) => {
  const data = JSON.parse(event.body || '{}') as UpdateTodoRequest;
  // Check if completed is present in the request body
  if (data.completed === undefined) {
    throw new Error('Missing completed in request body');
  }

  if (event?.pathParameters?.id === undefined) {
    throw new Error('Missing taskId in path parameters');
  }

  const claims = event.requestContext.authorizer?.jwt.claims;

  const result = await TaskEntity.update({
    userId: claims.sub,
    taskId: event?.pathParameters?.id,
  })
    .set({ completed: data.completed })
    .go({ response: 'all_new' });

  return JSON.stringify(result.data);
});
