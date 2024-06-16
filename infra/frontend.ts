import { api } from './api';
import { authUrl, userPool, userPoolClient } from './auth';
import { domain } from './domain';

const commonConfig = {
  path: 'packages/frontend',
  build: {
    output: 'dist',
    command: 'pnpm run build',
  },
  environment: {
    VITE_API_URL: api.url,
    VITE_REGION: aws.getRegionOutput().name,
    VITE_USER_POOL_ID: userPool.id,
    VITE_USER_POOL_CLIENT_ID: userPoolClient.id,
    VITE_USER_POOL_DOMAIN: authUrl,
  },
};

// TODO: change stage to 'production' when ready
const webConfig =
  $app.stage === 'uat' ? { ...commonConfig, domain } : commonConfig;

export const web = new sst.aws.StaticSite('StaticSite', webConfig);
