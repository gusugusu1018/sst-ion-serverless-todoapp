import { userPool, userPoolClient } from './auth';
import { table } from './database';
import { domain } from './domain';

const corsCommonConfig = {
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
};

// TODO: change stage to 'production' when ready
const corsConfiguration =
  $app.stage === 'uat'
    ? { ...corsCommonConfig, allowOrigins: [$interpolate`https://${domain}`] }
    : { ...corsCommonConfig, allowOrigins: ['*'] };

export const api = new sst.aws.ApiGatewayV2('Api', {
  transform: {
    api: {
      corsConfiguration,
    },
    route: {
      handler: {
        link: [table],
      },
    },
  },
});

const authorizer = api.addAuthorizer({
  name: 'cognitoAuthorizer',
  jwt: {
    issuer: $interpolate`https://cognito-idp.${aws.getRegionOutput().name}.amazonaws.com/${userPool.id}`,
    audiences: [userPoolClient.id],
  },
});

api.route('GET /todos', 'packages/backend/src/taskService/list.main', {
  auth: {
    jwt: {
      authorizer: authorizer.id,
    },
  },
});

api.route('POST /todos', 'packages/backend/src/taskService/create.main', {
  auth: {
    jwt: {
      authorizer: authorizer.id,
    },
  },
});

api.route('PUT /todos/{id}', 'packages/backend/src/taskService/update.main', {
  auth: {
    jwt: {
      authorizer: authorizer.id,
    },
  },
});

api.route(
  'DELETE /todos/{id}',
  'packages/backend/src/taskService/delete.main',
  {
    auth: {
      jwt: {
        authorizer: authorizer.id,
      },
    },
  },
);
