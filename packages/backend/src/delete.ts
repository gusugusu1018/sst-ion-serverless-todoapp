import handler from './core/handler';
import { TaskEntity } from './entities/task';

export const main = handler(async (event) => {
  if (!event?.pathParameters?.id) {
    throw new Error('Missing taskId in path parameters');
  }

  const claims = event.requestContext.authorizer?.jwt.claims;
  await TaskEntity.delete({
    userId: claims.sub,
    taskId: event?.pathParameters?.id,
  }).go();
  return JSON.stringify({ status: true });
});
