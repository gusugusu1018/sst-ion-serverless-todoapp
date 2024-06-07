const commonConfig = {
  path: 'packages/frontend',
  build: {
    output: 'dist',
    command: 'pnpm run build',
  },
  environment: {},
};

const domainConfig = {
  domain: 'ion-todo.com',
};

// TODO: change stage to 'production' when ready
const webConfig =
  $app.stage === 'uat' ? { ...commonConfig, ...domainConfig } : commonConfig;

export const web = new sst.aws.StaticSite('StaticSite', webConfig);
