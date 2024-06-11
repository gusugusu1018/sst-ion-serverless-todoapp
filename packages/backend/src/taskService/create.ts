// import { parser } from '@aws-lambda-powertools/parser/middleware';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import jsonBodyParser from '@middy/http-json-body-parser';
import { CreateTodoRequest } from '@sst-ion-serverless-todoapp/types';
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResult,
} from 'aws-lambda';
import * as uuid from 'uuid';
import { z } from 'zod';

import { TaskEntity, TaskEntityType } from '../entities/task';
import zodValidationMiddleware from '../lib/middleware/zod-validator';
import HttpStatusCode from '../lib/utils/HttpStatusCode';

const CreateTodoRequestSchema = z.object({
  title: z.string(),
});

const lambdaHandler = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer & { body: CreateTodoRequest },
): Promise<APIGatewayProxyResult> => {
  const body: CreateTodoRequest = event.body;

  // create new task
  const claims = event.requestContext.authorizer.jwt.claims;
  const newTask: TaskEntityType = {
    userId: claims.sub.toString(),
    taskId: uuid.v4(),
    title: body.title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  const result = await TaskEntity.create(newTask).go();

  return {
    statusCode: HttpStatusCode.CREATED,
    headers: { contentType: 'application/json' },
    body: JSON.stringify(result.data),
  };
};

export const main = middy<APIGatewayProxyEventV2, APIGatewayProxyResult>()
  .use(jsonBodyParser())
  .use(zodValidationMiddleware(CreateTodoRequestSchema))
  .use(httpErrorHandler())
  .handler(lambdaHandler);
