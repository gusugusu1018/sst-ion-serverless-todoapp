import handler from './core/handler';
import { TaskEntity } from './entities/task';

export const main = handler(async (event) => {
  const claims = event.requestContext.authorizer?.jwt.claims;
  const userId = claims.sub;
  const tasks = await TaskEntity.query.tasks({ userId }).go({ order: 'asc' });
  return JSON.stringify(tasks.data);
});
