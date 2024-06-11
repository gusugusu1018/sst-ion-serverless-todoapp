import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResult,
} from 'aws-lambda';

import { TaskEntity } from '../entities/task';
import HttpStatusCode from '../lib/utils/HttpStatusCode';

const lambdaHandler = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyResult> => {
  const claims = event.requestContext.authorizer.jwt.claims;
  const userId = claims.sub.toString();
  const tasks = await TaskEntity.query.tasks({ userId }).go({ order: 'asc' });

  return {
    statusCode: HttpStatusCode.OK,
    headers: { contentType: 'application/json' },
    body: JSON.stringify(tasks.data),
  };
};

export const main = middy<APIGatewayProxyEventV2, APIGatewayProxyResult>()
  .use(httpErrorHandler())
  .handler(lambdaHandler);
