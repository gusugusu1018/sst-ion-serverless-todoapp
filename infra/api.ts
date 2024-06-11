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
      args: (props) => {
        props.auth = {
          jwt: {
            audiences: [userPoolClient.id],
            issuer: $interpolate`https://cognito-idp.${aws.getRegionOutput().name}.amazonaws.com/${userPool.id}`,
          },
        };
      },
    },
  },
});

api.route('GET /todos', {
  link: [table],
  handler: 'packages/backend/src/list.main',
});

api.route('POST /todos', {
  link: [table],
  handler: 'packages/backend/src/create.main',
});

api.route('PUT /todos/{id}', {
  link: [table],
  handler: 'packages/backend/src/update.main',
});

api.route('DELETE /todos/{id}', {
  link: [table],
  handler: 'packages/backend/src/delete.main',
});
