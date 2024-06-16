import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { Amplify } from 'aws-amplify';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import theme from './theme';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
      signUpVerificationMethod: 'code',
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_USER_POOL_DOMAIN,
          scopes: ['email'],
          redirectSignIn: ['http://localhost:5173', 'https://ion-todo.com'],
          redirectSignOut: ['http://localhost:5173', 'https://ion-todo.com'],
          responseType: 'code',
          providers: ['Google'],
        },
      },
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
