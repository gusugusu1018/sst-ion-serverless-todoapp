export const userPool = new sst.aws.CognitoUserPool('UserPool', {
  usernames: ['email'],
  transform: {
    userPool: {
      accountRecoverySetting: {
        recoveryMechanisms: [
          {
            name: 'verified_email',
            priority: 1,
          },
        ],
      },
      autoVerifiedAttributes: ['email'],
    },
  },
});

const userPoolDomain = new aws.cognito.UserPoolDomain('UserPoolDomain', {
  domain: 'sst-ion-serverless-todoapp',
  userPoolId: userPool.id,
});

export const authUrl = $concat(
  'https://',
  userPoolDomain.domain,
  '.auth.',
  aws.getRegionOutput().name,
  '.amazoncognito.com',
);

export const userPoolClient = userPool.addClient('WebClient', {
  transform: {
    client: {
      callbackUrls: ['https://oauth.pstmn.io/v1/callback'],
      refreshTokenValidity: 1,
    },
  },
});
