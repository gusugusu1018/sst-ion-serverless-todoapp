import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import jsonBodyParser from '@middy/http-json-body-parser';
import { UpdateTodoRequest } from '@sst-ion-serverless-todoapp/types';
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { z } from 'zod';

import { TaskEntity } from '../entities/task';
import zodValidationMiddleware from '../lib/middleware/zod-validator';
import HttpStatusCode from '../lib/utils/HttpStatusCode';

const UpdateTodoRequestSchema = z.object({
  completed: z.boolean(),
});

const lambdaHandler = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer & { body: UpdateTodoRequest },
): Promise<APIGatewayProxyResult> => {
  if (!event?.pathParameters?.id) {
    throw new Error('Missing taskId in path parameters');
  }

  const claims = event.requestContext.authorizer.jwt.claims;

  const result = await TaskEntity.update({
    userId: claims.sub.toString(),
    taskId: event?.pathParameters?.id,
  })
    .set({ completed: event.body.completed })
    .go({ response: 'all_new' });

  return {
    statusCode: HttpStatusCode.OK,
    headers: { contentType: 'application/json' },
    body: JSON.stringify(result.data),
  };
};

export const main = middy<APIGatewayProxyEventV2, APIGatewayProxyResult>()
  .use(jsonBodyParser())
  .use(zodValidationMiddleware(UpdateTodoRequestSchema))
  .use(httpErrorHandler())
  .handler(lambdaHandler);
