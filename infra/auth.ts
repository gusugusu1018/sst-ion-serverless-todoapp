import { table } from './database';
import { domain } from './domain';
import { secret } from './secret';

export const userPool = new sst.aws.CognitoUserPool('UserPool', {
  triggers: {
    postConfirmation: {
      handler: 'packages/backend/src/userService/postConfirmation.main',
      link: [table],
    },
    postAuthentication: {
      handler: 'packages/backend/src/userService/postAuthentication.main',
      link: [table],
    },
  },
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
  domain: $concat($app.name, '-', $app.stage), // Amazon Cognito domain
  userPoolId: userPool.id,
});

export const googleIdProvider = new aws.cognito.IdentityProvider(
  'GoogleIdProvider',
  {
    userPoolId: userPool.id,
    providerName: 'Google',
    providerType: 'Google',
    providerDetails: {
      authorize_scopes: 'email',
      client_id: secret.idpConfig.googleClientId.value,
      client_secret: secret.idpConfig.googleClientSecret.value,
    },
    attributeMapping: {
      email: 'email',
      username: 'sub',
    },
  },
);

export const authUrl = $concat(
  userPoolDomain.domain,
  '.auth.',
  aws.getRegionOutput().name,
  '.amazoncognito.com',
);

// TODO: change stage to 'production' when ready
const callbackUrls =
  $app.stage === 'uat'
    ? [$interpolate`https://${domain}`]
    : [
        $interpolate`https://${domain}`,
        'https://oauth.pstmn.io/v1/callback',
        'http://localhost:5173',
      ];

const logoutUrls =
  $app.stage === 'uat'
    ? [$interpolate`https://${domain}`]
    : [$interpolate`https://${domain}`, 'http://localhost:5173'];

export const userPoolClient = userPool.addClient('WebClient', {
  transform: {
    client: {
      allowedOauthFlows: ['code'],
      callbackUrls: callbackUrls,
      logoutUrls: logoutUrls,
      refreshTokenValidity: 1,
      supportedIdentityProviders: ['COGNITO', 'Google'],
    },
  },
});
