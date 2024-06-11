import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResult,
} from 'aws-lambda';

import { TaskEntity } from './entities/task';
import HttpStatusCode from './lib/HttpStatusCode';

const lambdaHandler = async (
  event: APIGatewayProxyEventV2WithJWTAuthorizer,
): Promise<APIGatewayProxyResult> => {
  if (!event?.pathParameters?.id) {
    throw new Error('Missing taskId in path parameters');
  }

  const claims = event.requestContext.authorizer.jwt.claims;
  await TaskEntity.delete({
    userId: claims.sub.toString(),
    taskId: event?.pathParameters?.id,
  }).go();

  return {
    statusCode: HttpStatusCode.OK,
    headers: { contentType: 'application/json' },
    body: JSON.stringify({ message: 'Task successfully deleted' }),
  };
};

export const main = middy<APIGatewayProxyEventV2, APIGatewayProxyResult>()
  .use(httpErrorHandler())
  .handler(lambdaHandler);
