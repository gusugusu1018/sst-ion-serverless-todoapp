export const web = new sst.aws.StaticSite('StaticSite', {
  path: 'packages/frontend',
  build: {
    output: 'dist',
    command: 'npm run build',
  },
  environment: {},
});
